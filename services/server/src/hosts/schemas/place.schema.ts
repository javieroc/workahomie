import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Point } from './point.schema';

export type PlaceDocument = HydratedDocument<Place>;

@Schema()
export class Place {
  @Prop()
  description: string;

  @Prop()
  details: string;

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
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
