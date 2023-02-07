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
} from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('profile', { storage: memoryStorage() }))
  create(
    @Req() req: RequestWithUser,
    @Body() createHostDto: CreateHostDto,
    @UploadedFile() profile: Express.Multer.File,
  ) {
    const userId = req.user.sub.split('|')[1];
    return this.hostsService.create({ ...createHostDto, userId }, profile);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.hostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hostsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateHostDto: UpdateHostDto) {
    return this.hostsService.update(id, updateHostDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hostsService.remove(id);
  }
}
