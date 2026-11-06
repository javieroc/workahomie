import { useEffect, useMemo, useRef } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import { BaseMap } from '@/components/map/BaseMap';
import { HostPinMarker } from '@/components/map/HostPinMarker';
import { useHostPins } from '@/features/hosts/api';
import type { City } from './cities';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Lazily loaded so MapLibre (~300 kB gzip) never blocks the hero's first paint. */
export default function HeroBackdrop({ city }: { city: City }) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const wide = window.innerWidth >= 1024;
    mapRef.current?.flyTo({
      center: [city.lng, city.lat],
      zoom: 12.4,
      // keep the city centre in the open half of the hero, not under the headline
      padding: wide
        ? { left: window.innerWidth * 0.42, top: 0, right: 0, bottom: 0 }
        : { top: 0, left: 0, right: 0, bottom: 260 },
      duration: reducedMotion() ? 0 : 4200,
      essential: true,
      curve: 1.6,
    });
  }, [city]);

  const bbox = useMemo(
    () => ({
      swLat: city.lat - 0.12,
      swLng: city.lng - 0.2,
      neLat: city.lat + 0.12,
      neLng: city.lng + 0.2,
    }),
    [city],
  );
  const { data: pins = [] } = useHostPins({ bbox });

  return (
    <BaseMap
      ref={mapRef}
      initialViewState={{ longitude: city.lng, latitude: city.lat, zoom: 12.4 }}
      interactive={false}
      style={{ width: '100%', height: '100%' }}
      onLoad={(e) => {
        const wide = window.innerWidth >= 1024;
        e.target.jumpTo({
          center: [city.lng, city.lat],
          padding: wide
            ? { left: window.innerWidth * 0.42, top: 0, right: 0, bottom: 0 }
            : { top: 0, left: 0, right: 0, bottom: 260 },
        });
      }}
    >
      {pins.slice(0, 40).map((p) => (
        <HostPinMarker
          key={p._id}
          pin={p}
          lng={p.location.coordinates[0]}
          lat={p.location.coordinates[1]}
          compact
        />
      ))}
    </BaseMap>
  );
}
