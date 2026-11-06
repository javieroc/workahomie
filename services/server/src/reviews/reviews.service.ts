import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host, HostDocument } from 'src/hosts/schemas/host.schema';
import { Request, RequestDocument } from 'src/requests/schemas/request.schema';
import { RequestStatus } from 'src/requests/dto/create-request.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './entities/review.schema';

export type ReviewIneligibilityReason = 'own_place' | 'no_visit' | 'already_reviewed';

export interface ReviewEligibility {
  canReview: boolean;
  reason?: ReviewIneligibilityReason;
}

export const NO_VISIT_MESSAGE = 'You can review a place after an accepted visit';

const toObjectId = (id: string | Types.ObjectId) =>
  id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id));

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
  ) {}

  async getEligibility(
    hostId: string,
    userId: string,
    now = new Date(),
  ): Promise<ReviewEligibility> {
    const host = await this.HostModel.findById(hostId, { userId: 1 }).lean().exec();
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return this.checkEligibility(host._id, host.userId, userId, now);
  }

  async create(
    hostId: string,
    userId: string,
    { userName, userAvatar, review, rating }: CreateReviewDto,
    now = new Date(),
  ): Promise<Review> {
    const host = await this.HostModel.findById(hostId, { userId: 1 }).lean().exec();
    if (!host) {
      throw new NotFoundException('Host not found!');
    }

    const { reason } = await this.checkEligibility(host._id, host.userId, userId, now);
    if (reason === 'own_place') {
      throw new BadRequestException('You cannot review your own place');
    }
    if (reason === 'already_reviewed') {
      throw new ConflictException('You have already reviewed this place');
    }
    if (reason === 'no_visit') {
      throw new ForbiddenException(NO_VISIT_MESSAGE);
    }

    const created = await this.ReviewModel.create({
      userId,
      userName,
      userAvatar,
      review,
      rating,
      host: host._id,
      date: now.toISOString(),
    });

    await this.recalculateHostRating(host._id);
    return created;
  }

  async findAll(
    hostId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Review>> {
    const filter = { host: toObjectId(hostId) };
    const [total, data] = await Promise.all([
      this.ReviewModel.countDocuments(filter).exec(),
      this.ReviewModel.find(filter)
        .sort({ date: -1, _id: -1 })
        .skip(offset)
        .limit(limit)
        .lean<Review[]>()
        .exec(),
    ]);

    return { data, total };
  }

  /** Only the author can delete a review. */
  async remove(id: string, userId: string): Promise<Review> {
    const review = await this.ReviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Review not found!');
    }
    if (!review.userId || review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.ReviewModel.deleteOne({ _id: review._id }).exec();
    await this.recalculateHostRating(review.host as unknown as Types.ObjectId);
    return review;
  }

  /** Recomputes `rate` (average) and `countReviews` of a host from its reviews. */
  async recalculateHostRating(hostId: string | Types.ObjectId): Promise<void> {
    const host = toObjectId(hostId);
    const [stats] = await this.ReviewModel.aggregate<{ avgRating: number; count: number }>([
      { $match: { host } },
      { $group: { _id: '$host', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]).exec();

    await this.HostModel.updateOne(
      { _id: host },
      { rate: stats?.avgRating ?? 0, countReviews: stats?.count ?? 0 },
    ).exec();
  }

  private async checkEligibility(
    hostId: Types.ObjectId,
    hostOwnerId: string,
    userId: string,
    now: Date,
  ): Promise<ReviewEligibility> {
    if (hostOwnerId === userId) {
      return { canReview: false, reason: 'own_place' };
    }

    const alreadyReviewed = await this.ReviewModel.exists({ host: hostId, userId });
    if (alreadyReviewed) {
      return { canReview: false, reason: 'already_reviewed' };
    }

    const visited = await this.RequestModel.exists({
      host: hostId,
      userId,
      status: RequestStatus.ACCEPTED,
      checkIn: { $lte: now },
    });
    if (!visited) {
      return { canReview: false, reason: 'no_visit' };
    }

    return { canReview: true };
  }
}
