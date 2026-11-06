import { format, isBefore, startOfToday } from 'date-fns';
import { CalendarDays, Lock } from 'lucide-react';
import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useSession } from '@/auth/useSession';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';
import { useSendRequest } from '@/features/requests/api';
import { apiErrorMessage } from '@/lib/api';
import type { Host } from '@/lib/types';
import { titleCase } from '@/lib/occupations';

export function RequestCard({ host }: { host: Host }) {
  const { isAuthenticated, userId, login } = useSession();
  const [range, setRange] = useState<DateRange | undefined>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sentId, setSentId] = useState<string | null>(null);
  const send = useSendRequest(host._id);
  const isOwn = Boolean(userId && host.userId === userId);

  if (isOwn) {
    return (
      <Card>
        <p className="font-display text-xl font-semibold">This is your place</p>
        <p className="mt-2 text-sm text-ink-2">This is how guests see your listing.</p>
        <ButtonLink to="/me/place" variant="ink" className="mt-5 w-full">
          Edit workspace
        </ButtonLink>
      </Card>
    );
  }

  if (sentId) {
    return (
      <Card>
        <p className="eyebrow text-moss">Request sent</p>
        <p className="mt-2 font-display text-xl font-semibold">
          {titleCase(host.firstName)} will get a notification.
        </p>
        <p className="mt-2 text-sm text-ink-2">
          You’ll be able to chat right away. Contact details unlock once the request is accepted.
        </p>
        <ButtonLink to={`/me/requests/${sentId}`} variant="ink" className="mt-5 w-full">
          Open the chat
        </ButtonLink>
      </Card>
    );
  }

  const label = range?.from
    ? `${format(range.from, 'EEE d MMM')}${range.to && +range.to !== +range.from ? ` → ${format(range.to, 'EEE d MMM')}` : ''}`
    : 'Choose your days';

  return (
    <Card>
      <p className="font-display text-2xl font-semibold">Ask to work here</p>
      <p className="mt-1 text-sm text-muted">Free · the host approves every visit</p>

      <button
        type="button"
        onClick={() => setPickerOpen((o) => !o)}
        aria-expanded={pickerOpen}
        className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-left transition hover:border-ink/30"
      >
        <CalendarDays className="size-5 text-magenta" />
        <span className={range?.from ? 'font-medium' : 'text-muted'}>{label}</span>
      </button>
      {pickerOpen && (
        <div className="mt-3 flex justify-center rounded-2xl border border-line bg-card p-2 [--rdp-accent-background-color:var(--color-magenta-100)] [--rdp-accent-color:var(--color-magenta)]">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={(d) => isBefore(d, startOfToday())}
            numberOfMonths={1}
            weekStartsOn={1}
          />
        </div>
      )}

      <Textarea
        className="mt-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={1000}
        placeholder={`Say hi to ${titleCase(host.firstName)} — what do you do, what do you need?`}
        aria-label="Message to the host"
      />

      {isAuthenticated ? (
        <Button
          className="mt-4 w-full"
          size="lg"
          disabled={!range?.from}
          loading={send.isPending}
          onClick={() => {
            if (!range?.from) return;
            const to = range.to ?? range.from;
            send.mutate(
              {
                checkIn: range.from.toISOString(),
                checkOut: to.toISOString(),
                message: message.trim() || undefined,
              },
              {
                onSuccess: (r) => {
                  setSentId(r._id);
                  toast.success('Request sent');
                },
                onError: (e) => toast.error(apiErrorMessage(e, 'Could not send the request')),
              },
            );
          }}
        >
          Send request
        </Button>
      ) : (
        <Button className="mt-4 w-full" size="lg" variant="ink" onClick={() => void login()}>
          Sign in to request
        </Button>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-muted">
        <Lock className="mt-0.5 size-3.5 shrink-0" /> The exact address and phone number are shared
        only after the host accepts.{' '}
        <Link to="/how-it-works" className="underline underline-offset-2">
          How it works
        </Link>
      </p>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-card)]">
      {children}
    </div>
  );
}
