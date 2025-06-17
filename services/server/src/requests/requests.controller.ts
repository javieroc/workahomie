import { Controller, Get, Body, Param, Delete, UseGuards, Query, Put, Req } from '@nestjs/common';
import { JwtGuard } from 'src/authz/jwt.guard';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';
import { PaginationDto } from 'src/dto/pagination.dto';
import { RequestsService } from './requests.service';
import { UpdateRequestDto } from './dto/update-request.dto';

@UseGuards(JwtGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('outgoing')
  findAllOutgoing(@Req() req: RequestWithUser, @Query() queryParamsDto: PaginationDto) {
    const userId = req.user.sub.split('|')[1];
    return this.requestsService.findAllOutgoing(userId, queryParamsDto);
  }

  @Get('incoming')
  findAllIncoming(@Req() req: RequestWithUser, @Query() queryParamsDto: PaginationDto) {
    const userId = req.user.sub.split('|')[1];
    return this.requestsService.findAllIncoming(userId, queryParamsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }
}
