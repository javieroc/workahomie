import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  // ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
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

  constructor(private readonly chatService: ChatService) {}

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('send_message')
  async handleEvent(
    @MessageBody()
    payload: CreateMessageDto,
    // @ConnectedSocket() client: Socket,
  ): Promise<CreateMessageDto> {
    this.logger.log(payload);
    await this.chatService.create(payload);
    this.server.emit('new_message', payload);
    return payload;
  }
}
