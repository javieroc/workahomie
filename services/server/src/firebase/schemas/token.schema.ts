import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  _id: Types.ObjectId;

  @Prop()
  userId: string;

  @Prop({ type: [String], default: [] })
  fcmTokens: string[];
}

export const TokenSchema = SchemaFactory.createForClass(Token);
