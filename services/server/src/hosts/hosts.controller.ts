import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  BadRequestException,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/authz/jwt.guard';
import { CurrentUserId } from 'src/authz/current-user-id.decorator';
import { imageUploadOptions } from 'src/common/upload';
import { CreateRequestDto } from 'src/requests/dto/create-request.dto';
import { RequestsService } from 'src/requests/requests.service';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { WishlistsService } from 'src/wishlists/wishlists.service';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { UpdateHostPlaceDto } from './dto/update-host-place.dto';
import { SearchParamsDto } from './dto/search-params.dto';

/** Static routes (`pins`, `me`, `wishlisted`) are declared before `:id`. */
@Controller('hosts')
export class HostsController {
  constructor(
    private readonly hostsService: HostsService,
    private readonly requestsService: RequestsService,
    private readonly reviewsService: ReviewsService,
    private readonly wishlistsService: WishlistsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('profile', imageUploadOptions))
  async create(
    @CurrentUserId() userId: string,
    @Body() createHostDto: CreateHostDto,
    @UploadedFile() profile: Express.Multer.File,
  ) {
    const host = await this.hostsService.findMe(userId);
    if (host) {
      throw new BadRequestException('Host already exists');
    }
    return this.hostsService.create({ ...createHostDto, userId }, profile);
  }

  @Get()
  findAll(@Query() queryParamsDto: SearchParamsDto) {
    return this.hostsService.findAll(queryParamsDto);
  }

  @Get('pins')
  findPins(@Query() queryParamsDto: SearchParamsDto) {
    return this.hostsService.findPins(queryParamsDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async findMeAsAHost(@CurrentUserId() userId: string) {
    const host = await this.hostsService.findMe(userId);
    if (!host) {
      throw new NotFoundException('Host not found');
    }
    return host;
  }

  @UseGuards(JwtGuard)
  @Get('wishlisted')
  async findAllWishlisted(
    @CurrentUserId() userId: string,
    @Query() queryParamsDto: SearchParamsDto,
  ) {
    const [response, wishlistedHostIds] = await Promise.all([
      this.hostsService.findAll(queryParamsDto),
      this.wishlistsService.getWishlist(userId),
    ]);
    const wishlisted = new Set(wishlistedHostIds.map((id) => id.toString()));
    return {
      data: response.data.map((host) => ({
        ...host,
        isWishlisted: wishlisted.has(host._id.toString()),
      })),
      total: response.total,
    };
  }

  @UseGuards(JwtGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('profile', imageUploadOptions))
  async update(
    @CurrentUserId() userId: string,
    @Body() updateHostDto: UpdateHostDto,
    @UploadedFile() profile: Express.Multer.File,
  ) {
    return this.hostsService.update({ ...updateHostDto, userId }, profile);
  }

  @UseGuards(JwtGuard)
  @Put('me/place')
  @UseInterceptors(FilesInterceptor('pictures', 10, imageUploadOptions))
  async updatePlace(
    @CurrentUserId() userId: string,
    @Body() updateHostPlaceDto: UpdateHostPlaceDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
  ) {
    return this.hostsService.updatePlace({ ...updateHostPlaceDto, userId }, pictures);
  }

  @UseGuards(JwtGuard)
  @Delete('me')
  removeMine(@CurrentUserId() userId: string) {
    return this.hostsService.removeMine(userId);
  }

  @Get(':id')
  findOne(@Param('id', IsObjectIdPipe) id: string) {
    return this.hostsService.findPublic(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/requests')
  async createRequest(
    @CurrentUserId() userId: string,
    @Param('id', IsObjectIdPipe) id: string,
    @Body() createHostRequestDto: CreateRequestDto,
  ) {
    const host = await this.hostsService.findById(id);
    return this.requestsService.create(userId, host, createHostRequestDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id/reviews/eligibility')
  getReviewEligibility(@CurrentUserId() userId: string, @Param('id', IsObjectIdPipe) id: string) {
    return this.reviewsService.getEligibility(id, userId);
  }

  @Get(':id/reviews')
  async getReviews(@Param('id', IsObjectIdPipe) id: string, @Query() paginationDto: PaginationDto) {
    return this.reviewsService.findAll(id, paginationDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/reviews')
  async createReview(
    @CurrentUserId() userId: string,
    @Param('id', IsObjectIdPipe) id: string,
    @Body() createHostReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(id, userId, createHostReviewDto);
  }
}
