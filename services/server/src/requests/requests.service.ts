import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host } from 'src/hosts/schemas/host.schema';
import { Message, MessageDocument } from 'src/chat/schemas/message.schema';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Request, RequestDocument } from './schemas/request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create({
    message: text,
    userAvatar,
    userEmail,
    userName,
    host,
    ...createRequestDto
  }: CreateRequestDto & { userId: string; host: Host }): Promise<Request> {
    const request = new this.RequestModel({
      ...createRequestDto,
      userAvatar,
      userEmail,
      userName,
      host,
    });

    const message = new this.MessageModel({
      message: text,
      timeSent: new Date(),
      userId: createRequestDto.userId,
      userName,
      userAvatar,
      userEmail,
    });
    await message.save();

    request.messages.push(message);
    await request.save();

    try {
      await this.firebaseService.sendNotificationToUser(
        host.userId,
        'New request received',
        `${userName} has sent you a new request.`,
        {
          requestId: request._id.toString(),
          senderName: userName,
          senderAvatar: userAvatar || '',
          screen: 'requests',
        },
        userAvatar,
      );
      this.logger.debug(`Notification sent to host ${host.userId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }

    return request;
  }

  async findAllOutgoing(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Request>> {
    const total = await this.RequestModel.countDocuments({ userId }).exec();
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

  async findAllIncoming(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Request>> {
    const data = await this.RequestModel.find()
      .populate({
        path: 'host',
        match: { userId },
      })

      .limit(limit)
      .skip(offset)
      .exec();

    const filteredData = data.filter((item) => item.host != null);
    const total = filteredData.length;

    return {
      data: filteredData,
      total,
    };
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.RequestModel.findById(id).populate({
      path: 'messages',
    });
    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    const request = await this.RequestModel.findOneAndUpdate({ _id: id }, updateRequestDto, {
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
