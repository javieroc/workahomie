import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  userEmail: string;

  @Prop()
  userAvatar: string;

  @Prop()
  message: string;

  @Prop()
  timeSent: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
