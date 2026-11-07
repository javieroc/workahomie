import { Github, Smartphone } from 'lucide-react';
import { Link } from 'react-router';
import { env } from '@/lib/env';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="contours-light relative bg-plum-950 text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="text-3xl" />
          <p className="mt-4 max-w-xs text-paper/60">
            Free home workspaces, shared by neighbours. Fewer lonely laptops, more colleagues around
            the corner.
          </p>
          <a
            href={env.apkUrl}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 font-medium text-ink"
          >
            <Smartphone className="size-4" /> Download for Android
          </a>
        </div>
        <FooterCol
          title="Explore"
          links={[
            ['Map of hosts', '/explore'],
            ['How it works', '/how-it-works'],
          ]}
        />
        <FooterCol
          title="Hosting"
          links={[
            ['Become a host', '/become-a-host'],
            ['Your requests', '/me/requests'],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ['Saved places', '/me/saved'],
            ['Host profile', '/me/profile'],
          ]}
        />
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-paper/10 px-4 py-6 text-sm text-paper/50 sm:px-6">
        <p className="font-mono text-xs">
          Map data © OpenStreetMap contributors · Tiles by OpenFreeMap
        </p>
        <a
          href="https://javieroc.github.io/portfolio-astro/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-paper"
        >
          Crafted by Javier Ocampo <Github className="size-4" />
        </a>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow text-paper/40">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-paper/80 hover:text-paper">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
