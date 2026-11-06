import { Heart, Home, MessagesSquare, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { useSession } from '@/auth/useSession';
import { useHostMe } from '@/features/hosts/api';
import { cn } from '@/lib/cn';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const { data: hostMe } = useHostMe();
  const tabs = [
    { to: '/me/requests', label: 'Requests & chat', icon: MessagesSquare },
    { to: '/me/saved', label: 'Saved', icon: Heart },
    { to: '/me/profile', label: hostMe ? 'Host profile' : 'Become a host', icon: UserRound },
    ...(hostMe ? [{ to: '/me/place', label: 'My workspace', icon: Home }] : []),
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-4 pb-20 pt-8 sm:px-6">
      <p className="eyebrow text-muted">Your space</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">
        Hi {user?.given_name ?? user?.name?.split(' ')[0] ?? 'there'}
      </h1>
      <nav
        className="-mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
        aria-label="Account"
      >
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'border-magenta text-ink'
                  : 'border-transparent text-muted hover:text-ink',
              )
            }
          >
            <Icon className="size-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="pt-8">{children}</div>
    </div>
  );
}
