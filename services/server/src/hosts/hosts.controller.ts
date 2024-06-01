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
  Req,
  NotFoundException,
  BadRequestException,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { UpdateHostPlaceDto } from './dto/update-host-place.dto';
import { SearchParamsDto } from './dto/search-params.dto';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('profile', { storage: memoryStorage() }))
  async create(
    @Req() req: RequestWithUser,
    @Body() createHostDto: CreateHostDto,
    @UploadedFile() profile: Express.Multer.File,
  ) {
    const userId = req.user.sub.split('|')[1];
    const host = await this.hostsService.findMe(userId);
    if (host) {
      throw new BadRequestException('Host already exists');
    }
    return this.hostsService.create({ ...createHostDto, userId }, profile);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  async findMeAsAHost(@Req() req: RequestWithUser) {
    const userId = req.user.sub.split('|')[1];
    const host = await this.hostsService.findMe(userId);
    if (!host) {
      throw new NotFoundException('Host not found');
    }
    return host;
  }

  @Get()
  findAll(@Query() queryParamsDto: SearchParamsDto) {
    return this.hostsService.findAll(queryParamsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hostsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Put('/me')
  @UseInterceptors(FileInterceptor('profile', { storage: memoryStorage() }))
  async update(
    @Req() req: RequestWithUser,
    @Body() updateHostDto: UpdateHostDto,
    @UploadedFile() profile: Express.Multer.File,
  ) {
    const userId = req.user.sub.split('|')[1];
    const host = await this.hostsService.findMe(userId);
    if (!host) {
      throw new NotFoundException('Host not found');
    }
    return this.hostsService.update({ ...updateHostDto, userId }, profile);
  }

  @UseGuards(JwtGuard)
  @Put('/me/place')
  @UseInterceptors(FilesInterceptor('pictures', 10, { storage: memoryStorage() }))
  async updatePlace(
    @Req() req: RequestWithUser,
    @Body() updateHostPlaceDto: UpdateHostPlaceDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
  ) {
    const userId = req.user.sub.split('|')[1];
    return this.hostsService.updatePlace({ ...updateHostPlaceDto, userId }, pictures);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hostsService.remove(id);
  }
}
