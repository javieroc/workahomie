import { Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import hosting from '@/assets/hosting.webp';

export function HostCta() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6">
      <div className="grid overflow-hidden rounded-[2rem] bg-tangerine-100 md:grid-cols-2">
        <div className="p-8 sm:p-12 lg:p-16">
          <p className="eyebrow text-[#a4521a]">For hosts</p>
          <h2 className="mt-3 text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Got a spare desk? Get a colleague.
          </h2>
          <p className="mt-4 max-w-md text-ink-2">
            Hosting is free and fully on your terms: you choose who comes and when. Meet people from
            other fields without leaving home.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              'Approve every request yourself',
              'Chat before you say yes',
              'Your exact address stays private on the map',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-ink text-paper">
                  <Check className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <ButtonLink to="/become-a-host" variant="ink" size="lg" className="mt-8">
            Start hosting
          </ButtonLink>
        </div>
        <div className="relative min-h-72">
          <img
            src={hosting}
            alt="Two people chatting at a shared table"
            className="absolute inset-0 size-full object-contain p-6 mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
