import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { JwtGuard } from 'src/authz/jwt.guard';
import { CurrentUserId } from 'src/authz/current-user-id.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { RequestsService } from './requests.service';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

@UseGuards(JwtGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('outgoing')
  findAllOutgoing(@CurrentUserId() userId: string, @Query() queryParamsDto: PaginationDto) {
    return this.requestsService.findAllOutgoing(userId, queryParamsDto);
  }

  @Get('incoming')
  findAllIncoming(@CurrentUserId() userId: string, @Query() queryParamsDto: PaginationDto) {
    return this.requestsService.findAllIncoming(userId, queryParamsDto);
  }

  @Get(':id')
  findOne(@Param('id', IsObjectIdPipe) id: string, @CurrentUserId() userId: string) {
    return this.requestsService.findOneForUser(id, userId);
  }

  @HttpCode(204)
  @Put(':id')
  async updateStatus(
    @Param('id', IsObjectIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() { status }: UpdateRequestStatusDto,
  ): Promise<void> {
    await this.requestsService.updateStatus(id, userId, status);
  }

  /** Same as PUT (route decorators cannot be stacked on one handler). */
  @HttpCode(204)
  @Patch(':id')
  async patchStatus(
    @Param('id', IsObjectIdPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() { status }: UpdateRequestStatusDto,
  ): Promise<void> {
    await this.requestsService.updateStatus(id, userId, status);
  }

  @Delete(':id')
  remove(@Param('id', IsObjectIdPipe) id: string, @CurrentUserId() userId: string) {
    return this.requestsService.remove(id, userId);
  }
}
