import { Controller, Param, Delete, UseGuards } from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { JwtGuard } from 'src/authz/jwt.guard';
import { CurrentUserId } from 'src/authz/current-user-id.decorator';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', IsObjectIdPipe) id: string, @CurrentUserId() userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
