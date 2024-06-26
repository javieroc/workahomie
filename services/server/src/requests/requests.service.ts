import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host } from 'src/hosts/schemas/host.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request, RequestDocument } from './schemas/request.schema';

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private RequestModel: Model<RequestDocument>) {}

  async create(
    createRequestDto: CreateRequestDto & { userId: string; host: Host },
  ): Promise<Request> {
    const request = new this.RequestModel(createRequestDto);

    return request.save();
  }

  async findAll(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Request>> {
    const total = await this.RequestModel.countDocuments().exec();
    const data = await this.RequestModel.find({ userId }).limit(limit).skip(offset).exec();

    return {
      data,
      total,
    };
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.RequestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    const request = await this.RequestModel.findOneAndUpdate({ id }, updateRequestDto, {
      new: true,
    }).exec();

    return request;
  }

  async remove(id: string): Promise<Request> {
    const request = await this.RequestModel.findByIdAndDelete(id);
    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    return request;
  }
}
