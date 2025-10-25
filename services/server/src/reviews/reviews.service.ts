import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host, HostDocument } from 'src/hosts/schemas/host.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './entities/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto & { host: Host }): Promise<Review> {
    const review = new this.ReviewModel(createReviewDto);
    await review.save();

    const hostReviews = await this.ReviewModel.find({ host: createReviewDto.host._id }).exec();
    const totalRating = hostReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = totalRating / hostReviews.length;

    await this.HostModel.findByIdAndUpdate(
      createReviewDto.host._id,
      { rate: newAverageRating, countReviews: hostReviews.length },
      { new: true },
    ).exec();

    return review;
  }

  async findAll(
    hostId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Review>> {
    const total = await this.ReviewModel.countDocuments().exec();
    const data = await this.ReviewModel.find({ host: hostId }).limit(limit).skip(offset).exec();

    return {
      data,
      total,
    };
  }

  async remove(id: string): Promise<Review> {
    const review = await this.ReviewModel.findByIdAndDelete(id);
    if (!review) {
      throw new NotFoundException('Review not found!');
    }
    return review;
  }
}
