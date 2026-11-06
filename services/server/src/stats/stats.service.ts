import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Host, HostDocument } from 'src/hosts/schemas/host.schema';
import { Review, ReviewDocument } from 'src/reviews/entities/review.schema';
import { Request, RequestDocument } from 'src/requests/schemas/request.schema';
import { RequestStatus } from 'src/requests/dto/create-request.dto';

export interface Stats {
  hosts: number;
  reviews: number;
  /** Accepted requests. */
  connections: number;
  /** Distinct ~11 km cells: host coordinates rounded to 1 decimal (lat, lng). */
  cities: number;
}

export const STATS_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class StatsService {
  private cache?: { value: Stats; expiresAt: number };

  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
  ) {}

  async getStats(now = Date.now()): Promise<Stats> {
    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.value;
    }

    const [hosts, reviews, connections, cells] = await Promise.all([
      this.HostModel.estimatedDocumentCount().exec(),
      this.ReviewModel.estimatedDocumentCount().exec(),
      this.RequestModel.countDocuments({ status: RequestStatus.ACCEPTED }).exec(),
      this.HostModel.aggregate<{ count: number }>([
        { $match: { 'location.coordinates.1': { $exists: true } } },
        {
          $group: {
            _id: {
              lng: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 1] },
              lat: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 1] },
            },
          },
        },
        { $count: 'count' },
      ]).exec(),
    ]);

    const value: Stats = { hosts, reviews, connections, cities: cells[0]?.count ?? 0 };
    this.cache = { value, expiresAt: now + STATS_TTL_MS };
    return value;
  }
}
