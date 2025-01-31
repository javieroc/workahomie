import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, RequestDocument } from 'src/requests/schemas/request.schema';
import { FindAllResponse } from 'src/dto/response.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
  ) {}

  async create({ requestId, ...createMessageDto }: CreateMessageDto): Promise<Message> {
    try {
      const request = await this.RequestModel.findById(requestId);
      const message = new this.MessageModel(createMessageDto);
      const savedMessage = await message.save();
      request.messages.push(message);
      await request.save();
      return savedMessage;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(
    roomtId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Message>> {
    const total = await this.MessageModel.countDocuments().exec();
    const data = await this.MessageModel.find({ request: roomtId })
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data,
      total,
    };
  }
}
