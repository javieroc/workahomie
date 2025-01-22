import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { CreateMessageDto } from './dto/message.dto';
// import { Message } from './schemas/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: CreateMessageDto,
  ): Promise<CreateMessageDto> {
    this.logger.log(payload);
    this.server.emit('chat', payload);
    return payload;
  }
}
