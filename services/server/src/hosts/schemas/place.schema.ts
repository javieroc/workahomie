import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaceDocument = HydratedDocument<Place>;

@Schema()
export class Place {
  @Prop({ required: true })
  description: string;

  @Prop()
  details: string;

  @Prop({ required: true })
  address: string;

  @Prop([String])
  facilities: string[];

  @Prop([String])
  pictures: string[];
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
