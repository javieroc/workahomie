import { differenceInCalendarDays, format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/misc';
import type { RequestStatus, StayRequest } from '@/lib/types';

export function stayLabel(r: Pick<StayRequest, 'checkIn' | 'checkOut'>) {
  const a = new Date(r.checkIn);
  const b = new Date(r.checkOut);
  const days = differenceInCalendarDays(b, a) + 1;
  return days <= 1
    ? format(a, 'EEE d MMM')
    : `${format(a, 'd MMM')} – ${format(b, 'd MMM')} · ${days} days`;
}

export function StatusBadge({ status, checkOut }: { status: RequestStatus; checkOut?: string }) {
  if (checkOut && isPast(new Date(checkOut)) && status !== 'declined' && status !== 'cancelled')
    return <Badge>Past</Badge>;
  const tone = {
    pending: 'tangerine',
    accepted: 'moss',
    declined: 'danger',
    cancelled: 'neutral',
  } as const;
  return <Badge tone={tone[status] ?? 'neutral'}>{status}</Badge>;
}
