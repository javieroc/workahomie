import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { BBox } from '@/lib/types';

export interface ExploreParams {
  lat?: number;
  lng?: number;
  q?: string;
  bbox?: BBox;
  occupations: string[];
  facilities: string[];
  rate?: number;
}

const num = (v: string | null) => {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

/**
 * Filters live in the URL so a map view can be shared or bookmarked:
 *   /explore?lat=53.35&lng=-6.26&q=Dublin&occ=writer,artist&fac=wifi&rate=4&bbox=-6.4,53.2,-6.1,53.5
 */
export function useExploreParams() {
  const [sp, setSp] = useSearchParams();

  const params = useMemo<ExploreParams>(() => {
    const b = list(sp.get('bbox')).map(Number);
    return {
      lat: num(sp.get('lat')),
      lng: num(sp.get('lng')),
      q: sp.get('q') ?? undefined,
      bbox:
        b.length === 4 && b.every(Number.isFinite)
          ? { swLng: b[0], swLat: b[1], neLng: b[2], neLat: b[3] }
          : undefined,
      occupations: list(sp.get('occ')),
      facilities: list(sp.get('fac')),
      rate: num(sp.get('rate')),
    };
  }, [sp]);

  const update = useCallback(
    (patch: Partial<ExploreParams>, opts: { replace?: boolean } = {}) => {
      setSp(
        (prev) => {
          const next = new URLSearchParams(prev);
          const set = (k: string, v: string | undefined) => (v ? next.set(k, v) : next.delete(k));
          if ('lat' in patch) set('lat', patch.lat?.toFixed(5));
          if ('lng' in patch) set('lng', patch.lng?.toFixed(5));
          if ('q' in patch) set('q', patch.q);
          if ('bbox' in patch)
            set(
              'bbox',
              patch.bbox
                ? [patch.bbox.swLng, patch.bbox.swLat, patch.bbox.neLng, patch.bbox.neLat]
                    .map((n) => n.toFixed(4))
                    .join(',')
                : undefined,
            );
          if ('occupations' in patch) set('occ', patch.occupations?.join(','));
          if ('facilities' in patch) set('fac', patch.facilities?.join(','));
          if ('rate' in patch) set('rate', patch.rate ? String(patch.rate) : undefined);
          return next;
        },
        { replace: opts.replace },
      );
    },
    [setSp],
  );

  const activeFilterCount =
    params.occupations.length + params.facilities.length + (params.rate ? 1 : 0);
  return { params, update, activeFilterCount };
}
