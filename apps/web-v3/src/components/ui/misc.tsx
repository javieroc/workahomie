import { Star } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-ink/[0.06]', className)} />;
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'magenta' | 'tangerine' | 'moss' | 'danger';
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'bg-ink/[0.06] text-ink-2',
    magenta: 'bg-magenta-100 text-magenta-600',
    tangerine: 'bg-tangerine-100 text-[#a4521a]',
    moss: 'bg-moss/10 text-moss',
    danger: 'bg-danger/10 text-danger',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Rating({
  rate,
  count,
  className,
}: {
  rate: number;
  count: number;
  className?: string;
}) {
  if (!count) return <span className={cn('text-sm text-muted', className)}>New host</span>;
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-3.5 fill-tangerine text-tangerine" aria-hidden />
      <span className="font-semibold">{rate.toFixed(1)}</span>
      <span className="text-muted">({count})</span>
    </span>
  );
}

/** Image with a branded fallback (README TODO: "set fallback images everywhere"). */
export function Img({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn('contours grid place-items-center bg-paper-2 text-ink/40', className)}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-2xl font-semibold">
          {(fallbackLabel ?? alt).slice(0, 1).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  return (
    <Img
      src={src}
      alt={name}
      fallbackLabel={name}
      className={cn('size-10 shrink-0 rounded-full', className)}
    />
  );
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-paper-2 text-ink-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children && <div className="max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}
