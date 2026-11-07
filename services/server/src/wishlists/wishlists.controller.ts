import { Controller, Get, Post, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { CurrentUserId } from 'src/authz/current-user-id.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Get()
  async getWishlist(@CurrentUserId() userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Get('full')
  async getWishlistHosts(@CurrentUserId() userId: string, @Query() queryParamsDto: PaginationDto) {
    return this.wishlistService.getWishlistFull(userId, queryParamsDto);
  }

  @Post('add')
  async addToWishlist(@CurrentUserId() userId: string, @Body() dto: AddToWishlistDto) {
    await this.wishlistService.addToWishlist({ userId, hostId: dto.hostId });
    return { message: 'Host added to wishlist' };
  }

  @Delete('remove')
  async removeFromWishlist(@CurrentUserId() userId: string, @Body() dto: RemoveFromWishlistDto) {
    await this.wishlistService.removeFromWishlist({ userId, hostId: dto.hostId });
    return { message: 'Host removed from wishlist' };
  }
}
