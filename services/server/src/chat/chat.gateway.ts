import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { corsOrigin } from 'src/common/cors';
import { userIdFromSub } from 'src/authz/current-user-id.decorator';
import { ChatMessage, MAX_MESSAGE_LENGTH, SendMessagePayload } from './dto/message.dto';
import { ChatService } from './chat.service';
import { WsTokenVerifier } from './ws-token-verifier';

export type Ack<T = object> = ({ ok: true } & T) | { ok: false; error: string };

type SocketMiddleware = Parameters<Server['use']>[0];

const optionalString = (value: unknown, max = 500): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined;

const roomIdFrom = (payload: unknown): string | undefined => {
  if (typeof payload === 'string') return payload;
  if (payload && typeof payload === 'object' && 'requestId' in payload) {
    const { requestId } = payload as { requestId: unknown };
    return typeof requestId === 'string' ? requestId : undefined;
  }
  return undefined;
};

/**
 * Socket contract (see README):
 * - handshake `auth.token` = Auth0 access token (verified in a middleware before `connection`)
 * - `join_room(requestId)` / `leave_room(requestId)` → ack `{ ok, error? }`
 * - `send_message({ requestId, message, userName?, userAvatar? })` → ack; broadcasts `new_message`
 */
@WebSocketGateway({
  cors: { origin: corsOrigin },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly tokenVerifier: WsTokenVerifier,
  ) {}

  afterInit(server: Server) {
    server.use(this.authMiddleware);
  }

  /** Runs before `connection`, so no event can be handled before the token is verified. */
  readonly authMiddleware: SocketMiddleware = async (socket, next) => {
    const raw = socket.handshake.auth?.token;
    const token = typeof raw === 'string' ? raw.replace(/^Bearer\s+/i, '') : undefined;
    if (!token) {
      this.logger.warn(`Client ${socket.id} connected without token`);
      next(new Error('Unauthorized'));
      return;
    }
    try {
      // eslint-disable-next-line no-param-reassign
      socket.data.user = await this.tokenVerifier.verify(token);
      next();
    } catch (err) {
      this.logger.warn(`Client ${socket.id} failed auth: ${(err as Error).message}`);
      next(new Error('Unauthorized'));
    }
  };

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} authenticated as ${client.data.user?.sub}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private userIdOf(client: Socket): string | undefined {
    return userIdFromSub(client.data?.user?.sub);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<Ack> {
    const userId = this.userIdOf(client);
    if (!userId) return { ok: false, error: 'Unauthorized' };

    const requestId = roomIdFrom(payload);
    if (!requestId || !isValidObjectId(requestId)) return { ok: false, error: 'Invalid room' };

    const participants = await this.chatService.getParticipants(requestId);
    if (!participants) return { ok: false, error: 'Room not found' };
    if (!this.chatService.isParticipant(participants, userId)) {
      this.logger.warn(`User ${userId} tried to join room ${requestId}`);
      return { ok: false, error: 'Forbidden' };
    }

    await client.join(requestId);
    return { ok: true };
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<Ack> {
    const requestId = roomIdFrom(payload);
    if (!requestId) return { ok: false, error: 'Invalid room' };
    await client.leave(requestId);
    return { ok: true };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ): Promise<Ack<{ message: ChatMessage }>> {
    const userId = this.userIdOf(client);
    if (!userId) return { ok: false, error: 'Unauthorized' };

    const requestId = payload?.requestId;
    if (typeof requestId !== 'string' || !isValidObjectId(requestId)) {
      return { ok: false, error: 'Invalid room' };
    }

    const text = typeof payload.message === 'string' ? payload.message.trim() : '';
    if (!text) return { ok: false, error: 'Message cannot be empty' };
    if (text.length > MAX_MESSAGE_LENGTH) {
      return { ok: false, error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters` };
    }

    const participants = await this.chatService.getParticipants(requestId);
    if (!participants) return { ok: false, error: 'Room not found' };
    if (!this.chatService.isParticipant(participants, userId)) {
      return { ok: false, error: 'Forbidden' };
    }

    const tokenEmail = client.data.user?.email;
    let saved: ChatMessage;
    try {
      saved = await this.chatService.create({
        requestId,
        userId,
        message: text,
        userName: optionalString(payload.userName),
        userAvatar: optionalString(payload.userAvatar, 2048),
        userEmail: typeof tokenEmail === 'string' ? tokenEmail : optionalString(payload.userEmail),
      });
    } catch (err) {
      this.logger.error(`Could not save message: ${(err as Error).message}`);
      return { ok: false, error: 'Could not send message' };
    }

    this.server.to(requestId).emit('new_message', saved);
    await this.chatService.notifyRecipient(participants, saved);

    return { ok: true, message: saved };
  }
}
