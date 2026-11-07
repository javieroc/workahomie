import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Marker, NavigationControl, type MapRef } from 'react-map-gl/maplibre';
import { BaseMap } from './BaseMap';

/** Drag the pin (or click the map) to fine-tune where the workspace is. */
export function LocationPicker({
  value,
  onChange,
  className,
}: {
  value?: { lat: number; lng: number };
  onChange: (v: { lat: number; lng: number }) => void;
  className?: string;
}) {
  const ref = useRef<MapRef>(null);
  const lat = value?.lat;
  const lng = value?.lng;
  useEffect(() => {
    if (lat != null && lng != null)
      ref.current?.easeTo({
        center: [lng, lat],
        zoom: Math.max(ref.current.getZoom(), 15),
        duration: 600,
      });
  }, [lat, lng]);

  return (
    <div className={className}>
      <BaseMap
        ref={ref}
        initialViewState={
          value
            ? { longitude: value.lng, latitude: value.lat, zoom: 15 }
            : { longitude: 0, latitude: 30, zoom: 1.5 }
        }
        style={{ width: '100%', height: '100%' }}
        onClick={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
        cursor="crosshair"
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {value && (
          <Marker
            longitude={value.lng}
            latitude={value.lat}
            anchor="bottom"
            draggable
            onDragEnd={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
          >
            <MapPin
              className="size-10 fill-magenta text-white drop-shadow-lg"
              strokeWidth={1.5}
              aria-label="Workspace location (drag to adjust)"
            />
          </Marker>
        )}
      </BaseMap>
    </div>
  );
}
