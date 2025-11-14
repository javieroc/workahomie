import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { DonateDto } from './dto/donate.dto';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('donate')
  async donate(@Body() body: DonateDto) {
    const session = await this.stripeService.createCheckoutSession(body.amount);
    return { url: session.url };
  }
}
