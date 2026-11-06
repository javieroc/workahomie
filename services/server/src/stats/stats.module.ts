import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Host, HostSchema } from 'src/hosts/schemas/host.schema';
import { Review, ReviewSchema } from 'src/reviews/entities/review.schema';
import { Request, RequestSchema } from 'src/requests/schemas/request.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Host.name, schema: HostSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Request.name, schema: RequestSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
