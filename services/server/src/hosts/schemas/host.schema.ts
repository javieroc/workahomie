import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Point } from './point.schema';
import { Review } from './review.schema';

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

  @Prop()
  placeDescription: string;

  @Prop()
  placeDetails: string;

  @Prop()
  address: string;

  @Prop({
    location: {
      type: Point,
      index: '2dsphere',
    },
  })
  location: Point;

  @Prop([String])
  facilities: string[];

  @Prop([String])
  pictures: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Review' }] })
  reviews: Review[];
}

export const HostSchema = SchemaFactory.createForClass(Host);
HostSchema.index({ location: '2dsphere' });
