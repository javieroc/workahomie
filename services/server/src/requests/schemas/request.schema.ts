import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  message: string;

  @Prop()
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Host' })
  host: HostDocument;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
