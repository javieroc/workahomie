import { StripeProvider } from './stripe.provider';

// Regression: `import Stripe from 'stripe'` compiled to `stripe_1.default`, which is undefined
// for stripe >= 23 (CJS `export =`), crashing the app at boot whenever STRIPE_SECRET_KEY was set.
describe('StripeProvider', () => {
  const original = process.env.STRIPE_SECRET_KEY;
  afterEach(() => {
    process.env.STRIPE_SECRET_KEY = original;
  });

  it('builds a Stripe client when a secret key is configured', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy_key_for_unit_tests';
    const client = StripeProvider.useFactory();
    expect(client).not.toBeNull();
    expect(typeof client?.checkout.sessions.create).toBe('function');
  });

  it('returns null (donations disabled) without a secret key', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(StripeProvider.useFactory()).toBeNull();
  });
});
