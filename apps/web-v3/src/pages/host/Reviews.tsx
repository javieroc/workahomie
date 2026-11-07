import { format } from 'date-fns';
import { MessageSquareQuote, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/auth/useSession';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Field';
import { Avatar, EmptyState, Skeleton } from '@/components/ui/misc';
import { useCreateReview, useReviewEligibility, useReviews } from '@/features/reviews/api';
import { apiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { Host } from '@/lib/types';

const reasonText = {
  own_place: 'You can’t review your own place.',
  no_visit: 'You can review after an accepted visit.',
  already_reviewed: 'Thanks — you already reviewed this place.',
} as const;

export function Reviews({ host }: { host: Host }) {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSession();
  const { data, isLoading } = useReviews(host._id, page);
  const { data: eligibility } = useReviewEligibility(host._id);
  const pages = Math.ceil((data?.total ?? 0) / useReviews.pageSize);

  return (
    <section aria-labelledby="reviews">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews" className="flex items-center gap-3 text-3xl font-semibold">
          <Star className="size-7 fill-tangerine text-tangerine" />
          {host.countReviews ? `${host.rate.toFixed(1)} · ${host.countReviews} reviews` : 'Reviews'}
        </h2>
        {isAuthenticated &&
          eligibility &&
          (eligibility.canReview ? (
            <Button variant="outline" onClick={() => setOpen(true)}>
              Write a review
            </Button>
          ) : (
            eligibility.reason && (
              <p className="text-sm text-muted">{reasonText[eligibility.reason]}</p>
            )
          ))}
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="mt-8">
          <EmptyState icon={<MessageSquareQuote className="size-5" />} title="No reviews yet">
            Guests can leave a review after an accepted visit.
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {data.data.map((r) => (
            <li key={r._id}>
              <div className="flex items-center gap-3">
                <Avatar src={r.userAvatar} name={r.userName} className="size-11" />
                <div>
                  <p className="font-semibold">{r.userName}</p>
                  <p className="text-sm text-muted">
                    {r.date ? format(new Date(r.date), 'MMMM yyyy') : ''}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5" aria-label={`${r.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn('size-3.5', i < r.rating ? 'fill-ink text-ink' : 'text-line')}
                  />
                ))}
              </div>
              <p className="mt-2 leading-relaxed text-ink-2">{r.review}</p>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Newer
          </Button>
          <span className="font-mono text-sm text-muted">
            {page + 1} / {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Older
          </Button>
        </div>
      )}

      <ReviewDialog hostId={host._id} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ReviewDialog({
  hostId,
  open,
  onClose,
}: {
  hostId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const create = useCreateReview(hostId);
  return (
    <Dialog open={open} onClose={onClose} title="How was your day there?">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} stars`}
            onClick={() => setRating(n)}
            className="p-1"
          >
            <Star
              className={cn(
                'size-8 transition',
                n <= rating ? 'fill-tangerine text-tangerine' : 'text-line hover:text-tangerine/60',
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        className="mt-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1500}
        placeholder="The space, the company, the coffee…"
        aria-label="Your review"
      />
      <Button
        className="mt-4 w-full"
        disabled={!rating || text.trim().length < 3}
        loading={create.isPending}
        onClick={() =>
          create.mutate(
            { rating, review: text.trim() },
            {
              onSuccess: () => {
                toast.success('Thanks for your review');
                setRating(0);
                setText('');
                onClose();
              },
              onError: (e) => toast.error(apiErrorMessage(e, 'Could not post the review')),
            },
          )
        }
      >
        Post review
      </Button>
    </Dialog>
  );
}
