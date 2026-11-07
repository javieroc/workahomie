import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** GeoJSON Point. Coordinates are [longitude, latitude]. */
@Schema({ _id: false })
export class Point {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], default: undefined })
  coordinates: number[];
}

export const PointSchema = SchemaFactory.createForClass(Point);
