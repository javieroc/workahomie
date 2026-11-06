import { BadRequestException } from '@nestjs/common';
import { mockModel, mockQuery } from 'src/test-utils/mongoose-mocks';
import { buildHostSearchQuery, HostsService, MAX_PAGE_SIZE } from './hosts.service';

function setup() {
  const HostModel = mockModel({
    aggregate: jest.fn(() =>
      mockQuery([{ data: [{ _id: 'a', distance: 12 }], total: [{ count: 7 }] }]),
    ),
    countDocuments: jest.fn(() => mockQuery(3)),
    find: jest.fn(() => mockQuery([])),
  });
  const ReviewModel = mockModel();
  const cloudinary = { uploadImage: jest.fn(), deleteImage: jest.fn() };
  const service = new HostsService(HostModel, ReviewModel, cloudinary as never);
  return { service, HostModel };
}

const BBOX = { swLat: 53, swLng: -7, neLat: 54, neLng: -6 };

describe('buildHostSearchQuery', () => {
  it('uses $geoNear with the default 10 km radius when only a center is given', () => {
    const { filter, geoNear } = buildHostSearchQuery({ lat: 53.35, lng: -6.26 });
    expect(filter).toEqual({});
    expect(geoNear).toEqual({
      near: { type: 'Point', coordinates: [-6.26, 53.35] },
      key: 'location',
      spherical: true,
      distanceField: 'distance',
      query: {},
      maxDistance: 10_000,
    });
  });

  it('caps the radius at 200 km', () => {
    const { geoNear } = buildHostSearchQuery({ lat: 0, lng: 0, radius: 5000 });
    expect(geoNear.maxDistance).toBe(200_000);
  });

  it('uses a $box filter (lng first) and no $geoNear for a bbox without center', () => {
    const { filter, geoNear } = buildHostSearchQuery({ ...BBOX, rate: 4 });
    expect(geoNear).toBeUndefined();
    expect(filter).toEqual({
      rate: { $gte: 4 },
      location: {
        $geoWithin: {
          $box: [
            [-7, 53],
            [-6, 54],
          ],
        },
      },
    });
  });

  it('combines bbox and center: bbox in the $geoNear query, no radius', () => {
    const { filter, geoNear } = buildHostSearchQuery({ ...BBOX, lat: 53.5, lng: -6.5, radius: 1 });
    expect(geoNear.query).toBe(filter);
    expect(geoNear.maxDistance).toBeUndefined();
    expect(filter.location).toEqual({
      $geoWithin: {
        $box: [
          [-7, 53],
          [-6, 54],
        ],
      },
    });
  });

  it('clamps a bbox crossing the antimeridian', () => {
    const { filter } = buildHostSearchQuery({ swLat: -20, swLng: 170, neLat: -10, neLng: -170 });
    expect(filter.location).toEqual({
      $geoWithin: {
        $box: [
          [170, -20],
          [180, -10],
        ],
      },
    });
  });

  it('ignores an incomplete bbox and adds attribute filters', () => {
    const { filter } = buildHostSearchQuery({
      swLat: 1,
      swLng: 2,
      occupations: ['writer'],
      facilities: ['wifi', 'coffee'],
    });
    expect(filter).toEqual({
      occupation: { $in: ['writer'] },
      facilities: { $all: ['wifi', 'coffee'] },
    });
  });
});

describe('HostsService.findAll', () => {
  it('runs a $geoNear aggregation without phone and with a $facet total when a center is given', async () => {
    const { service, HostModel } = setup();

    const result = await service.findAll({ lat: 53.35, lng: -6.26, limit: 500, offset: 5 });

    const pipeline = HostModel.aggregate.mock.calls[0][0];
    expect(pipeline[0].$geoNear.near.coordinates).toEqual([-6.26, 53.35]);
    expect(pipeline[1]).toEqual({ $project: { phone: 0, __v: 0 } });
    expect(pipeline[2].$facet.data).toEqual([{ $skip: 5 }, { $limit: MAX_PAGE_SIZE }]);
    expect(result).toEqual({ data: [{ _id: 'a', distance: 12 }], total: 7 });
    expect(HostModel.find).not.toHaveBeenCalled();
  });

  it('uses find + countDocuments with the bbox filter when there is no center', async () => {
    const { service, HostModel } = setup();

    const result = await service.findAll({ ...BBOX });

    const expected = {
      location: {
        $geoWithin: {
          $box: [
            [-7, 53],
            [-6, 54],
          ],
        },
      },
    };
    expect(HostModel.find).toHaveBeenCalledWith(expected, { phone: 0, __v: 0 });
    expect(HostModel.countDocuments).toHaveBeenCalledWith(expected);
    expect(HostModel.aggregate).not.toHaveBeenCalled();
    expect(result.total).toBe(3);
  });
});

describe('HostsService.findPins', () => {
  it('requires a bbox', async () => {
    const { service } = setup();
    await expect(service.findPins({ lat: 1, lng: 1 })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns capped pins with the first picture (falls back to profile image)', async () => {
    const { service, HostModel } = setup();
    HostModel.aggregate.mockReturnValue(
      mockQuery([
        { _id: '1', firstName: 'A', pictures: ['p1'], profileImages: ['a1'] },
        { _id: '2', firstName: 'B', pictures: [], profileImages: ['a2'] },
      ]),
    );

    const result = await service.findPins({ ...BBOX });

    const pipeline = HostModel.aggregate.mock.calls[0][0];
    expect(pipeline[0]).toEqual({
      $match: {
        location: {
          $geoWithin: {
            $box: [
              [-7, 53],
              [-6, 54],
            ],
          },
        },
      },
    });
    expect(pipeline).toContainEqual({ $limit: 1000 });
    expect(result.data).toEqual([
      { _id: '1', firstName: 'A', picture: 'p1' },
      { _id: '2', firstName: 'B', picture: 'a2' },
    ]);
  });
});
