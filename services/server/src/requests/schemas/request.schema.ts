import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageDocument } from 'src/chat/schemas/message.schema';
import { HostDocument } from 'src/hosts/schemas/host.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema({ timestamps: true })
export class Request {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  userEmail: string;

  @Prop()
  userAvatar: string;

  @Prop()
  checkIn: Date;

  @Prop()
  checkOut: Date;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Host' })
  host: HostDocument;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: MessageDocument[];

  createdAt?: Date;

  updatedAt?: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
RequestSchema.index({ userId: 1, createdAt: -1 });
RequestSchema.index({ host: 1, createdAt: -1 });
