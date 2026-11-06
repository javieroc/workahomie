import { ButtonLink } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <section className="contours grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-muted">404 · 0.0000° N 0.0000° E</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Off the map.</h1>
        <p className="mt-3 text-ink-2">This page doesn’t exist — but plenty of desks do.</p>
        <ButtonLink to="/explore" className="mt-8">
          Explore hosts
        </ButtonLink>
      </div>
    </section>
  );
}
