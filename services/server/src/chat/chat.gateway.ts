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

  @SubscribeMessage('send_message')
  async handleEvent(
    @MessageBody()
    payload: CreateMessageDto,
    // @ConnectedSocket() client: Socket,
  ): Promise<CreateMessageDto> {
    this.logger.log(payload);
    this.server.emit('new_message', payload);
    return payload;
  }
}
