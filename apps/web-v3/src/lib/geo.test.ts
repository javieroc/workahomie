import { formatDistance, fuzzLocation, parseAddress, shortLabel } from './geo';

describe('parseAddress', () => {
  it('reads Nominatim JSON stored by the API', () => {
    const a = parseAddress(
      JSON.stringify({
        display_name: '29 W Washington St, Dublin 2, Leinster, Ireland',
        lat: '53.34',
        lon: '-6.26',
      }),
    );
    expect(a).toMatchObject({
      label: '29 W Washington St, Dublin 2, Leinster, Ireland',
      lat: 53.34,
      lng: -6.26,
    });
  });
  it('falls back to plain strings and empty values', () => {
    expect(parseAddress('Main St, Cork')).toMatchObject({
      label: 'Main St, Cork',
      short: 'Main St, Cork',
    });
    expect(parseAddress(undefined)).toEqual({ label: '', short: '' });
  });
});

describe('shortLabel', () => {
  it('hides the street for privacy', () => {
    expect(shortLabel('29 W Washington St, Dublin 2, Leinster, Ireland')).toBe('Dublin 2, Ireland');
  });
});

describe('formatDistance', () => {
  it('formats meters and kilometers', () => {
    expect(formatDistance(120)).toBe('100 m away');
    expect(formatDistance(20)).toBe('50 m away');
    expect(formatDistance(2450)).toBe('2.5 km away');
    expect(formatDistance(23_400)).toBe('23 km away');
    expect(formatDistance(undefined)).toBeUndefined();
  });
});

describe('fuzzLocation', () => {
  const origin: [number, number] = [-6.26, 53.35];
  it('is deterministic per seed', () => {
    expect(fuzzLocation(origin, 'abc')).toEqual(fuzzLocation(origin, 'abc'));
    expect(fuzzLocation(origin, 'abc')).not.toEqual(fuzzLocation(origin, 'xyz'));
  });
  it('moves the point between 150 and 300 meters', () => {
    const [lng, lat] = fuzzLocation(origin, '65f1c0ffee');
    const dy = (lat - origin[1]) * 111_320;
    const dx = (lng - origin[0]) * 111_320 * Math.cos((origin[1] * Math.PI) / 180);
    const d = Math.hypot(dx, dy);
    expect(d).toBeGreaterThanOrEqual(149);
    expect(d).toBeLessThanOrEqual(301);
  });
});
