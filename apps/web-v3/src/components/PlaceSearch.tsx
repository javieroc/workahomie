import { useQuery } from '@tanstack/react-query';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { searchPlaces, type Place } from '@/lib/geocode';
import { qk } from '@/lib/queryKeys';
import { cn } from '@/lib/cn';
import { useDebounced } from '@/hooks/useDebounced';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Spinner } from './ui/Spinner';

interface Props {
  onSelect: (place: Place) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  defaultValue?: string;
  className?: string;
  /** Show "Use my current location" as first option */
  allowLocate?: boolean;
}

export function PlaceSearch({
  onSelect,
  placeholder = 'Search a city or neighbourhood',
  size = 'md',
  defaultValue = '',
  className,
  allowLocate = true,
}: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const debounced = useDebounced(query.trim(), 280);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { state: geo, locate } = useGeolocation();

  const { data: places = [], isFetching } = useQuery({
    queryKey: qk.places(debounced),
    queryFn: ({ signal }) => searchPlaces(debounced, signal),
    enabled: debounced.length >= 3,
    staleTime: 10 * 60_000,
  });

  const options: (Place | 'locate')[] = [
    ...(allowLocate ? (['locate'] as const) : []),
    ...(debounced.length >= 3 ? places : []),
  ];

  const choose = async (opt: Place | 'locate') => {
    setOpen(false);
    if (opt === 'locate') {
      try {
        const { lat, lng } = await locate();
        setQuery('Current location');
        onSelect({ id: 'me', name: 'Current location', label: 'Current location', lat, lng });
      } catch {
        toast.error('We couldn’t get your location. Try searching a city instead.');
      }
      return;
    }
    setQuery(opt.name);
    onSelect(opt);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[active] ?? places[0];
      if (opt) void choose(opt);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const lg = size === 'lg';

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-full border border-line bg-card pl-5 pr-2 shadow-[var(--shadow-card)] transition focus-within:border-magenta focus-within:ring-4 focus-within:ring-magenta/10',
          lg ? 'h-16' : 'h-12',
        )}
      >
        <Search className={cn('shrink-0 text-muted', lg ? 'size-5' : 'size-4')} aria-hidden />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={placeholder}
          aria-activedescendant={open ? `${listId}-${active}` : undefined}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(allowLocate ? 1 : 0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-ink placeholder:text-muted/80 focus:outline-none',
            lg ? 'text-lg' : 'text-[15px]',
          )}
        />
        {(isFetching || geo.status === 'locating') && <Spinner className="size-4 text-muted" />}
        <button
          type="button"
          onClick={() => {
            const first = places[0];
            if (first) void choose(first);
            else inputRef.current?.focus();
          }}
          className={cn(
            'grid shrink-0 place-items-center rounded-full bg-magenta text-white transition hover:bg-magenta-600',
            lg ? 'size-12' : 'size-9',
          )}
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </div>

      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-3xl border border-line bg-card py-2 shadow-[var(--shadow-float)]"
        >
          {options.map((opt, i) => (
            // Keyboard selection is handled by the combobox input (arrows + Enter).
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={opt === 'locate' ? 'locate' : opt.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => void choose(opt)}
              className={cn(
                'flex cursor-pointer items-center gap-3 px-4 py-2.5',
                i === active && 'bg-paper',
              )}
            >
              {opt === 'locate' ? (
                <>
                  <span className="grid size-9 place-items-center rounded-full bg-magenta-100 text-magenta-600">
                    <LocateFixed className="size-4" />
                  </span>
                  <span className="font-medium">Use my current location</span>
                </>
              ) : (
                <>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-2 text-ink-2">
                    <MapPin className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{opt.name}</span>
                    <span className="block truncate text-sm text-muted">{opt.label}</span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
