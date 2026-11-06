import { toSearchParams } from './api';

describe('toSearchParams', () => {
  it('flattens bbox, joins lists and drops empty values', () => {
    expect(
      toSearchParams({
        lat: 53.35,
        lng: -6.26,
        bbox: { swLat: 53.300001, swLng: -6.4, neLat: 53.4, neLng: -6.1 },
        occupations: ['writer', 'artist'],
        facilities: [],
        rate: undefined,
        limit: 18,
      }),
    ).toEqual({
      lat: 53.35,
      lng: -6.26,
      swLat: 53.3,
      swLng: -6.4,
      neLat: 53.4,
      neLng: -6.1,
      occupations: 'writer,artist',
      limit: 18,
    });
  });
});
