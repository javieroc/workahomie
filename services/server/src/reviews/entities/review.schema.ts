import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { HostDocument } from 'src/hosts/schemas/host.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop()
  userName: string;

  @Prop()
  userAvatar: string;

  @Prop()
  date: string;

  @Prop()
  review: string;

  @Prop()
  rating: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Host' })
  host: HostDocument;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
