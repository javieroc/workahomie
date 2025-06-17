import { Controller, Get, Post, Delete, Body, Req, UseGuards, Query } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';
import { JwtGuard } from 'src/authz/jwt.guard';
import { PaginationDto } from 'src/dto/pagination.dto';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Get()
  async getWishlist(@Req() req: RequestWithUser) {
    const userId = req.user.sub.split('|')[1];
    return this.wishlistService.getWishlist(userId);
  }

  @Get('full')
  async getWishlistHosts(@Req() req: RequestWithUser, @Query() queryParamsDto: PaginationDto) {
    const userId = req.user.sub.split('|')[1];
    return this.wishlistService.getWishlistFull(userId, queryParamsDto);
  }

  @Post('add')
  async addToWishlist(@Req() req: RequestWithUser, @Body() dto: AddToWishlistDto) {
    const userId = req.user.sub.split('|')[1];
    await this.wishlistService.addToWishlist({ userId, hostId: dto.hostId });
    return { message: 'Host added to wishlist' };
  }

  @Delete('remove')
  async removeFromWishlist(@Req() req: RequestWithUser, @Body() dto: RemoveFromWishlistDto) {
    const userId = req.user.sub.split('|')[1];
    await this.wishlistService.removeFromWishlist({ userId, hostId: dto.hostId });
    return { message: 'Host removed from wishlist' };
  }
}
