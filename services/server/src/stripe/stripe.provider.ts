import { Logger } from '@nestjs/common';
// stripe >= 23 ships CommonJS as `export =` (no `.default`); without esModuleInterop a default
// import compiles to `require('stripe').default` and crashes at boot.
import Stripe = require('stripe');

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
