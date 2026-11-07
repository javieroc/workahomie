import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StripeService } from './stripe.service';
import { DonateDto } from './dto/donate.dto';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('donate')
  async donate(@Body() body: DonateDto) {
    const session = await this.stripeService.createCheckoutSession(body.amount);
    return { url: session.url };
  }
}
