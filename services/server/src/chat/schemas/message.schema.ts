import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RequestDocument } from 'src/requests/schemas/request.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  message: string;

  @Prop()
  timeSent: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Request' })
  request: RequestDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
