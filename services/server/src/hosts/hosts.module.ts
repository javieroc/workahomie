import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RequestsModule } from 'src/requests/requests.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { Review, ReviewSchema } from 'src/reviews/entities/review.schema';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { Host, HostSchema } from './schemas/host.schema';
import { SeedHostsCommand } from './command/seed-hosts';
import { SeedReviewsCommand } from './command/seed-reviews';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Host.name, schema: HostSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    CloudinaryModule,
    RequestsModule,
    ReviewsModule,
  ],
  controllers: [HostsController],
  providers: [HostsService, SeedHostsCommand, SeedReviewsCommand],
})
export class HostsModule {}
