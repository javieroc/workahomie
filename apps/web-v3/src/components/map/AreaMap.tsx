import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { BaseMap } from './BaseMap';
import { fuzzLocation } from '@/lib/geo';

/** Approximate area (≈500 m circle around a shifted point) instead of the exact address. */
export function AreaMap({
  lngLat,
  seed,
  className,
}: {
  lngLat: [number, number];
  seed: string;
  className?: string;
}) {
  const center = useMemo(() => fuzzLocation(lngLat, seed), [lngLat, seed]);
  const circle = useMemo(() => {
    const [lng, lat] = center;
    const pts = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      return [
        lng + (500 * Math.cos(a)) / (111_320 * Math.cos((lat * Math.PI) / 180)),
        lat + (500 * Math.sin(a)) / 111_320,
      ];
    });
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'Polygon' as const, coordinates: [pts] },
    };
  }, [center]);

  return (
    <div className={className}>
      <BaseMap
        initialViewState={{ longitude: center[0], latitude: center[1], zoom: 13.6 }}
        scrollZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <Source id="area" type="geojson" data={circle}>
          <Layer
            id="area-fill"
            type="fill"
            paint={{ 'fill-color': '#d0337a', 'fill-opacity': 0.14 }}
          />
          <Layer
            id="area-line"
            type="line"
            paint={{ 'line-color': '#d0337a', 'line-width': 2, 'line-dasharray': [2, 2] }}
          />
        </Source>
      </BaseMap>
    </div>
  );
}
