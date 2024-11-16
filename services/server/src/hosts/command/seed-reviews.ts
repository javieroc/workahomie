import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Command, CommandRunner } from 'nest-commander';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/reviews/entities/review.schema';
import { Host, HostDocument } from 'src/hosts/schemas/host.schema';

@Command({ name: 'seed:reviews' })
export class SeedReviewsCommand extends CommandRunner {
  private readonly logger = new Logger(SeedReviewsCommand.name);

  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
  ) {
    super();
  }

  async run(): Promise<void> {
    const hosts = await this.HostModel.find().exec();

    if (hosts.length === 0) {
      this.logger.log('No hosts found. Skipping review seeding.');
      return;
    }

    const reviewPromises = hosts.map((host) => {
      const randomReviewCount = faker.number.int({ min: 6, max: 9 });

      const reviews = Array.from({ length: randomReviewCount }).map(() => ({
        userName: faker.person.fullName(),
        userAvatar: faker.image.avatarGitHub(),
        date: faker.date.recent().toISOString(),
        review: faker.lorem.sentences(4),
        rating: faker.number.int({ min: 1, max: 5 }),
        host: host._id,
      }));

      return this.ReviewModel.insertMany(reviews);
    });

    await Promise.all(reviewPromises);
    this.logger.log('Reviews seeded successfully.');
  }
}
