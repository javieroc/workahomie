import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getMessaging } from 'firebase-admin/messaging';
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
      const response = await getMessaging().sendEach(messages);
      this.logger.debug(
        `Notifications sent: ${response.successCount}, failed: ${response.failureCount}`,
      );

      response.responses.forEach((res, index) => {
        if (res.success) {
          this.logger.debug(`✅ Sent to token: ${tokens[index]}`);
        } else {
          this.logger.error(
            `❌ Failed for token: ${tokens[index]} — ${res.error?.code} | ${res.error?.message}`,
          );
        }
      });
    } catch (error) {
      this.logger.error(`🔥 Messaging failed globally for ${userId}: ${error.message}`);
      this.logger.error(error.stack);
    }
  }
}
