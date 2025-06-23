import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async getWishlist(userId: string): Promise<Types.ObjectId[]> {
    const wishlist = await this.wishlistModel.findOne({ userId });
    return wishlist ? wishlist.hostIds : [];
  }

  async getWishlistFull(userId: string, { offset = 0, limit = 10 }: PaginationDto) {
    const result = await this.wishlistModel.aggregate([
      { $match: { userId } },
      { $project: { hostIds: 1 } },
      { $unwind: '$hostIds' },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'hosts',
          localField: 'hostIds',
          foreignField: '_id',
          as: 'host',
        },
      },
      { $unwind: '$host' },
      {
        $replaceRoot: { newRoot: '$host' },
      },
    ]);

    const wishlist = await this.wishlistModel.findOne({ userId }, { hostIds: 1 });
    const total = wishlist?.hostIds.length ?? 0;

    return {
      data: result,
      total,
    };
  }

  async addToWishlist({ userId, hostId }: AddToWishlistDto & { userId: string }): Promise<void> {
    await this.wishlistModel.updateOne(
      { userId },
      {
        $addToSet: { hostIds: new Types.ObjectId(hostId) },
      },
      { upsert: true },
    );
  }

  async removeFromWishlist({
    userId,
    hostId,
  }: RemoveFromWishlistDto & { userId: string }): Promise<void> {
    await this.wishlistModel.updateOne(
      { userId },
      {
        $pull: { hostIds: new Types.ObjectId(hostId) },
      },
    );
  }
}
