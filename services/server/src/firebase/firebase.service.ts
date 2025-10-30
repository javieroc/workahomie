import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class FirebaseService {
  constructor(@InjectModel(Token.name) private TokenModel: Model<TokenDocument>) {}

  async updateFcmToken(userId: string, token: string) {
    return this.TokenModel.findOneAndUpdate(
      { userId },
      { $addToSet: { fcmTokens: token } },
      { new: true, upsert: true },
    ).exec();
  }
}
