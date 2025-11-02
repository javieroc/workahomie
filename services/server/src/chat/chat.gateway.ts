import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { SigningKey, JwksClient } from 'jwks-rsa';
import { CreateMessageDto } from './dto/message.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);

  private client: JwksClient = jwksRsa({
    jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
  });

  constructor(private readonly chatService: ChatService) {}

  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
    this.client.getSigningKey(header.kid!, (err: Error | null, key: SigningKey) => {
      if (err) {
        callback(err, undefined);
        return;
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  // Validate token on connection
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      this.logger.warn(`Client ${client.id} connected without token`);
      client.disconnect();
      return;
    }

    jwt.verify(
      token,
      this.getKey.bind(this),
      {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER_URL,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          this.logger.warn(`Client ${client.id} failed auth: ${err.message}`);
          client.disconnect();
          return;
        }
        // eslint-disable-next-line
        client.data.user = decoded; // attach user info
        this.logger.warn(`Client ${client.id} authenticated as ${decoded.sub}`);
      },
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    const { user } = client.data;
    if (!user) return;

    this.logger.log(`User ${user.sub} joined room ${roomId}`);
    client.join(roomId);
  }

  @SubscribeMessage('send_message')
  async handleEvent(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { user } = client.data;
    this.logger.log(`Message from User ${user?.sub} - payload ${JSON.stringify(payload)}`);

    await this.chatService.create(payload);

    // send to everyone else in the room (exclude the sending socket)
    client.to(payload.requestId).emit('new_message', payload);

    // send to the sender's socket(s) only once:
    // - If you want the server to confirm/save then push to sender as well, use:
    client.emit('new_message', payload);
  }
}
