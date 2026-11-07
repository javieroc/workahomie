import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { Token, TokenDocument } from './schemas/token.schema';
import { initFirebaseApp } from './firebase.app';

/** Error codes meaning the token will never work again and should be dropped. */
export const STALE_TOKEN_ERRORS = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

const maskToken = (token: string) => `...${token.slice(-6)}`;

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  private app: App | null | undefined;

  private warnedDisabled = false;

  constructor(@InjectModel(Token.name) private TokenModel: Model<TokenDocument>) {}

  /** Lazily initialized so missing Firebase env vars never crash the app. */
  private getApp(): App | null {
    if (this.app === undefined) {
      try {
        this.app = initFirebaseApp();
      } catch (error) {
        this.logger.error(`Firebase initialization failed: ${(error as Error).message}`);
        this.app = null;
      }
    }
    if (!this.app && !this.warnedDisabled) {
      this.warnedDisabled = true;
      this.logger.warn('Firebase is not configured: push notifications are disabled');
    }
    return this.app;
  }

  async updateFcmToken(userId: string, token: string) {
    // A device token belongs to whoever logged in last on that device.
    await this.TokenModel.updateMany(
      { userId: { $ne: userId }, fcmTokens: token },
      { $pull: { fcmTokens: token } },
    ).exec();

    return this.TokenModel.findOneAndUpdate(
      { userId },
      { $addToSet: { fcmTokens: token } },
      { new: true, upsert: true },
    ).exec();
  }

  async removeFcmToken(userId: string, token: string): Promise<void> {
    await this.TokenModel.updateOne({ userId }, { $pull: { fcmTokens: token } }).exec();
  }

  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    imageUrl?: string,
  ): Promise<void> {
    const app = this.getApp();
    if (!app) return;

    const userTokens = await this.TokenModel.findOne({ userId }).exec();
    if (!userTokens || userTokens.fcmTokens.length === 0) {
      this.logger.debug(`No FCM tokens found for user ${userId}`);
      return;
    }

    const tokens = userTokens.fcmTokens;
    const messages = tokens.map((token) => ({
      token,
      notification: { title, body, ...(imageUrl ? { imageUrl } : {}) },
      data,
    }));

    try {
      const response = await getMessaging(app).sendEach(messages);
      this.logger.debug(
        `Notifications sent: ${response.successCount}, failed: ${response.failureCount}`,
      );

      const stale: string[] = [];
      response.responses.forEach((res, index) => {
        if (res.success) return;
        const code = res.error?.code;
        this.logger.warn(`FCM send failed for token ${maskToken(tokens[index])}: ${code}`);
        if (code && STALE_TOKEN_ERRORS.has(code)) {
          stale.push(tokens[index]);
        }
      });

      if (stale.length > 0) {
        await this.TokenModel.updateOne(
          { userId },
          { $pull: { fcmTokens: { $in: stale } } },
        ).exec();
        this.logger.log(`Pruned ${stale.length} stale FCM token(s) for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Messaging failed for ${userId}: ${(error as Error).message}`);
    }
  }
}
