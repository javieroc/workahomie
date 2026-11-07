import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/chat/schemas/message.schema';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { Host, HostSchema } from 'src/hosts/schemas/host.schema';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request, RequestSchema } from './schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Host.name, schema: HostSchema },
    ]),
    FirebaseModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
