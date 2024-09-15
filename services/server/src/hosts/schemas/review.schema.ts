import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop()
  userName: string;

  @Prop()
  userProfile: string;

  @Prop()
  date: string;

  @Prop()
  review: string;

  @Prop()
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
