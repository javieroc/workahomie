import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import Stripe = require('stripe');
import { STRIPE_CLIENT } from './stripe.provider';

@Injectable()
export class StripeService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe | null) {}

  async createCheckoutSession(amountInEuros: number): Promise<{ url: string | null }> {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Donations are currently unavailable');
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Workahomie Donation' },
            unit_amount: Math.round(amountInEuros * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}?donation=success`,
      cancel_url: `${process.env.FRONTEND_URL}?donation=cancel`,
    });

    return { url: session.url };
  }
}
