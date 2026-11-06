import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FindAllResponse } from 'src/dto/response.dto';
import { Host, HostDocument } from 'src/hosts/schemas/host.schema';
import { Message, MessageDocument } from 'src/chat/schemas/message.schema';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Request, RequestDocument } from './schemas/request.schema';
import { CreateRequestDto, RequestStatus } from './dto/create-request.dto';
import { UpdatableStatus } from './dto/update-request-status.dto';

/** Newest first; documents created before `timestamps` existed fall back to `_id` order. */
const NEWEST_FIRST = { createdAt: -1, _id: -1 } as const;

/**
 * Tolerance applied to the "check-in is not in the past" rule so that users in timezones behind
 * UTC can still book "today" in their local date.
 */
const CHECK_IN_TOLERANCE_MS = 14 * 60 * 60 * 1000;

export type HostRef = Pick<Host, 'userId'> &
  Partial<Pick<Host, 'firstName' | 'lastName' | 'phone'>> & {
    _id: Types.ObjectId;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainRequest = Record<string, any> & { status?: string };

const startOfTodayUtc = (now: Date) =>
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

const isPopulatedHost = (host: unknown): host is HostRef =>
  !!host && typeof host === 'object' && 'userId' in host;

/** Host phone is only shared once the request has been accepted. */
export function withPhonePolicy<T extends PlainRequest>(request: T): T {
  if (!request || request.status === RequestStatus.ACCEPTED || !isPopulatedHost(request.host)) {
    return request;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { phone, ...host } = request.host;
  return { ...request, host };
}

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    userId: string,
    host: HostRef,
    { message: text, userAvatar, userEmail, userName, checkIn, checkOut }: CreateRequestDto,
    now = new Date(),
  ): Promise<Request> {
    if (host.userId === userId) {
      throw new BadRequestException('You cannot request your own place');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate.getTime() < checkInDate.getTime()) {
      throw new BadRequestException('checkOut must be on or after checkIn');
    }
    if (checkInDate.getTime() < startOfTodayUtc(now) - CHECK_IN_TOLERANCE_MS) {
      throw new BadRequestException('checkIn cannot be in the past');
    }

    const duplicate = await this.RequestModel.exists({
      host: host._id,
      userId,
      status: RequestStatus.PENDING,
      checkIn: { $lte: checkOutDate },
      checkOut: { $gte: checkInDate },
    });
    if (duplicate) {
      throw new ConflictException('You already have a pending request for these dates');
    }

    const request = new this.RequestModel({
      userId,
      userName,
      userEmail,
      userAvatar,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: RequestStatus.PENDING,
      host: host._id,
    });

    if (text?.trim()) {
      const message = new this.MessageModel({
        requestId: request._id.toString(),
        message: text.trim(),
        timeSent: now.toISOString(),
        userId,
        userName,
        userAvatar,
        userEmail,
      });
      await message.save();
      request.messages.push(message);
    }
    await request.save();

    await this.notify(
      host.userId,
      'New request received',
      `${userName ?? 'Someone'} has sent you a new request.`,
      {
        requestId: request._id.toString(),
        senderName: userName ?? '',
        senderAvatar: userAvatar ?? '',
        screen: 'requests',
      },
      userAvatar,
    );

    return request;
  }

  async findAllOutgoing(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<PlainRequest>> {
    const filter = { userId };
    const [total, data] = await Promise.all([
      this.RequestModel.countDocuments(filter).exec(),
      this.RequestModel.find(filter)
        .sort(NEWEST_FIRST)
        .skip(offset)
        .limit(limit)
        .populate('host', '-__v')
        .lean<PlainRequest[]>()
        .exec(),
    ]);

    return { data: data.map(withPhonePolicy), total };
  }

  async findAllIncoming(
    userId: string,
    { limit = 10, offset = 0 }: PaginationDto,
  ): Promise<FindAllResponse<PlainRequest>> {
    const host = await this.HostModel.findOne({ userId }, { _id: 1 }).lean().exec();
    if (!host) {
      return { data: [], total: 0 };
    }

    const filter = { host: host._id };
    const [total, data] = await Promise.all([
      this.RequestModel.countDocuments(filter).exec(),
      this.RequestModel.find(filter)
        .sort(NEWEST_FIRST)
        .skip(offset)
        .limit(limit)
        .populate('host', '-__v')
        .lean<PlainRequest[]>()
        .exec(),
    ]);

    return { data, total };
  }

  /** Only the requester or the owner of the requested host may read a request. */
  async findOneForUser(id: string, userId: string): Promise<PlainRequest> {
    const request = await this.RequestModel.findById(id)
      .populate('messages')
      .populate('host', '-__v')
      .lean<PlainRequest>()
      .exec();
    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    const host = isPopulatedHost(request.host) ? request.host : undefined;
    if (request.userId !== userId && host?.userId !== userId) {
      throw new ForbiddenException('You cannot access this request');
    }
    return withPhonePolicy(request);
  }

  /**
   * Status transitions:
   * - host owner: accepted | declined
   * - requester: cancelled
   * The other party is notified (best-effort).
   */
  async updateStatus(id: string, userId: string, status: UpdatableStatus) {
    const request = await this.RequestModel.findById(id).populate<{ host: HostRef }>('host').exec();
    if (!request) {
      throw new NotFoundException('Request not found!');
    }

    const hostOwnerId = request.host?.userId;
    const isRequester = request.userId === userId;
    const isHostOwner = !!hostOwnerId && hostOwnerId === userId;
    if (!isRequester && !isHostOwner) {
      throw new ForbiddenException('You cannot update this request');
    }

    const hostOnly = status === RequestStatus.ACCEPTED || status === RequestStatus.DECLINED;
    if (hostOnly && !isHostOwner) {
      throw new ForbiddenException('Only the host can accept or decline a request');
    }
    if (status === RequestStatus.CANCELLED && !isRequester) {
      throw new ForbiddenException('Only the requester can cancel a request');
    }
    if (request.status === RequestStatus.CANCELLED) {
      throw new ConflictException('This request was cancelled');
    }
    if (request.status === status) {
      return request;
    }

    request.status = status;
    await request.save();

    const requestId = request._id.toString();
    if (status === RequestStatus.CANCELLED) {
      await this.notify(
        hostOwnerId,
        'Request cancelled',
        `${request.userName ?? 'A guest'} has cancelled their request.`,
        { requestId, status, screen: 'requests' },
      );
    } else {
      const hostName = [request.host?.firstName, request.host?.lastName].filter(Boolean).join(' ');
      await this.notify(
        request.userId,
        `Request ${status}`,
        `${hostName || 'The host'} has ${status} your request.`,
        { requestId, status, screen: 'requests' },
      );
    }

    return request;
  }

  /** Only the requester may delete a request. */
  async remove(id: string, userId: string): Promise<Request> {
    const request = await this.RequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    if (request.userId !== userId) {
      throw new ForbiddenException('Only the requester can delete a request');
    }

    await this.RequestModel.deleteOne({ _id: request._id }).exec();
    if (request.messages?.length) {
      await this.MessageModel.deleteMany({ _id: { $in: request.messages } }).exec();
    }
    return request;
  }

  private async notify(
    userId: string | undefined,
    title: string,
    body: string,
    data?: Record<string, string>,
    imageUrl?: string,
  ): Promise<void> {
    if (!userId) return;
    try {
      await this.firebaseService.sendNotificationToUser(userId, title, body, data, imageUrl);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${(error as Error).message}`);
    }
  }
}
