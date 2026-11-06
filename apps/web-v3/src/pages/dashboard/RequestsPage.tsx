import { Inbox } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useSession } from '@/auth/useSession';
import { ButtonLink } from '@/components/ui/Button';
import { Avatar, EmptyState, Skeleton } from '@/components/ui/misc';
import { useHostMe } from '@/features/hosts/api';
import { useRequests } from '@/features/requests/api';
import { cn } from '@/lib/cn';
import { hostName } from '@/lib/geo';
import { titleCase } from '@/lib/occupations';
import type { StayRequest } from '@/lib/types';
import { ChatPanel } from './ChatPanel';
import { StatusBadge, stayLabel } from './requestUi';

export default function RequestsPage() {
  const { requestId } = useParams();
  const { data: hostMe } = useHostMe();
  const [tab, setTab] = useState<'outgoing' | 'incoming'>(hostMe ? 'incoming' : 'outgoing');
  const activeTab = hostMe ? tab : 'outgoing';
  const { data, isLoading } = useRequests(activeTab);

  return (
    <div className="grid h-[calc(100dvh-280px)] min-h-[520px] overflow-hidden rounded-3xl border border-line bg-card lg:grid-cols-[360px_minmax(0,1fr)]">
      <div
        className={cn(
          'flex min-h-0 flex-col border-line lg:border-r',
          requestId && 'hidden lg:flex',
        )}
      >
        {hostMe && (
          <div className="grid grid-cols-2 gap-1 border-b border-line p-2">
            {(['incoming', 'outgoing'] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={activeTab === t}
                className={cn(
                  'rounded-full py-2 text-sm font-medium capitalize transition',
                  activeTab === t ? 'bg-ink text-paper' : 'text-muted hover:bg-ink/5',
                )}
              >
                {t === 'incoming' ? 'Guests for you' : 'Your trips'}
              </button>
            ))}
          </div>
        )}
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {isLoading &&
            Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="p-4">
                <Skeleton className="h-14" />
              </li>
            ))}
          {data?.data.map((r) => (
            <RequestRow
              key={r._id}
              r={r}
              incoming={activeTab === 'incoming'}
              active={r._id === requestId}
            />
          ))}
        </ul>
        {!isLoading && !data?.data.length && (
          <div className="p-6">
            <EmptyState
              icon={<Inbox className="size-5" />}
              title={activeTab === 'incoming' ? 'No guests yet' : 'No requests yet'}
            >
              {activeTab === 'incoming' ? (
                'When someone asks to work at your place, it shows up here.'
              ) : (
                <ButtonLink to="/explore" size="sm" variant="ink" className="mt-2">
                  Find a desk
                </ButtonLink>
              )}
            </EmptyState>
          </div>
        )}
      </div>
      <div className={cn('min-h-0', !requestId && 'hidden lg:block')}>
        {requestId ? (
          <ChatPanel key={requestId} requestId={requestId} />
        ) : (
          <div className="contours grid h-full place-items-center p-8 text-center text-muted">
            Pick a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}

function RequestRow({
  r,
  incoming,
  active,
}: {
  r: StayRequest;
  incoming: boolean;
  active: boolean;
}) {
  const { userId } = useSession();
  const name = incoming ? (r.userName ?? r.userEmail ?? 'Guest') : titleCase(hostName(r.host));
  const avatar = incoming ? r.userAvatar : r.host?.profileImages?.[0];
  const last = r.messages?.[r.messages.length - 1];
  return (
    <li>
      <Link
        to={`/me/requests/${r._id}`}
        className={cn(
          'flex gap-3 border-b border-line/60 px-4 py-4 transition hover:bg-paper',
          active && 'bg-paper',
        )}
      >
        <Avatar src={avatar} name={name} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold">{name}</p>
            <StatusBadge status={r.status} checkOut={r.checkOut} />
          </div>
          <p className="text-sm text-ink-2">{stayLabel(r)}</p>
          {last && (
            <p className="mt-0.5 truncate text-sm text-muted">
              {last.userId === userId ? 'You: ' : ''}
              {last.message}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
