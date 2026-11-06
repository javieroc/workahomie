import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { mockModel, mockQuery } from 'src/test-utils/mongoose-mocks';
import { RequestsService, withPhonePolicy } from './requests.service';
import { RequestStatus } from './dto/create-request.dto';

const HOST_OWNER = 'host-owner';
const GUEST = 'guest';
const STRANGER = 'stranger';
const NOW = new Date('2026-11-06T12:00:00.000Z');

const makeHost = (userId = HOST_OWNER) => ({
  _id: new Types.ObjectId(),
  userId,
  firstName: 'Ana',
  lastName: 'Host',
  phone: '+353000000',
});

function setup() {
  const RequestModel = mockModel({
    exists: jest.fn().mockResolvedValue(null),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    deleteOne: jest.fn(() => mockQuery({ deletedCount: 1 })),
  });
  const MessageModel = mockModel({ deleteMany: jest.fn(() => mockQuery({})) });
  const HostModel = mockModel({ findOne: jest.fn() });
  const firebase = { sendNotificationToUser: jest.fn().mockResolvedValue(undefined) };
  const service = new RequestsService(RequestModel, MessageModel, HostModel, firebase as never);
  return { service, RequestModel, MessageModel, HostModel, firebase };
}

const requestDoc = (status: string = RequestStatus.PENDING) => ({
  _id: new Types.ObjectId(),
  userId: GUEST,
  userName: 'Guest',
  status,
  host: makeHost(),
  save: jest.fn().mockResolvedValue(undefined),
});

describe('RequestsService', () => {
  describe('create', () => {
    const dto = { checkIn: '2026-11-10', checkOut: '2026-11-12', message: 'hi', userName: 'G' };

    it('rejects requesting your own place', async () => {
      const { service } = setup();
      await expect(service.create(HOST_OWNER, makeHost(), dto, NOW)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects checkOut before checkIn', async () => {
      const { service } = setup();
      await expect(
        service.create(GUEST, makeHost(), { ...dto, checkOut: '2026-11-09' }, NOW),
      ).rejects.toThrow('checkOut must be on or after checkIn');
    });

    it('rejects checkIn in the past', async () => {
      const { service } = setup();
      await expect(
        service.create(GUEST, makeHost(), { ...dto, checkIn: '2026-11-01' }, NOW),
      ).rejects.toThrow('checkIn cannot be in the past');
    });

    it('rejects an overlapping pending request with 409', async () => {
      const { service, RequestModel } = setup();
      RequestModel.exists.mockResolvedValue({ _id: new Types.ObjectId() });
      await expect(service.create(GUEST, makeHost(), dto, NOW)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('uses the token userId and pending status even if the body tries to override them', async () => {
      const { service, RequestModel, firebase } = setup();
      const host = makeHost();
      const spoofed = { ...dto, userId: HOST_OWNER, status: 'accepted' } as typeof dto;

      await service.create(GUEST, host, spoofed, NOW);

      const saved = RequestModel.instances[0];
      expect(saved.userId).toBe(GUEST);
      expect(saved.status).toBe(RequestStatus.PENDING);
      expect(saved.host).toBe(host._id);
      expect(saved.save).toHaveBeenCalled();
      expect(firebase.sendNotificationToUser).toHaveBeenCalledWith(
        HOST_OWNER,
        expect.any(String),
        expect.any(String),
        expect.any(Object),
        undefined,
      );
    });

    it('accepts check-in today', async () => {
      const { service } = setup();
      await expect(
        service.create(GUEST, makeHost(), { ...dto, checkIn: '2026-11-06' }, NOW),
      ).resolves.toBeDefined();
    });
  });

  describe('updateStatus', () => {
    it.each([RequestStatus.ACCEPTED, RequestStatus.DECLINED] as const)(
      'lets the host owner set %s and notifies the guest',
      async (status) => {
        const { service, RequestModel, firebase } = setup();
        const doc = requestDoc();
        RequestModel.findById.mockReturnValue(mockQuery(doc));

        await service.updateStatus(doc._id.toString(), HOST_OWNER, status);

        expect(doc.status).toBe(status);
        expect(doc.save).toHaveBeenCalled();
        expect(firebase.sendNotificationToUser).toHaveBeenCalledWith(
          GUEST,
          expect.any(String),
          expect.any(String),
          expect.objectContaining({ status }),
          undefined,
        );
      },
    );

    it('does not let the guest accept their own request', async () => {
      const { service, RequestModel } = setup();
      const doc = requestDoc();
      RequestModel.findById.mockReturnValue(mockQuery(doc));

      await expect(
        service.updateStatus(doc._id.toString(), GUEST, RequestStatus.ACCEPTED),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(doc.save).not.toHaveBeenCalled();
    });

    it('lets the guest cancel and notifies the host', async () => {
      const { service, RequestModel, firebase } = setup();
      const doc = requestDoc();
      RequestModel.findById.mockReturnValue(mockQuery(doc));

      await service.updateStatus(doc._id.toString(), GUEST, RequestStatus.CANCELLED);

      expect(doc.status).toBe(RequestStatus.CANCELLED);
      expect(firebase.sendNotificationToUser).toHaveBeenCalledWith(
        HOST_OWNER,
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ status: RequestStatus.CANCELLED }),
        undefined,
      );
    });

    it('does not let the host cancel', async () => {
      const { service, RequestModel } = setup();
      const doc = requestDoc();
      RequestModel.findById.mockReturnValue(mockQuery(doc));
      await expect(
        service.updateStatus(doc._id.toString(), HOST_OWNER, RequestStatus.CANCELLED),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it.each([RequestStatus.ACCEPTED, RequestStatus.DECLINED, RequestStatus.CANCELLED] as const)(
      'forbids a stranger from setting %s',
      async (status) => {
        const { service, RequestModel } = setup();
        const doc = requestDoc();
        RequestModel.findById.mockReturnValue(mockQuery(doc));
        await expect(
          service.updateStatus(doc._id.toString(), STRANGER, status),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(doc.save).not.toHaveBeenCalled();
      },
    );

    it('returns 404 when the request does not exist', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(null));
      await expect(
        service.updateStatus(new Types.ObjectId().toString(), HOST_OWNER, RequestStatus.ACCEPTED),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('still succeeds when the notification fails', async () => {
      const { service, RequestModel, firebase } = setup();
      const doc = requestDoc();
      RequestModel.findById.mockReturnValue(mockQuery(doc));
      firebase.sendNotificationToUser.mockRejectedValue(new Error('fcm down'));

      await expect(
        service.updateStatus(doc._id.toString(), HOST_OWNER, RequestStatus.ACCEPTED),
      ).resolves.toBeDefined();
    });
  });

  describe('findOneForUser', () => {
    const plain = (status: string) => ({
      _id: new Types.ObjectId(),
      userId: GUEST,
      status,
      host: { _id: new Types.ObjectId(), userId: HOST_OWNER, phone: '+353000000' },
      messages: [],
    });

    it('lets the requester read it but hides the host phone until accepted', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(plain(RequestStatus.PENDING)));
      const { host } = await service.findOneForUser('id', GUEST);
      expect(host.phone).toBeUndefined();
      expect(host.userId).toBe(HOST_OWNER);
    });

    it('includes the host phone once accepted', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(plain(RequestStatus.ACCEPTED)));
      const { host } = await service.findOneForUser('id', GUEST);
      expect(host.phone).toBe('+353000000');
    });

    it('lets the host owner read it', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(plain(RequestStatus.PENDING)));
      await expect(service.findOneForUser('id', HOST_OWNER)).resolves.toBeDefined();
    });

    it('forbids strangers', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(plain(RequestStatus.ACCEPTED)));
      await expect(service.findOneForUser('id', STRANGER)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('only lets the requester delete', async () => {
      const { service, RequestModel } = setup();
      RequestModel.findById.mockReturnValue(mockQuery(requestDoc()));
      await expect(service.remove('id', HOST_OWNER)).rejects.toBeInstanceOf(ForbiddenException);
      await expect(service.remove('id', GUEST)).resolves.toBeDefined();
      expect(RequestModel.deleteOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllIncoming', () => {
    it("queries only the caller's host with pagination and newest first", async () => {
      const { service, RequestModel, HostModel } = setup();
      const hostId = new Types.ObjectId();
      HostModel.findOne.mockReturnValue(mockQuery({ _id: hostId }));
      const findQuery = mockQuery([]);
      RequestModel.find.mockReturnValue(findQuery);
      RequestModel.countDocuments.mockReturnValue(mockQuery(42));

      const result = await service.findAllIncoming(HOST_OWNER, { limit: 5, offset: 10 });

      expect(RequestModel.find).toHaveBeenCalledWith({ host: hostId });
      expect(RequestModel.countDocuments).toHaveBeenCalledWith({ host: hostId });
      expect(findQuery.sort).toHaveBeenCalledWith({ createdAt: -1, _id: -1 });
      expect(findQuery.skip).toHaveBeenCalledWith(10);
      expect(findQuery.limit).toHaveBeenCalledWith(5);
      expect(result.total).toBe(42);
    });

    it('returns an empty page when the caller is not a host', async () => {
      const { service, RequestModel, HostModel } = setup();
      HostModel.findOne.mockReturnValue(mockQuery(null));
      await expect(service.findAllIncoming(GUEST, {})).resolves.toEqual({ data: [], total: 0 });
      expect(RequestModel.find).not.toHaveBeenCalled();
    });
  });

  describe('withPhonePolicy', () => {
    it('leaves unpopulated hosts untouched', () => {
      const id = new Types.ObjectId();
      expect(withPhonePolicy({ status: 'pending', host: id }).host).toBe(id);
    });
  });
});
