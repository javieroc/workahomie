import { useEffect, useState, type RefObject } from 'react';

/**
 * 0 when the element's top enters the viewport bottom, 1 when its bottom leaves the top.
 * rAF-throttled; returns 0.5 (neutral) for reduced-motion users.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0.5);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = window.innerHeight + r.height;
      setP(Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return p;
}
