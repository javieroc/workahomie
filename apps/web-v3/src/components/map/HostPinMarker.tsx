import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { occupationIcon, titleCase } from '@/lib/occupations';
import { cn } from '@/lib/cn';
import type { HostPin } from '@/lib/types';

interface Props {
  pin: HostPin;
  lng: number;
  lat: number;
  active?: boolean;
  compact?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (pin: HostPin) => void;
}

/** Pill marker: occupation icon + name. Expands when the matching list card is hovered. */
export const HostPinMarker = memo(function HostPinMarker({
  pin,
  lng,
  lat,
  active,
  compact,
  onHover,
  onSelect,
}: Props) {
  const Icon = occupationIcon(pin.occupation);
  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom" style={{ zIndex: active ? 10 : 1 }}>
      <button
        type="button"
        onMouseEnter={() => onHover?.(pin._id)}
        onMouseLeave={() => onHover?.(null)}
        onFocus={() => onHover?.(pin._id)}
        onBlur={() => onHover?.(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(pin);
        }}
        aria-label={`${pin.firstName} ${pin.lastName}, ${pin.occupation}`}
        className={cn(
          'group relative flex items-center gap-1.5 rounded-full border-2 py-1 pl-1 pr-3 text-[13px] font-semibold shadow-[0_6px_18px_-6px_rgb(36_18_47/0.5)] transition-all duration-200',
          active
            ? 'scale-110 border-ink bg-ink text-paper'
            : 'border-white bg-white text-ink hover:scale-105',
          compact && !active && 'pr-1',
        )}
      >
        <span
          className={cn(
            'grid size-6 place-items-center rounded-full',
            active ? 'bg-magenta text-white' : 'bg-magenta-100 text-magenta-600',
          )}
        >
          <Icon className="size-3.5" aria-hidden />
        </span>
        {(!compact || active) && (
          <span className="max-w-[120px] truncate">{titleCase(pin.firstName)}</span>
        )}
        <span
          className={cn(
            'absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2',
            active ? 'border-ink bg-ink' : 'border-white bg-white',
          )}
          aria-hidden
        />
      </button>
    </Marker>
  );
});

export function ClusterMarker({
  lng,
  lat,
  count,
  onClick,
}: {
  lng: number;
  lat: number;
  count: number;
  onClick: () => void;
}) {
  const size = Math.min(64, 34 + Math.log2(count) * 6);
  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-label={`${count} hosts, zoom in`}
        className="relative grid place-items-center rounded-full bg-ink font-mono text-sm font-medium text-paper shadow-[0_8px_24px_-8px_rgb(36_18_47/0.7)] ring-4 ring-magenta/25 transition hover:scale-105"
        style={{ width: size, height: size }}
      >
        {count}
      </button>
    </Marker>
  );
}
