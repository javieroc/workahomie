import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Place } from './place.schema';

export type HostDocument = HydratedDocument<Host>;

@Schema()
export class Host {
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
  place: Place;
}

export const HostSchema = SchemaFactory.createForClass(Host);
