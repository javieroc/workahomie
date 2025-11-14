import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeProvider } from './stripe.provider';

@Module({
  controllers: [StripeController],
  providers: [StripeService, StripeProvider],
})
export class StripeModule {}
