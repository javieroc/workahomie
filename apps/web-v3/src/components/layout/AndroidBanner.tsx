import { X } from 'lucide-react';
import { useState } from 'react';
import { env } from '@/lib/env';
import { isAndroid } from '@/hooks/usePlatform';

const KEY = 'wah:hide-app-banner';

/** Smart banner shown only on Android browsers. Dismissal remembered per device. */
export function AndroidBanner() {
  const [hidden, setHidden] = useState(() => {
    try {
      return !isAndroid() || localStorage.getItem(KEY) === '1';
    } catch {
      return !isAndroid();
    }
  });
  if (hidden) return null;
  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* private mode */
    }
  };
  return (
    <div className="flex items-center gap-3 bg-plum-900 px-4 py-2.5 text-paper">
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-paper/60">
        <X className="size-4" />
      </button>
      <div className="grid size-9 place-items-center rounded-xl bg-magenta font-display text-lg font-bold">
        W
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-sm font-semibold">Workahomies for Android</p>
        <p className="text-xs text-paper/60">Map, chat & push alerts — free</p>
      </div>
      <a
        href={env.apkUrl}
        className="rounded-full bg-paper px-4 py-1.5 text-sm font-semibold text-ink"
      >
        Get
      </a>
    </div>
  );
}
