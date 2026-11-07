import { ArrowRight, LocateFixed } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { HostCard, HostCardSkeleton } from '@/components/HostCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useHosts } from '@/features/hosts/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import { exploreHref } from './cities';

export function NearbyHosts() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const { state, locate } = useGeolocation();
  const { data, isLoading, isError } = useHosts({
    ...(center ? { ...center, radius: 50 } : {}),
    limit: 8,
  });

  if (isError) return null; // API unreachable: don't show an empty shelf on the landing page

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-magenta-600">{center ? 'Near you' : 'Fresh on the map'}</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            {center ? 'Desks within reach' : 'Homes open for work this week'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {!center && (
            <Button
              variant="outline"
              loading={state.status === 'locating'}
              onClick={() =>
                locate()
                  .then(setCenter)
                  .catch(() => toast.error('Location unavailable — showing all hosts instead'))
              }
            >
              <LocateFixed className="size-4" /> Show hosts near me
            </Button>
          )}
          <ButtonLink to={center ? exploreHref(center) : '/explore'} variant="ink">
            Open the map <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>

      <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                <HostCardSkeleton />
              </div>
            ))
          : data?.data.map((h) => (
              <div key={h._id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                <HostCard host={h} />
              </div>
            ))}
      </div>
      {!isLoading && data?.data.length === 0 && (
        <p className="mt-6 text-muted">
          No hosts within 50 km yet — be the first one in your area.
        </p>
      )}
    </section>
  );
}
