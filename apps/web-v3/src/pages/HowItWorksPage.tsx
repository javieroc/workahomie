import {
  BadgeCheck,
  CalendarCheck2,
  Coffee,
  Lock,
  MessagesSquare,
  Search,
  Star,
  UserRoundPlus,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import banner from '@/assets/banner.webp';

const guest = [
  {
    icon: Search,
    title: 'Discover spaces nearby',
    text: 'Browse homes on the map and filter by profession, amenities like Wi-Fi, coffee or a garden, and rating.',
  },
  {
    icon: CalendarCheck2,
    title: 'Request your days',
    text: 'Pick a date range and introduce yourself. It’s free — hosts share their space to meet people, not to earn.',
  },
  {
    icon: MessagesSquare,
    title: 'Chat and confirm',
    text: 'Coordinate in the built-in chat. Once accepted you get the host’s contact and exact address.',
  },
  {
    icon: Coffee,
    title: 'Work, collaborate, review',
    text: 'Enjoy the change of scenery, then leave a review so the community stays trustworthy.',
  },
];
const host = [
  {
    icon: UserRoundPlus,
    title: 'Create a host profile',
    text: 'Tell guests what you do and what you’re into. A good photo goes a long way.',
  },
  {
    icon: Lock,
    title: 'Pin your workspace privately',
    text: 'Guests only see an approximate area until you accept their request.',
  },
  {
    icon: BadgeCheck,
    title: 'Approve who comes',
    text: 'Every request needs your yes. Chat first, decline anytime.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={banner}
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover object-[center_70%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-plum-950/85 via-plum-950/60 to-transparent" />
        <div className="mx-auto max-w-[1200px] px-4 py-28 text-paper sm:px-6 lg:py-40">
          <p className="eyebrow text-tangerine">How it works</p>
          <h1 className="mt-4 max-w-2xl text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            A community of desks, shared between neighbours.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-paper/75">
            Workahomies connects people who need a place to work with people who have one to share.
            No fees, no ads — just better workdays and new colleagues.
          </p>
        </div>
      </section>

      <Steps eyebrow="For guests" title="Find your next workspace" items={guest} />
      <div className="border-t border-line" />
      <Steps eyebrow="For hosts" title="Share your space, grow your circle" items={host} />

      <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
        <div className="grid gap-6 rounded-[2rem] bg-ink p-8 text-paper sm:p-12 md:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              t: 'Real profiles',
              d: 'Every account signs in with a verified identity provider.',
            },
            {
              icon: Star,
              t: 'Honest reviews',
              d: 'Only guests with an accepted visit can review a place.',
            },
            {
              icon: Lock,
              t: 'Privacy by default',
              d: 'Phone and exact address unlock only after a host says yes.',
            },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon className="size-6 text-magenta" />
              <p className="mt-3 font-display text-xl font-semibold">{t}</p>
              <p className="mt-1 text-paper/65">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/explore" size="lg">
            Explore the map
          </ButtonLink>
          <ButtonLink to="/become-a-host" size="lg" variant="outline">
            Become a host
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function Steps({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: { icon: typeof Search; title: string; text: string }[];
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
      <p className="eyebrow text-magenta-600">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(2rem,3.6vw,3rem)] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title: t, text }, i) => (
          <li key={t} className="rounded-3xl border border-line bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-magenta-100 text-magenta-600">
                <Icon className="size-5" />
              </span>
              <span className="font-mono text-sm text-muted">0{i + 1}</span>
            </div>
            <h3 className="mt-5 font-sans text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-ink-2">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
