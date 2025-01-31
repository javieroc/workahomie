import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/requests/schemas/request.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Request.name, schema: RequestSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
