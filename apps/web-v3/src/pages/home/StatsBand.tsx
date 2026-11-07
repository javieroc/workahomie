import { useStats } from '@/features/stats/api';

const fmt = new Intl.NumberFormat('en', { notation: 'compact' });

export function StatsBand() {
  const { data } = useStats();
  // Only brag about numbers worth bragging about; fall back to product promises otherwise.
  const live = data
    ? [
        { value: fmt.format(data.hosts), label: 'homes open to work' },
        { value: fmt.format(data.cities), label: 'cities on the map' },
        { value: fmt.format(data.connections), label: 'visits arranged' },
        { value: fmt.format(data.reviews), label: 'reviews from guests' },
      ].filter((it) => it.value !== '0')
    : [];
  const items =
    live.length >= 2
      ? live
      : [
          { value: '€0', label: 'always free to use' },
          { value: '0', label: 'booking fees' },
          { value: '1:1', label: 'chat with every host' },
          { value: '★', label: 'reviews after each visit' },
        ];
  return (
    <section className="border-y border-line bg-card">
      <dl
        className={`mx-auto grid max-w-[1400px] grid-cols-2 divide-line px-4 sm:px-6 md:divide-x ${
          ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4'][items.length]
        }`}
      >
        {items.map((it) => (
          <div key={it.label} className="px-2 py-8 md:px-8">
            <dt className="sr-only">{it.label}</dt>
            <dd>
              <span className="block font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {it.value}
              </span>
              <span className="mt-1 block text-sm text-muted">{it.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
