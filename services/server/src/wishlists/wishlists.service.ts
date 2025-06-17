import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
