import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'src/requests/schemas/request.schema';
import { FindAllResponse } from 'src/dto/response.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private MessageModel: Model<MessageDocument>) {}

  create(createMessageDto: CreateMessageDto & { request: Request }): Promise<Message> {
    const message = new this.MessageModel(createMessageDto);

    return message.save();
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
