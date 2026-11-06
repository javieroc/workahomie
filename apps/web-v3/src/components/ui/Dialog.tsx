import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Native <dialog>: focus trapping, Esc and top-layer for free. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
  side,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  side?: 'right' | 'bottom';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    // Backdrop click closes; keyboard users get Esc natively from <dialog>.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        'm-auto w-[min(560px,calc(100vw-24px))] rounded-3xl bg-card p-0 text-ink shadow-[var(--shadow-float)] backdrop:bg-plum-950/50 backdrop:backdrop-blur-sm',
        side === 'right' && 'mr-0 h-dvh max-h-dvh rounded-none sm:rounded-l-3xl',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-full hover:bg-ink/5"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
