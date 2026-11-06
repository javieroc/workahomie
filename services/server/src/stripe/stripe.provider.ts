import { Logger } from '@nestjs/common';
import Stripe from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

export const StripeProvider = {
  provide: STRIPE_CLIENT,
  useFactory: (): Stripe | null => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      new Logger('StripeProvider').warn('STRIPE_SECRET_KEY is not set: donations are disabled');
      return null;
    }
    return new Stripe(secretKey, { apiVersion: '2026-10-28.endive' });
  },
};
