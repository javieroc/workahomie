import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema()
export class Wishlist {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: [Types.ObjectId], ref: 'Host', default: [] })
  hostIds: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
