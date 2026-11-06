import { ArrowRight, Smartphone } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PlaceSearch } from '@/components/PlaceSearch';
import { Navbar } from '@/components/layout/Navbar';
import { QrCode } from '@/components/QrCode';
import { env } from '@/lib/env';
import { formatCoord } from '@/lib/geo';
import { CITIES, exploreHref } from './cities';
import phoneMap from '@/assets/phone-map.webp';

const HeroBackdrop = lazy(() => import('./HeroBackdrop'));

const TOUR_MS = 9000;
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The hero *is* the product: a live map slowly touring cities with real host pins.
 * Non-interactive (so it never hijacks page scroll); search sends people to /explore.
 */
export function HeroMap() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const city = CITIES[i];

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % CITIES.length), TOUR_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-paper-2 lg:h-[min(92svh,900px)]">
      {/* live map */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Suspense fallback={<div className="contours size-full" />}>
          <HeroBackdrop city={city} />
        </Suspense>
      </div>
      {/* legibility washes: paper on the text side, soft vignette elsewhere */}
      <div className="hero-wash pointer-events-none absolute inset-0 -z-10" />

      <Navbar overlay />

      <div className="mx-auto grid h-full max-w-[1400px] items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[minmax(0,640px)_1fr] lg:pt-20">
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-2 animate-rise">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-magenta" />
            </span>
            Live · {city.name}
            <span className="text-muted" key={city.name}>
              {formatCoord(city.lat, city.lng)}
            </span>
          </p>

          <h1 className="mt-5 text-[clamp(2.6rem,6.4vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.03em] animate-rise [animation-delay:80ms]">
            Your next desk is
            <br />
            <span className="relative whitespace-nowrap text-magenta">
              around the corner
              <svg
                viewBox="0 0 300 14"
                className="absolute -bottom-2 left-0 w-full text-tangerine"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 10 C 60 2, 120 2, 160 7 S 260 13, 298 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="5 9"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-2 animate-rise [animation-delay:160ms]">
            Workahomies connects remote workers with neighbours who share a spare desk at home — for
            free. Swap the lonely kitchen table for a real colleague.
          </p>

          <div className="mt-8 max-w-[34rem] animate-rise [animation-delay:240ms]">
            <PlaceSearch
              size="lg"
              placeholder="Where do you want to work?"
              onSelect={(p) => navigate(exploreHref({ lat: p.lat, lng: p.lng, name: p.name }))}
            />
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Popular:</span>
              {CITIES.slice(0, 4).map((c) => (
                <Link
                  key={c.name}
                  to={exploreHref(c)}
                  className="rounded-full border border-line bg-card/80 px-3 py-1.5 text-ink-2 backdrop-blur transition hover:border-ink/30 hover:text-ink"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* app teaser floating over the map */}
        <div className="relative hidden h-full items-center justify-end lg:flex">
          <div className="relative mr-6 animate-rise [animation-delay:400ms]">
            <PhoneFrame
              src={phoneMap}
              alt="Workahomies Android app showing hosts on a map of Dublin"
              className="w-[270px] rotate-[4deg]"
            />
            <a
              href={env.apkUrl}
              className="absolute -left-36 bottom-16 flex w-64 items-center gap-4 rounded-3xl border border-line bg-card/95 p-4 shadow-[var(--shadow-float)] backdrop-blur transition hover:-translate-y-0.5"
            >
              <QrCode
                value={env.apkUrl}
                label="QR code to download the Android app"
                className="size-20 shrink-0 [&>svg]:size-full"
              />
              <span className="text-sm leading-snug">
                <span className="eyebrow block text-magenta-600">Android app</span>
                <span className="mt-1 block font-semibold">Scan to install</span>
                <span className="mt-0.5 flex items-center gap-1 text-muted">
                  or tap here <ArrowRight className="size-3.5" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* mobile app nudge */}
      <a
        href={env.apkUrl}
        className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-paper shadow-[var(--shadow-float)] lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Smartphone className="size-4 text-magenta" /> Get the Android app — it’s free
        </span>
        <ArrowRight className="size-4" />
      </a>
    </section>
  );
}

export function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[2.6rem] bg-plum-950 p-[10px] shadow-[0_40px_80px_-30px_rgb(22_10_30/0.7),inset_0_0_0_2px_rgb(255_255_255/0.08)] ${className ?? ''}`}
    >
      <div className="relative overflow-hidden rounded-[2.05rem] bg-black">
        <img
          src={src}
          alt={alt}
          className="block aspect-[9/19.5] w-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
