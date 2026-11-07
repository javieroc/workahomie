import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Host, HostSchema } from './hosts/schemas/host.schema';
import { Review, ReviewSchema } from './reviews/entities/review.schema';
import { SeedHostsCommand } from './hosts/command/seed-hosts';
import { SeedReviewsCommand } from './hosts/command/seed-reviews';
import { UpdatePhonesCommand } from './hosts/command/update-phones';
import { UpdateOccupationsCommand } from './hosts/command/update-occupations';
import { UpdatePicturesCommand } from './hosts/command/update-pictures';
import { UpdateHostsRateCommand } from './hosts/command/update-hosts-rate';

/**
 * Standalone module for CLI maintenance/seed commands (`npm run command -- <name>`).
 * Kept out of AppModule so the HTTP server never loads dev-only seed dependencies (faker).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: Host.name, schema: HostSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  providers: [
    SeedHostsCommand,
    SeedReviewsCommand,
    UpdatePhonesCommand,
    UpdateOccupationsCommand,
    UpdatePicturesCommand,
    UpdateHostsRateCommand,
  ],
})
export class CommandsModule {}
