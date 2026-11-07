import { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { FACILITIES } from '@/lib/types';
import { OCCUPATIONS, titleCase } from '@/lib/occupations';
import type { ExploreParams } from './useExploreParams';

type Draft = Pick<ExploreParams, 'occupations' | 'facilities' | 'rate'>;

export function FiltersDialog({
  open,
  onClose,
  value,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: Draft;
  onApply: (d: Draft) => void;
}) {
  const [draft, setDraft] = useState<Draft>(value);
  // Re-seed only when the dialog opens; the parent passes a fresh object on every render.
  useEffect(() => {
    if (open) setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (key: 'occupations' | 'facilities', item: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter((x) => x !== item) : [...d[key], item],
    }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Filters"
      side="right"
      className="w-[min(480px,100vw)]"
    >
      <div className="flex h-[calc(100dvh-150px)] flex-col">
        <div className="flex-1 space-y-8 overflow-y-auto pb-6">
          <section>
            <h3 className="font-sans text-sm font-semibold">Minimum rating</h3>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[undefined, 3, 4, 4.5].map((r) => (
                <Chip
                  key={r ?? 'any'}
                  active={draft.rate === r}
                  onClick={() => setDraft((d) => ({ ...d, rate: r }))}
                >
                  {r ? `${r}+ ★` : 'Any'}
                </Chip>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-sans text-sm font-semibold">Amenities</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {FACILITIES.map((f) => (
                <Chip
                  key={f}
                  active={draft.facilities.includes(f)}
                  onClick={() => toggle('facilities', f)}
                >
                  {titleCase(f)}
                </Chip>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-sans text-sm font-semibold">Host profession</h3>
            <p className="mt-1 text-sm text-muted">
              Work next to someone in your field — or deliberately not.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {OCCUPATIONS.map(({ name, icon: Icon }) => (
                <Chip
                  key={name}
                  active={draft.occupations.includes(name)}
                  onClick={() => toggle('occupations', name)}
                >
                  <Icon className="size-3.5" /> {titleCase(name)}
                </Chip>
              ))}
            </div>
          </section>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <Button
            variant="ghost"
            onClick={() => setDraft({ occupations: [], facilities: [], rate: undefined })}
          >
            Clear all
          </Button>
          <Button
            variant="ink"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Show hosts
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition',
        active ? 'border-ink bg-ink text-paper' : 'border-line bg-card hover:border-ink/40',
      )}
    >
      {children}
    </button>
  );
}
