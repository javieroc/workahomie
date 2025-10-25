import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Point } from './point.schema';

export type HostDocument = HydratedDocument<Host>;

@Schema()
export class Host {
  _id: Types.ObjectId;

  @Prop()
  userId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  occupation: string;

  @Prop()
  occupationDescription?: string;

  @Prop()
  aboutMe: string;

  @Prop()
  phone: string;

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

  @Prop({ default: 0 })
  rate: number;

  @Prop({ default: 0 })
  countReviews: number;

  isWishlisted?: boolean;
}

export const HostSchema = SchemaFactory.createForClass(Host);
HostSchema.index({ location: '2dsphere' });
