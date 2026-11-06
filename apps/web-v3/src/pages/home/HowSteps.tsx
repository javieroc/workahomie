import { CalendarCheck2, Coffee, Search } from 'lucide-react';

const steps = [
  {
    icon: Search,
    coord: '01',
    title: 'Find a desk on the map',
    text: 'Search your area and filter by profession, amenities and rating. Every pin is a real person’s home.',
  },
  {
    icon: CalendarCheck2,
    coord: '02',
    title: 'Send a request',
    text: 'Pick your days and say hello. The host reviews your profile and replies in the chat.',
  },
  {
    icon: Coffee,
    coord: '03',
    title: 'Work, side by side',
    text: 'Show up, plug in, swap ideas. Leave a review afterwards so the next guest knows what to expect.',
  },
];

export function HowSteps() {
  return (
    <section className="contours relative">
      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-magenta-600">How it works</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Three stops between you and a better workday.
          </h2>
        </div>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* the "route" connecting the stops */}
          <svg
            className="absolute left-0 top-7 hidden h-8 w-full md:block"
            viewBox="0 0 1000 30"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M40 15 C 250 -5, 400 35, 520 15 S 800 -5, 960 15"
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity=".25"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
          </svg>
          {steps.map(({ icon: Icon, coord, title, text }) => (
            <li key={title} className="relative">
              <div className="relative z-10 flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-full bg-ink text-paper shadow-[var(--shadow-card)] ring-8 ring-paper">
                  <Icon className="size-6" />
                </span>
                <span className="font-mono text-sm text-muted">STOP {coord}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 max-w-sm text-ink-2">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
