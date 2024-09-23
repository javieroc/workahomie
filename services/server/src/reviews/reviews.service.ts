import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host } from 'src/hosts/schemas/host.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './entities/review.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>) {}

  create(createReviewDto: CreateReviewDto & { host: Host }): Promise<Review> {
    const review = new this.ReviewModel(createReviewDto);

    return review.save();
  }

  async findAll(
    host: MongooseSchema.Types.ObjectId,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Review>> {
    const total = await this.ReviewModel.countDocuments().exec();
    const data = await this.ReviewModel.find({ host }).limit(limit).skip(offset).exec();

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
