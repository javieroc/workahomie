import { Heart, LogOut, Menu, MessagesSquare, Smartphone, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useSession } from '@/auth/useSession';
import { authConfigured } from '@/auth/AuthProvider';
import { cn } from '@/lib/cn';
import { env } from '@/lib/env';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/misc';
import { Button, ButtonLink } from '../ui/Button';
import { DonateButton } from './DonateButton';

const links = [
  { to: '/explore', label: 'Explore map' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/become-a-host', label: 'Become a host' },
];

export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const { isAuthenticated, user, login, logout } = useSession();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'z-40 w-full',
        overlay
          ? 'absolute inset-x-0 top-0 border-b border-line/50 bg-paper/70 backdrop-blur-md'
          : 'sticky top-0 border-b border-line/70 bg-paper/85 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:h-[72px]">
        <Link to="/" aria-label="Workahomies home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-[15px] text-ink-2 transition hover:bg-ink/5 hover:text-ink',
                  isActive && 'bg-ink/[0.06] text-ink',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href={env.apkUrl}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-magenta-600 hover:bg-magenta-100"
          >
            <Smartphone className="size-4" /> Get the app
          </a>
          <DonateButton />
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3 hover:shadow-[var(--shadow-card)]"
                aria-haspopup="menu"
                aria-expanded={menu}
              >
                <Avatar src={user?.picture} name={user?.name ?? 'You'} className="size-8" />
                <span className="max-w-[120px] truncate text-sm font-medium">
                  {user?.given_name ?? user?.name}
                </span>
              </button>
              {menu && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-3xl border border-line bg-card py-2 shadow-[var(--shadow-float)]"
                >
                  <MenuLink to="/me/requests" icon={<MessagesSquare className="size-4" />}>
                    Requests & chat
                  </MenuLink>
                  <MenuLink to="/me/saved" icon={<Heart className="size-4" />}>
                    Saved places
                  </MenuLink>
                  <MenuLink to="/me/profile" icon={<UserRound className="size-4" />}>
                    Host profile
                  </MenuLink>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void logout()}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-paper"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            authConfigured && (
              <Button variant="ink" size="sm" onClick={() => void login()}>
                Sign in
              </Button>
            )
          )}
        </div>

        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-full border border-line bg-card md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="border-b border-line/60 py-3.5 font-display text-xl"
              >
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <NavLink
                  to="/me/requests"
                  className="border-b border-line/60 py-3.5 font-display text-xl"
                >
                  Requests & chat
                </NavLink>
                <NavLink
                  to="/me/saved"
                  className="border-b border-line/60 py-3.5 font-display text-xl"
                >
                  Saved places
                </NavLink>
                <NavLink
                  to="/me/profile"
                  className="border-b border-line/60 py-3.5 font-display text-xl"
                >
                  Host profile
                </NavLink>
              </>
            )}
          </nav>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={env.apkUrl}
              className="flex h-11 items-center gap-2 rounded-full bg-magenta px-5 font-medium text-white"
            >
              <Smartphone className="size-4" /> Download for Android
            </a>
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => void logout()}>
                Sign out
              </Button>
            ) : (
              authConfigured && (
                <Button variant="ink" onClick={() => void login()}>
                  Sign in
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      role="menuitem"
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-paper"
    >
      {icon}
      {children}
    </Link>
  );
}

export { ButtonLink };
