import { Smartphone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { env } from '@/lib/env';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-magenta text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
          See who’s working around the corner today.
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={env.apkUrl}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-7 font-semibold text-ink transition hover:-translate-y-0.5"
          >
            <Smartphone className="size-5 text-magenta" /> Get the Android app
          </a>
          <ButtonLink
            to="/explore"
            size="lg"
            className="bg-plum-900 text-white shadow-none hover:bg-plum-800"
          >
            Explore on the web
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
