import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageDocument } from 'src/chat/schemas/message.schema';
import { HostDocument } from 'src/hosts/schemas/host.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class Request {
  @Prop()
  userId: string;

  @Prop()
  checkIn: Date;

  @Prop()
  checkOut: Date;

  @Prop()
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Host' })
  host: HostDocument;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: MessageDocument[];
}

export const RequestSchema = SchemaFactory.createForClass(Request);
