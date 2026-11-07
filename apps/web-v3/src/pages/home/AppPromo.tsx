import { BellRing, Download, Heart, Map, MessagesSquare } from 'lucide-react';
import { useRef } from 'react';
import { QrCode } from '@/components/QrCode';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { env } from '@/lib/env';
import phoneMap from '@/assets/phone-map.webp';
import phoneWelcome from '@/assets/phone-welcome.webp';
import phoneDetails from '@/assets/phone-details.webp';
import { PhoneFrame } from './HeroMap';

const features = [
  {
    icon: Map,
    title: 'A live map of hosts',
    text: 'See who’s sharing a desk near you, filtered by profession and amenities.',
  },
  {
    icon: MessagesSquare,
    title: 'Real-time chat',
    text: 'Agree on the day, the Wi-Fi password and how strong the coffee is.',
  },
  {
    icon: BellRing,
    title: 'Push notifications',
    text: 'Know the second a host accepts — or a guest knocks.',
  },
  { icon: Heart, title: 'Saved places', text: 'Keep a shortlist of favourite homes and hosts.' },
];

export function AppPromo() {
  const ref = useRef<HTMLElement>(null);
  const p = useScrollProgress(ref);
  const lerp = (from: number, to: number) => `translate3d(0, ${from + (to - from) * p}px, 0)`;

  return (
    <section
      ref={ref}
      id="app"
      className="contours-light relative overflow-hidden bg-plum-900 text-paper"
    >
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-magenta/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-52 -left-24 size-[520px] rounded-full bg-tangerine/15 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:py-32">
        <div>
          <p className="eyebrow text-tangerine">Workahomies for Android</p>
          <h2 className="mt-4 text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.025em]">
            The whole neighbourhood office,
            <span className="text-magenta"> in your pocket.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-paper/70">
            The app is the fastest way to find a desk today: open the map, tap a host, send a
            request, and chat — with notifications so you never miss a reply.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-paper/10 text-magenta ring-1 ring-paper/10">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-sm text-paper/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a
              href={env.apkUrl}
              className="group inline-flex h-16 items-center gap-4 rounded-2xl bg-paper pl-5 pr-7 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)] transition hover:-translate-y-0.5"
            >
              <AndroidGlyph className="size-8 text-moss" />
              <span className="leading-tight">
                <span className="block text-xs text-muted">Download for</span>
                <span className="block font-display text-xl font-semibold">Android</span>
              </span>
              <Download className="ml-2 size-5 text-magenta transition group-hover:translate-y-0.5" />
            </a>
            <div className="hidden items-center gap-4 rounded-2xl bg-paper/5 p-3 pr-5 ring-1 ring-paper/10 sm:flex">
              <div className="rounded-xl bg-paper p-2">
                <QrCode
                  value={env.apkUrl}
                  label="QR code to download the Android app"
                  className="size-[72px] [&>svg]:size-full"
                />
              </div>
              <p className="max-w-[10rem] text-sm text-paper/70">
                Point your phone’s camera here to install.
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-xs text-paper/40">
            Free · No ads · Direct APK from GitHub releases · Android 8+
          </p>
        </div>

        {/* fanned phones with scroll parallax */}
        <div
          className="relative mx-auto flex h-[560px] w-full max-w-[560px] items-center justify-center sm:h-[640px]"
          aria-hidden
        >
          <div
            style={{ transform: lerp(60, -40) }}
            className="absolute left-0 top-16 w-[44%] will-change-transform sm:left-2"
          >
            <PhoneFrame src={phoneMap} alt="" className="-rotate-[8deg]" />
          </div>
          <div
            style={{ transform: lerp(90, -20) }}
            className="absolute right-0 top-24 w-[44%] will-change-transform sm:right-2"
          >
            <PhoneFrame src={phoneDetails} alt="" className="rotate-[8deg]" />
          </div>
          <div
            style={{ transform: lerp(20, -60) }}
            className="relative z-10 w-[50%] will-change-transform"
          >
            <PhoneFrame src={phoneWelcome} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AndroidGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.87 3.23a11.5 11.5 0 0 0-9.82 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  );
}
