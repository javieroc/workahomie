import {
  ArrowLeft,
  Coffee,
  Car,
  Cookie,
  Flower2,
  ShowerHead,
  Share2,
  Utensils,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { env } from '@/lib/env';
import { AreaMap } from '@/components/map/AreaMap';
import { SaveButton } from '@/components/SaveButton';
import { ButtonLink } from '@/components/ui/Button';
import { Avatar, EmptyState, Rating, Skeleton } from '@/components/ui/misc';
import { useHost } from '@/features/hosts/api';
import { isNotFound } from '@/lib/api';
import { hostName, parseAddress, toLngLat } from '@/lib/geo';
import { occupationIcon, titleCase } from '@/lib/occupations';
import { Gallery } from './Gallery';
import { RequestCard } from './RequestCard';
import { Reviews } from './Reviews';

const amenityIcons: Record<string, LucideIcon> = {
  wifi: Wifi,
  coffee: Coffee,
  kitchen: Utensils,
  parking: Car,
  garden: Flower2,
  showers: ShowerHead,
  snacks: Cookie,
};

export default function HostPage() {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const { data: host, isLoading, error } = useHost(hostId);

  useEffect(() => {
    if (host)
      document.title = `${host.placeDescription || `${titleCase(host.firstName)}’s workspace`} · Workahomies`;
  }, [host]);

  if (isLoading) return <HostSkeleton />;
  if (!host) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <EmptyState
          icon={<ArrowLeft className="size-5" />}
          title={isNotFound(error) ? 'This workspace is gone' : 'Couldn’t load this workspace'}
        >
          <ButtonLink to="/explore" variant="ink" className="mt-4">
            Back to the map
          </ButtonLink>
        </EmptyState>
      </div>
    );
  }

  const OccIcon = occupationIcon(host.occupation);
  const area = parseAddress(host.address).short;
  const lngLat = toLngLat(host.location);
  const title = host.placeDescription || `${titleCase(host.firstName)}’s workspace`;

  return (
    <article className="mx-auto max-w-[1200px] px-4 pb-24 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/explore'))}
          className="flex items-center gap-2 text-sm text-ink-2 hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              const url = window.location.href;
              try {
                if (navigator.share) await navigator.share({ title, url });
                else {
                  await navigator.clipboard.writeText(url);
                  toast.success('Link copied');
                }
              } catch {
                /* user cancelled */
              }
            }}
            className="flex h-9 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm hover:border-ink/30"
          >
            <Share2 className="size-4" /> Share
          </button>
          <SaveButton hostId={host._id} className="border border-line bg-card" />
        </div>
      </div>

      <header className="mt-6">
        <h1 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-2">
          <Rating rate={host.rate} count={host.countReviews} />
          {area && <span>· {area}</span>}
        </p>
      </header>

      <div className="mt-8">
        <Gallery images={host.pictures ?? []} title={title} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          <section className="flex items-start gap-5 border-b border-line pb-10">
            <Avatar src={host.profileImages?.[0]} name={hostName(host)} className="size-20" />
            <div>
              <p className="eyebrow text-muted">Your host</p>
              <h2 className="mt-1 text-2xl font-semibold">{titleCase(hostName(host))}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-ink-2">
                <OccIcon className="size-4 text-magenta" />
                {host.occupation === 'others' && host.occupationDescription
                  ? titleCase(host.occupationDescription)
                  : titleCase(host.occupation)}
              </p>
              {host.aboutMe && (
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">{host.aboutMe}</p>
              )}
            </div>
          </section>

          {host.placeDetails && (
            <section>
              <h2 className="text-2xl font-semibold">About the space</h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-ink-2">
                {host.placeDetails}
              </p>
            </section>
          )}

          {!!host.facilities?.length && (
            <section>
              <h2 className="text-2xl font-semibold">What’s on the desk</h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {host.facilities.map((f) => {
                  const Icon = amenityIcons[f] ?? Coffee;
                  return (
                    <li
                      key={f}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3"
                    >
                      <Icon className="size-5 text-magenta" /> {titleCase(f)}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {lngLat && (
            <section>
              <h2 className="text-2xl font-semibold">Where you’ll work</h2>
              <p className="mt-1 text-sm text-muted">
                Approximate area — the exact address is shared after the host accepts your request.
              </p>
              <AreaMap
                lngLat={lngLat}
                seed={host._id}
                className="mt-5 h-[320px] overflow-hidden rounded-3xl border border-line"
              />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <RequestCard host={host} />
          <p className="mt-4 text-center text-sm text-muted">
            Faster on your phone —{' '}
            <a
              href={env.apkUrl}
              className="font-medium text-magenta-600 underline-offset-4 hover:underline"
            >
              get the Android app
            </a>
          </p>
        </aside>
      </div>

      <div className="mt-16 border-t border-line pt-14">
        <Reviews host={host} />
      </div>
    </article>
  );
}

function HostSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="mt-4 h-5 w-1/3" />
      <Skeleton className="mt-8 h-[420px] w-full" />
    </div>
  );
}
