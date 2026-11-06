import { format, isSameDay } from 'date-fns';
import { ArrowLeft, Phone, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useSession } from '@/auth/useSession';
import { Button } from '@/components/ui/Button';
import { Avatar, Badge } from '@/components/ui/misc';
import { Spinner } from '@/components/ui/Spinner';
import { useChatRoom } from '@/features/chat/useChatRoom';
import { useRequest, useUpdateRequestStatus } from '@/features/requests/api';
import { apiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { hostName } from '@/lib/geo';
import { titleCase } from '@/lib/occupations';
import { StatusBadge, stayLabel } from './requestUi';

export function ChatPanel({ requestId }: { requestId: string }) {
  const { userId } = useSession();
  const { data: request, isLoading, isError } = useRequest(requestId);
  const { state, send } = useChatRoom(requestId);
  const update = useUpdateRequestStatus();
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [request?.messages.length]);

  if (isLoading)
    return (
      <div className="grid h-full place-items-center">
        <Spinner className="text-magenta" />
      </div>
    );
  if (isError || !request)
    return (
      <div className="grid h-full place-items-center p-8 text-muted">
        This conversation isn’t available.
      </div>
    );

  const amHost = request.host?.userId === userId;
  const other = amHost
    ? { name: request.userName ?? request.userEmail ?? 'Guest', avatar: request.userAvatar }
    : { name: titleCase(hostName(request.host)), avatar: request.host?.profileImages?.[0] };

  const setStatus = (status: 'accepted' | 'declined' | 'cancelled') =>
    update.mutate({ id: request._id, status }, { onError: (e) => toast.error(apiErrorMessage(e)) });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
        <Link
          to="/me/requests"
          className="grid size-9 place-items-center rounded-full hover:bg-ink/5 lg:hidden"
          aria-label="Back to requests"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <Avatar src={other.avatar} name={other.name} className="size-10" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{other.name}</p>
          <p className="truncate text-sm text-muted">
            {stayLabel(request)}
            {!amHost && request.host?.placeDescription ? ` · ${request.host.placeDescription}` : ''}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </header>

      {/* actions */}
      {request.status === 'pending' && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3 text-sm">
          {amHost ? (
            <>
              <span className="text-ink-2">
                Accept to share your phone number and exact address.
              </span>
              <span className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  loading={update.isPending && update.variables?.status === 'declined'}
                  onClick={() => setStatus('declined')}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  loading={update.isPending && update.variables?.status === 'accepted'}
                  onClick={() => setStatus('accepted')}
                >
                  Accept
                </Button>
              </span>
            </>
          ) : (
            <>
              <span className="text-ink-2">
                Waiting for {titleCase(request.host?.firstName)} to reply.
              </span>
              <Button size="sm" variant="ghost" onClick={() => setStatus('cancelled')}>
                Cancel request
              </Button>
            </>
          )}
        </div>
      )}
      {!amHost && request.status === 'accepted' && request.host?.phone && (
        <div className="flex items-center gap-3 border-b border-line bg-moss/5 px-5 py-3 text-sm">
          <Phone className="size-4 text-moss" />
          <span>
            Accepted! Reach {titleCase(request.host.firstName)} at{' '}
            <a
              className="font-medium underline"
              href={`https://wa.me/${request.host.phone.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              {request.host.phone}
            </a>
          </span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6" aria-live="polite">
        {request.messages.length === 0 && (
          <p className="text-center text-sm text-muted">No messages yet. Say hello 👋</p>
        )}
        <ol className="space-y-2">
          {request.messages.map((m, i) => {
            const mine = m.userId === userId;
            const prev = request.messages[i - 1];
            const t = m.timeSent ? new Date(m.timeSent) : undefined;
            const newDay = t && (!prev?.timeSent || !isSameDay(new Date(prev.timeSent), t));
            return (
              <li key={m._id ?? i}>
                {newDay && (
                  <p className="my-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
                    {format(t, 'EEE d MMM')}
                  </p>
                )}
                <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[78%] rounded-3xl px-4 py-2.5 text-[15px] leading-snug',
                      mine
                        ? 'rounded-br-md bg-ink text-paper'
                        : 'rounded-bl-md bg-paper-2 text-ink',
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.message}</p>
                    {t && (
                      <p
                        className={cn(
                          'mt-1 text-right text-[11px]',
                          mine ? 'text-paper/50' : 'text-muted',
                        )}
                      >
                        {format(t, 'HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div ref={endRef} />
      </div>

      <form
        className="flex items-end gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          send(text);
          setText('');
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder={
            state === 'denied' ? 'You can’t write in this conversation' : 'Write a message…'
          }
          disabled={state === 'denied'}
          aria-label="Message"
          className="max-h-40 min-h-11 flex-1 resize-none rounded-3xl border border-line bg-card px-4 py-2.5 focus:border-magenta focus:outline-none"
        />
        <Button
          type="submit"
          aria-label="Send"
          className="size-11 shrink-0 px-0"
          disabled={!text.trim() || state === 'denied'}
        >
          <Send className="size-4" />
        </Button>
      </form>
      {state === 'offline' && (
        <Badge tone="danger" className="m-3 self-center">
          Reconnecting…
        </Badge>
      )}
    </div>
  );
}
