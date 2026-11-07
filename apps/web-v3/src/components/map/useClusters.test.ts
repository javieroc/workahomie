import type { HostPin } from '@/lib/types';
import { buildClusterIndex, clusterItems } from './useClusters';

const pin = (id: string, lng: number, lat: number): HostPin => ({
  _id: id,
  location: { type: 'Point', coordinates: [lng, lat] },
  firstName: 'A',
  lastName: 'B',
  occupation: 'writer',
  rate: 4,
  countReviews: 1,
});

describe('clustering', () => {
  const index = buildClusterIndex([
    pin('1', -6.26, 53.35),
    pin('2', -6.261, 53.351),
    pin('3', 2.35, 48.85),
  ]);
  const world: [number, number, number, number] = [-180, -85, 180, 85];

  it('groups nearby pins at low zoom', () => {
    const items = clusterItems(index, world, 3);
    expect(items.filter((i) => i.kind === 'cluster')).toHaveLength(1);
    expect(items.filter((i) => i.kind === 'pin')).toHaveLength(1);
  });
  it('splits clusters when zoomed in', () => {
    const items = clusterItems(index, world, 17);
    expect(items).toHaveLength(3);
    expect(items.every((i) => i.kind === 'pin')).toBe(true);
  });
  it('returns nothing without bounds', () => {
    expect(clusterItems(index, null, 10)).toEqual([]);
  });
});
