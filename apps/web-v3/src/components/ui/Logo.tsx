import { cn } from '@/lib/cn';

/** Wordmark echoing the Android app: the "H" wears a roof. */
export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'light' }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline font-display text-[22px] font-semibold tracking-tight',
        tone === 'light' ? 'text-paper' : 'text-ink',
        className,
      )}
    >
      Worka
      <span className="relative inline-block">
        <svg
          viewBox="0 0 24 10"
          className="absolute -top-[0.42em] left-1/2 h-[0.45em] w-[1.05em] -translate-x-1/2 text-magenta"
          aria-hidden
        >
          <path
            d="M2 9 12 2l10 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        H
      </span>
      omies
    </span>
  );
}
