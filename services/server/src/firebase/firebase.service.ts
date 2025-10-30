import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { messaging } from 'firebase-admin';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(@InjectModel(Token.name) private TokenModel: Model<TokenDocument>) {}

  async updateFcmToken(userId: string, token: string) {
    return this.TokenModel.findOneAndUpdate(
      { userId },
      { $addToSet: { fcmTokens: token } },
      { new: true, upsert: true },
    ).exec();
  }

  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    imageUrl?: string,
  ) {
    const userTokens = await this.TokenModel.findOne({ userId });

    if (!userTokens || userTokens.fcmTokens.length === 0) {
      this.logger.warn(`No FCM tokens found for user ${userId}`);
      return;
    }

    const tokens = userTokens.fcmTokens;
    const messages = tokens.map((token) => ({
      token,
      notification: {
        title,
        body,
        image: imageUrl,
      },
      data,
    }));

    try {
      const response = await messaging().sendEach(messages);
      this.logger.debug(
        `Notifications sent: ${response.successCount}, failed: ${response.failureCount}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send notifications to ${userId}: ${error.message}`);
    }
  }
}
