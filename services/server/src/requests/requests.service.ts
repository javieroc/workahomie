import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host } from 'src/hosts/schemas/host.schema';
import { Message, MessageDocument } from 'src/chat/schemas/message.schema';
import { AuthzService } from 'src/authz/authz.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request, RequestDocument } from './schemas/request.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    private readonly authzService: AuthzService,
  ) {}

  async create({
    authorization,
    ...createRequestDto
  }: CreateRequestDto & { userId: string; host: Host; authorization: string }): Promise<Request> {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }
    const token = authorization.replace('Bearer ', '');
    const userInfo = await this.authzService.getUserInfo(token);
    console.log('user info', userInfo);

    const request = new this.RequestModel(createRequestDto);
    const message = new this.MessageModel({
      message: createRequestDto.message,
      userId: createRequestDto.userId,
      timeSent: new Date(),
      userName: userInfo.name,
      userAvatar: userInfo.picture,
      userEmail: userInfo.email,
    });
    await message.save();

    request.messages.push(message);
    return request.save();
  }

  async findAll(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Request>> {
    const total = await this.RequestModel.countDocuments().exec();
    const data = await this.RequestModel.find({ userId })
      .populate('host')
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data,
      total,
    };
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.RequestModel.findById(id).populate('messages');
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
