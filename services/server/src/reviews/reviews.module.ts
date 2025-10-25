import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Host, HostSchema } from 'src/hosts/schemas/host.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './entities/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Host.name, schema: HostSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
