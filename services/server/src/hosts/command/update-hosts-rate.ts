import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { Review, ReviewDocument } from 'src/reviews/entities/review.schema';
import { Host, HostDocument } from '../schemas/host.schema';

@Command({ name: 'update:hosts-rate', description: 'Update hosts rate and count reviews' })
export class UpdateHostsRateCommand extends CommandRunner {
  private readonly logger = new Logger(UpdateHostsRateCommand.name);

  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
  ) {
    super();
  }

  async run(): Promise<void> {
    const hosts = await this.HostModel.find().exec();

    if (hosts.length === 0) {
      this.logger.log('No hosts to update.');
      return;
    }

    const promises = hosts.map(async (host) => {
      const reviews = await this.ReviewModel.find({ host: host._id }).exec();
      const countReviews = reviews.length;
      const rate =
        countReviews > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / countReviews
          : 0;

      return this.HostModel.updateOne({ _id: host._id }, { rate, countReviews });
    });

    await Promise.all(promises);
    this.logger.log(`${hosts.length} hosts updated with rate and count reviews.`);
  }
}
