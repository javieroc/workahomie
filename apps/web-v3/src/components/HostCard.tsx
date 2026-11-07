import { MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';
import { formatDistance, hostCover, hostName, parseAddress } from '@/lib/geo';
import { occupationIcon, titleCase } from '@/lib/occupations';
import type { Host } from '@/lib/types';
import { Avatar, Img, Rating } from './ui/misc';
import { SaveButton } from './SaveButton';

interface Props {
  host: Host;
  active?: boolean;
  onHover?: (id: string | null) => void;
  className?: string;
  layout?: 'grid' | 'row';
}

export function HostCard({ host, active, onHover, className, layout = 'grid' }: Props) {
  const Icon = occupationIcon(host.occupation);
  const place = parseAddress(host.address).short;
  const distance = formatDistance(host.distance);

  return (
    <Link
      to={`/hosts/${host._id}`}
      onMouseEnter={() => onHover?.(host._id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        'group block rounded-3xl outline-offset-4 transition',
        layout === 'row' && 'flex gap-4',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl bg-paper-2',
          layout === 'grid' ? 'aspect-[4/3]' : 'aspect-square w-32 shrink-0',
        )}
      >
        <Img
          src={hostCover(host)}
          alt={host.placeDescription ?? hostName(host)}
          className="size-full transition duration-500 group-hover:scale-[1.04]"
          fallbackLabel={host.firstName}
        />
        {layout === 'grid' && <SaveButton hostId={host._id} className="absolute right-3 top-3" />}
        {distance && layout === 'grid' && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[11px] text-paper backdrop-blur">
            {distance}
          </span>
        )}
        <span
          className={cn(
            'pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-inset transition',
            active ? 'ring-magenta' : 'ring-transparent',
          )}
        />
      </div>
      <div className={cn('min-w-0', layout === 'grid' ? 'mt-3' : 'py-1')}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-sans text-[15px] font-semibold">
            {host.placeDescription || `${titleCase(host.firstName)}’s workspace`}
          </h3>
          <Rating rate={host.rate} count={host.countReviews} className="shrink-0" />
        </div>
        {place && (
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-3.5" /> <span className="truncate">{place}</span>
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-2">
          <Avatar src={host.profileImages?.[0]} name={hostName(host)} className="size-7" />
          <span className="truncate text-sm">
            <span className="font-medium">{titleCase(host.firstName)}</span>
            <span className="text-muted"> · </span>
            <span className="inline-flex items-center gap-1 text-ink-2">
              <Icon className="size-3.5 text-magenta" />
              {titleCase(host.occupation)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HostCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] animate-pulse rounded-3xl bg-ink/[0.06]" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-ink/[0.06]" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-ink/[0.06]" />
    </div>
  );
}
