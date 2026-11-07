import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { mockModel, mockQuery } from 'src/test-utils/mongoose-mocks';
import { RequestStatus } from 'src/requests/dto/create-request.dto';
import { NO_VISIT_MESSAGE, ReviewsService } from './reviews.service';

const HOST_OWNER = 'host-owner';
const GUEST = 'guest';
const NOW = new Date('2026-11-06T12:00:00.000Z');

function setup() {
  const hostId = new Types.ObjectId();
  const ReviewModel = mockModel({
    exists: jest.fn().mockResolvedValue(null),
    create: jest.fn(async (data) => ({ _id: new Types.ObjectId(), ...data })),
    aggregate: jest.fn(() => mockQuery([{ avgRating: 4.5, count: 2 }])),
    findById: jest.fn(),
    deleteOne: jest.fn(() => mockQuery({ deletedCount: 1 })),
    countDocuments: jest.fn(() => mockQuery(0)),
    find: jest.fn(() => mockQuery([])),
  });
  const HostModel = mockModel({
    findById: jest.fn(() => mockQuery({ _id: hostId, userId: HOST_OWNER })),
    updateOne: jest.fn(() => mockQuery({})),
  });
  const RequestModel = mockModel({
    exists: jest.fn().mockResolvedValue({ _id: new Types.ObjectId() }),
  });
  const service = new ReviewsService(ReviewModel, HostModel, RequestModel);
  return { service, hostId, ReviewModel, HostModel, RequestModel };
}

const dto = { review: 'Great place', rating: 5, userName: 'G', userAvatar: '' };

describe('ReviewsService', () => {
  describe('eligibility', () => {
    it('is eligible after an accepted visit that already started', async () => {
      const { service, hostId, RequestModel } = setup();
      await expect(service.getEligibility(hostId.toString(), GUEST, NOW)).resolves.toEqual({
        canReview: true,
      });
      expect(RequestModel.exists).toHaveBeenCalledWith({
        host: hostId,
        userId: GUEST,
        status: RequestStatus.ACCEPTED,
        checkIn: { $lte: NOW },
      });
    });

    it('reports own_place for the host owner', async () => {
      const { service, hostId } = setup();
      await expect(service.getEligibility(hostId.toString(), HOST_OWNER, NOW)).resolves.toEqual({
        canReview: false,
        reason: 'own_place',
      });
    });

    it('reports already_reviewed', async () => {
      const { service, hostId, ReviewModel } = setup();
      ReviewModel.exists.mockResolvedValue({ _id: new Types.ObjectId() });
      await expect(service.getEligibility(hostId.toString(), GUEST, NOW)).resolves.toEqual({
        canReview: false,
        reason: 'already_reviewed',
      });
    });

    it('reports no_visit', async () => {
      const { service, hostId, RequestModel } = setup();
      RequestModel.exists.mockResolvedValue(null);
      await expect(service.getEligibility(hostId.toString(), GUEST, NOW)).resolves.toEqual({
        canReview: false,
        reason: 'no_visit',
      });
    });

    it('404s for unknown hosts', async () => {
      const { service, HostModel } = setup();
      HostModel.findById.mockReturnValue(mockQuery(null));
      await expect(service.getEligibility('x', GUEST, NOW)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('maps ineligibility reasons to 400 / 409 / 403', async () => {
      const own = setup();
      await expect(
        own.service.create(own.hostId.toString(), HOST_OWNER, dto, NOW),
      ).rejects.toBeInstanceOf(BadRequestException);

      const dup = setup();
      dup.ReviewModel.exists.mockResolvedValue({ _id: new Types.ObjectId() });
      await expect(
        dup.service.create(dup.hostId.toString(), GUEST, dto, NOW),
      ).rejects.toBeInstanceOf(ConflictException);

      const noVisit = setup();
      noVisit.RequestModel.exists.mockResolvedValue(null);
      const error = await noVisit.service
        .create(noVisit.hostId.toString(), GUEST, dto, NOW)
        .catch((e) => e);
      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error.message).toBe(NO_VISIT_MESSAGE);
    });

    it('stores author and server date, then recalculates the host rating with an ObjectId match', async () => {
      const { service, hostId, ReviewModel, HostModel } = setup();
      const spoofed = { ...dto, date: '1999-01-01' } as typeof dto;

      await service.create(hostId.toString(), GUEST, spoofed, NOW);

      expect(ReviewModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: GUEST, host: hostId, date: NOW.toISOString() }),
      );
      const pipeline = ReviewModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.host).toBeInstanceOf(Types.ObjectId);
      expect(pipeline[0].$match.host.equals(hostId)).toBe(true);
      expect(HostModel.updateOne).toHaveBeenCalledWith(
        { _id: hostId },
        { rate: 4.5, countReviews: 2 },
      );
    });
  });

  describe('recalculateHostRating', () => {
    it('resets rate and count when no reviews remain', async () => {
      const { service, hostId, ReviewModel, HostModel } = setup();
      ReviewModel.aggregate.mockReturnValue(mockQuery([]));
      await service.recalculateHostRating(hostId.toString());
      expect(HostModel.updateOne).toHaveBeenCalledWith(
        { _id: hostId },
        { rate: 0, countReviews: 0 },
      );
    });
  });

  describe('remove', () => {
    it('only lets the author delete and recalculates afterwards', async () => {
      const { service, hostId, ReviewModel, HostModel } = setup();
      const review = { _id: new Types.ObjectId(), userId: GUEST, host: hostId };
      ReviewModel.findById.mockReturnValue(mockQuery(review));

      await expect(service.remove(review._id.toString(), 'someone')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(ReviewModel.deleteOne).not.toHaveBeenCalled();

      await service.remove(review._id.toString(), GUEST);
      expect(ReviewModel.deleteOne).toHaveBeenCalledWith({ _id: review._id });
      expect(HostModel.updateOne).toHaveBeenCalled();
    });

    it('forbids deleting legacy reviews without an author', async () => {
      const { service, ReviewModel } = setup();
      ReviewModel.findById.mockReturnValue(mockQuery({ _id: new Types.ObjectId() }));
      await expect(service.remove('id', GUEST)).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('counts only the reviews of the host and sorts newest first', async () => {
      const { service, hostId, ReviewModel } = setup();
      const query = mockQuery([]);
      ReviewModel.find.mockReturnValue(query);

      await service.findAll(hostId.toString(), { limit: 5, offset: 0 });

      const countFilter = ReviewModel.countDocuments.mock.calls[0][0];
      expect(countFilter.host.equals(hostId)).toBe(true);
      expect(query.sort).toHaveBeenCalledWith({ date: -1, _id: -1 });
    });
  });
});
