import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Request, RequestDocument } from 'src/requests/schemas/request.schema';
import { FindAllResponse } from 'src/dto/response.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Message, MessageDocument } from './schemas/message.schema';
import { ChatMessage, CreateMessageInput } from './dto/message.dto';

export interface RequestParticipants {
  requesterId: string;
  hostOwnerId?: string;
}

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  /** Requester and host owner of a request, or null when the request does not exist. */
  async getParticipants(requestId: string): Promise<RequestParticipants | null> {
    if (!isValidObjectId(requestId)) return null;
    const request = await this.RequestModel.findById(requestId, { userId: 1, host: 1 })
      .populate<{ host: { userId?: string } | null }>('host', { userId: 1 })
      .lean()
      .exec();
    if (!request) return null;
    return { requesterId: request.userId, hostOwnerId: request.host?.userId };
  }

  isParticipant(participants: RequestParticipants | null, userId: string): boolean {
    if (!participants || !userId) return false;
    return participants.requesterId === userId || participants.hostOwnerId === userId;
  }

  async create(input: CreateMessageInput): Promise<ChatMessage> {
    const timeSent = new Date().toISOString();
    const message = await this.MessageModel.create({ ...input, timeSent });

    const updated = await this.RequestModel.updateOne(
      { _id: input.requestId },
      { $push: { messages: message._id } },
    ).exec();
    if (updated.matchedCount === 0) {
      await this.MessageModel.deleteOne({ _id: message._id }).exec();
      throw new NotFoundException('Request not found');
    }

    return {
      _id: message._id.toString(),
      requestId: input.requestId,
      userId: input.userId,
      userName: input.userName,
      userAvatar: input.userAvatar,
      userEmail: input.userEmail,
      message: input.message,
      timeSent,
    };
  }

  /** Best-effort push notification to the other participant. */
  async notifyRecipient(participants: RequestParticipants, message: ChatMessage): Promise<void> {
    const recipient =
      message.userId === participants.requesterId
        ? participants.hostOwnerId
        : participants.requesterId;
    if (!recipient) return;

    try {
      await this.firebaseService.sendNotificationToUser(
        recipient,
        `New message from ${message.userName ?? 'Workahomie'}`,
        message.message.slice(0, 140),
        { requestId: message.requestId, screen: 'chat' },
        message.userAvatar,
      );
    } catch (error) {
      this.logger.error(`Failed to send chat notification: ${(error as Error).message}`);
    }
  }

  async findAll(
    requestId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<Message>> {
    const request = await this.RequestModel.findById(requestId, { messages: 1 }).lean().exec();
    const ids = (request?.messages ?? []) as unknown as Types.ObjectId[];
    const filter = { _id: { $in: ids } };

    const [total, data] = await Promise.all([
      this.MessageModel.countDocuments(filter).exec(),
      this.MessageModel.find(filter).sort({ _id: 1 }).skip(offset).limit(limit).lean().exec(),
    ]);

    return { data, total };
  }
}
