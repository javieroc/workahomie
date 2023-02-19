import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PlaceDocument } from './place.schema';

export type HostDocument = HydratedDocument<Host>;

@Schema()
export class Host {
  @Prop()
  userId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  occupation: string;

  @Prop()
  aboutMe: string;

  @Prop([String])
  profileImages: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Place' })
  place?: PlaceDocument;
}

export const HostSchema = SchemaFactory.createForClass(Host);
