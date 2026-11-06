import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/requests/schemas/request.schema';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { Host, HostSchema } from 'src/hosts/schemas/host.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { WsTokenVerifier } from './ws-token-verifier';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Request.name, schema: RequestSchema },
      { name: Host.name, schema: HostSchema },
    ]),
    FirebaseModule,
  ],
  providers: [ChatGateway, ChatService, WsTokenVerifier],
  exports: [ChatService],
})
export class ChatModule {}
