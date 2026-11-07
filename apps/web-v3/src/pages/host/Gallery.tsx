import { ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Img } from '@/components/ui/misc';
import { cn } from '@/lib/cn';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const shown = images.slice(0, 5);
  if (!images.length) return <Img alt={title} className="aspect-[21/9] w-full rounded-3xl" />;

  return (
    <>
      <div className="relative grid h-[260px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[420px]">
        {shown.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setOpen(i)}
            className={cn(
              'group relative overflow-hidden',
              i === 0 ? 'col-span-4 row-span-2 sm:col-span-2' : 'hidden sm:block',
              shown.length === 2 && i === 1 && 'col-span-2 row-span-2',
              shown.length === 3 && i > 0 && 'col-span-2',
            )}
          >
            <Img
              src={src}
              alt={`${title} — photo ${i + 1}`}
              className="size-full transition duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-[var(--shadow-card)]"
          >
            <Grid2x2 className="size-4" /> All {images.length} photos
          </button>
        )}
      </div>
      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        title={title}
        className="w-[min(1100px,calc(100vw-24px))]"
      >
        {open !== null && (
          <div className="relative">
            <Img
              src={images[open]}
              alt={`${title} — photo ${open + 1}`}
              className="max-h-[72vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setOpen((open - 1 + images.length) % images.length)}
                className="grid size-11 place-items-center rounded-full border border-line hover:bg-paper"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="font-mono text-sm text-muted">
                {open + 1} / {images.length}
              </span>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setOpen((open + 1) % images.length)}
                className="grid size-11 place-items-center rounded-full border border-line hover:bg-paper"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
