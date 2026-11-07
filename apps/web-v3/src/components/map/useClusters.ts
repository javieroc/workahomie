import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { HostPin } from '@/lib/types';

export type ClusterOrPin =
  | { kind: 'cluster'; id: number; lng: number; lat: number; count: number; expansionZoom: number }
  | { kind: 'pin'; pin: HostPin; lng: number; lat: number };

type Index = Supercluster<{ pin: HostPin }>;

export function buildClusterIndex(pins: HostPin[] = []): Index {
  const sc = new Supercluster<{ pin: HostPin }>({ radius: 64, maxZoom: 16 });
  sc.load(
    pins.map((pin) => ({
      type: 'Feature' as const,
      properties: { pin },
      geometry: { type: 'Point' as const, coordinates: pin.location.coordinates },
    })),
  );
  return sc;
}

export function clusterItems(
  index: Index,
  bounds: [number, number, number, number] | null,
  zoom: number,
): ClusterOrPin[] {
  if (!bounds) return [];
  return index.getClusters(bounds, Math.round(zoom)).map((f) => {
    const [lng, lat] = f.geometry.coordinates;
    const props = f.properties as Supercluster.ClusterProperties & { pin?: HostPin };
    if (props.cluster) {
      return {
        kind: 'cluster' as const,
        id: props.cluster_id,
        lng,
        lat,
        count: props.point_count,
        expansionZoom: Math.min(index.getClusterExpansionZoom(props.cluster_id), 17),
      };
    }
    return { kind: 'pin' as const, pin: props.pin!, lng, lat };
  });
}

export function useClusters(
  pins: HostPin[] | undefined,
  bounds: [number, number, number, number] | null,
  zoom: number,
) {
  const index = useMemo(() => buildClusterIndex(pins), [pins]);
  return useMemo(() => clusterItems(index, bounds, zoom), [index, bounds, zoom]);
}
