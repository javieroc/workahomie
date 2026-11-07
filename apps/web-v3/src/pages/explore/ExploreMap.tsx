import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GeolocateControl,
  NavigationControl,
  Popup,
  type MapRef,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import { Link } from 'react-router';
import { BaseMap } from '@/components/map/BaseMap';
import { ClusterMarker, HostPinMarker } from '@/components/map/HostPinMarker';
import { useClusters } from '@/components/map/useClusters';
import { Img, Rating } from '@/components/ui/misc';
import { Spinner } from '@/components/ui/Spinner';
import { useHostPins } from '@/features/hosts/api';
import { useDebounced } from '@/hooks/useDebounced';
import { occupationIcon, titleCase } from '@/lib/occupations';
import type { BBox, HostPin } from '@/lib/types';
import { useExploreStore } from '@/stores/explore';
import type { ExploreParams } from './useExploreParams';

interface Props {
  params: ExploreParams;
  searchOnMove: boolean;
  onSearchOnMoveChange: (v: boolean) => void;
  onCommitArea: (bbox: BBox) => void;
}

const WORLD: BBox = { swLat: -85, swLng: -180, neLat: 85, neLng: 180 };

const toBBox = (map: maplibregl.Map): BBox => {
  const b = map.getBounds();
  return {
    swLat: b.getSouth(),
    swLng: Math.max(-180, b.getWest()),
    neLat: b.getNorth(),
    neLng: Math.min(180, b.getEast()),
  };
};

export function ExploreMap({ params, searchOnMove, onSearchOnMoveChange, onCommitArea }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(2);
  const [dirty, setDirty] = useState(false);
  const { hoveredId, selectedId, setHovered, setSelected } = useExploreStore();

  // Pins follow the live viewport (debounced), independent of the paginated list.
  const liveBounds = useDebounced(bounds, 250);
  // At continent/world zoom, viewport bounds wrap and clip; ask for the whole world instead.
  const pinBounds = liveBounds && zoom < 3 ? WORLD : liveBounds;
  const { data: pins, isFetching } = useHostPins(
    {
      bbox: pinBounds ?? undefined,
      occupations: params.occupations,
      facilities: params.facilities,
      rate: params.rate,
    },
    Boolean(liveBounds),
  );

  const clusterBounds = useMemo<[number, number, number, number] | null>(
    () =>
      bounds
        ? zoom < 3
          ? [-180, -85, 180, 85]
          : [bounds.swLng, bounds.swLat, bounds.neLng, bounds.neLat]
        : null,
    [bounds, zoom],
  );
  const items = useClusters(pins, clusterBounds, zoom);
  const selected = useMemo(() => pins?.find((p) => p._id === selectedId), [pins, selectedId]);

  // Fly when the user picks a new place from search.
  const { lat, lng, q } = params;
  useEffect(() => {
    if (lat == null || lng == null) return;
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 11.5, duration: 1600, essential: true });
  }, [lat, lng, q]);

  const sync = useCallback(
    (e: ViewStateChangeEvent | { target: maplibregl.Map }, userMoved: boolean) => {
      const map = e.target;
      const bbox = toBBox(map);
      setBounds(bbox);
      setZoom(map.getZoom());
      if (!userMoved) {
        onCommitArea(bbox);
        return;
      }
      if (searchOnMove) onCommitArea(bbox);
      else setDirty(true);
    },
    [onCommitArea, searchOnMove],
  );

  const initialViewState = useMemo(() => {
    if (params.bbox)
      return {
        bounds: [params.bbox.swLng, params.bbox.swLat, params.bbox.neLng, params.bbox.neLat] as [
          number,
          number,
          number,
          number,
        ],
      };
    if (lat != null && lng != null) return { longitude: lng, latitude: lat, zoom: 11.5 };
    return { longitude: 0, latitude: 28, zoom: 1.6 };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial only
  }, []);

  return (
    <div className="relative size-full">
      <BaseMap
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        onLoad={(e) => sync(e, false)}
        onMoveEnd={(e) => sync(e, Boolean(e.originalEvent))}
        onResize={(e) => {
          setBounds(toBBox(e.target));
          setZoom(e.target.getZoom());
        }}
        onClick={() => setSelected(null)}
        maxZoom={17}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={false}
          showAccuracyCircle={false}
        />

        {items.map((it) =>
          it.kind === 'cluster' ? (
            <ClusterMarker
              key={`c${it.id}`}
              lng={it.lng}
              lat={it.lat}
              count={it.count}
              onClick={() =>
                mapRef.current?.easeTo({
                  center: [it.lng, it.lat],
                  zoom: it.expansionZoom,
                  duration: 600,
                })
              }
            />
          ) : (
            <HostPinMarker
              key={it.pin._id}
              pin={it.pin}
              lng={it.lng}
              lat={it.lat}
              active={hoveredId === it.pin._id || selectedId === it.pin._id}
              compact={zoom < 11}
              onHover={setHovered}
              onSelect={(p) => setSelected(p._id)}
            />
          ),
        )}

        {selected && (
          <Popup
            longitude={selected.location.coordinates[0]}
            latitude={selected.location.coordinates[1]}
            offset={14}
            closeButton={false}
            onClose={() => setSelected(null)}
            maxWidth="280px"
          >
            <PinCard pin={selected} />
          </Popup>
        )}
      </BaseMap>

      {/* map overlay controls */}
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
        {dirty && !searchOnMove ? (
          <button
            type="button"
            onClick={() => {
              const map = mapRef.current?.getMap();
              if (map) onCommitArea(toBBox(map));
              setDirty(false);
            }}
            className="pointer-events-auto rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper shadow-[var(--shadow-float)]"
          >
            Search this area
          </button>
        ) : (
          <label className="pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-full bg-card/95 px-4 py-2 text-sm shadow-[var(--shadow-card)] backdrop-blur">
            <input
              type="checkbox"
              checked={searchOnMove}
              onChange={(e) => onSearchOnMoveChange(e.target.checked)}
              className="size-4 accent-magenta"
            />
            Search as I move the map
            {isFetching && <Spinner className="size-3.5 text-muted" />}
          </label>
        )}
      </div>
    </div>
  );
}

function PinCard({ pin }: { pin: HostPin }) {
  const Icon = occupationIcon(pin.occupation);
  return (
    <Link to={`/hosts/${pin._id}`} className="block w-[260px] text-ink">
      <Img
        src={pin.picture}
        alt={`${pin.firstName}'s workspace`}
        className="h-36 w-full"
        fallbackLabel={pin.firstName}
      />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">
            {titleCase(pin.firstName)} {titleCase(pin.lastName?.slice(0, 1))}.
          </p>
          <Rating rate={pin.rate} count={pin.countReviews} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">
          <Icon className="size-3.5 text-magenta" /> {titleCase(pin.occupation)}
        </p>
        <p className="mt-3 text-sm font-medium text-magenta-600">View workspace →</p>
      </div>
    </Link>
  );
}
