import { List, Map as MapIcon, SearchX, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HostCard, HostCardSkeleton } from '@/components/HostCard';
import { PlaceSearch } from '@/components/PlaceSearch';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/misc';
import { cn } from '@/lib/cn';
import type { BBox } from '@/lib/types';
import { useExploreStore } from '@/stores/explore';
import { ExploreMap } from './ExploreMap';
import { FiltersDialog } from './FiltersDialog';
import { useExploreHosts } from './useExploreHosts';
import { useExploreParams } from './useExploreParams';

const SEARCH_ON_MOVE_KEY = 'wah:search-on-move';

export default function ExplorePage() {
  const { params, update, activeFilterCount } = useExploreParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOnMove, setSearchOnMove] = useState(() => {
    try {
      return localStorage.getItem(SEARCH_ON_MOVE_KEY) !== '0';
    } catch {
      return true;
    }
  });
  const { hoveredId, setHovered, mobileView, setMobileView } = useExploreStore();

  useEffect(() => {
    document.title = params.q
      ? `Workspaces near ${params.q} · Workahomies`
      : 'Explore the map · Workahomies';
  }, [params.q]);

  // List = committed area (bbox) sorted by distance from its centre.
  const search = useMemo(() => {
    const { bbox } = params;
    const center = bbox
      ? { lat: (bbox.swLat + bbox.neLat) / 2, lng: (bbox.swLng + bbox.neLng) / 2 }
      : params.lat != null && params.lng != null
        ? { lat: params.lat, lng: params.lng }
        : {};
    const worldView = bbox && bbox.neLng - bbox.swLng > 90;
    return {
      ...(worldView
        ? {}
        : { ...center, bbox, ...(bbox ? {} : center.lat != null ? { radius: 25 } : {}) }),
      occupations: params.occupations,
      facilities: params.facilities,
      rate: params.rate,
    };
  }, [params]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useExploreHosts(search);
  const hosts = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const commitArea = useCallback((bbox: BBox) => update({ bbox }, { replace: true }), [update]);

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col lg:h-[calc(100dvh-72px)]">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-paper px-4 py-3 sm:px-6">
        <PlaceSearch
          key={params.q ?? 'none'}
          defaultValue={params.q ?? ''}
          className="min-w-[240px] flex-1 lg:max-w-md"
          onSelect={(p) => update({ lat: p.lat, lng: p.lng, q: p.name, bbox: undefined })}
        />
        <Button variant="outline" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="size-4" /> Filters
          {activeFilterCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-magenta text-[11px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => update({ occupations: [], facilities: [], rate: undefined })}
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="relative grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* list */}
        <section
          aria-label="Hosts list"
          className={cn(
            'min-h-0 overflow-y-auto px-4 pb-24 pt-5 sm:px-6 lg:pb-10',
            mobileView === 'map' && 'hidden lg:block',
          )}
        >
          <div className="flex items-baseline justify-between">
            <h1 className="font-sans text-[15px] font-medium text-ink-2">
              {isLoading
                ? 'Looking for desks…'
                : `${total} ${total === 1 ? 'workspace' : 'workspaces'}${params.q ? ` around ${params.q}` : ' in this area'}`}
            </h1>
          </div>

          {isError ? (
            <div className="mt-6">
              <EmptyState
                icon={<SearchX className="size-5" />}
                title="We couldn’t reach the server"
              >
                Check your connection and try again in a moment.
              </EmptyState>
            </div>
          ) : !isLoading && hosts.length === 0 ? (
            <div className="mt-6">
              <EmptyState icon={<SearchX className="size-5" />} title="No desks here yet">
                Zoom out, move the map or loosen your filters. Have a spare desk yourself? Become
                the first host in this area.
              </EmptyState>
            </div>
          ) : (
            <div
              className={cn(
                'mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 transition-opacity',
                isPlaceholderData && 'opacity-60',
              )}
            >
              {isLoading
                ? Array.from({ length: 6 }, (_, i) => <HostCardSkeleton key={i} />)
                : hosts.map((h) => (
                    <HostCard
                      key={h._id}
                      host={h}
                      active={hoveredId === h._id}
                      onHover={setHovered}
                    />
                  ))}
            </div>
          )}

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                loading={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                Show more
              </Button>
            </div>
          )}
        </section>

        {/* map */}
        <section
          aria-label="Map"
          className={cn(
            'min-h-0',
            mobileView === 'list' ? 'hidden lg:block' : 'absolute inset-0 lg:static',
          )}
        >
          <ExploreMap
            params={params}
            searchOnMove={searchOnMove}
            onSearchOnMoveChange={(v) => {
              setSearchOnMove(v);
              try {
                localStorage.setItem(SEARCH_ON_MOVE_KEY, v ? '1' : '0');
              } catch {
                /* ignore */
              }
            }}
            onCommitArea={commitArea}
          />
        </section>

        {/* mobile toggle, mirrors the Android app's floating "List" button */}
        <button
          type="button"
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper shadow-[var(--shadow-float)] lg:hidden"
        >
          {mobileView === 'list' ? (
            <>
              Map <MapIcon className="size-4" />
            </>
          ) : (
            <>
              List <List className="size-4" />
            </>
          )}
        </button>
      </div>

      <FiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={{
          occupations: params.occupations,
          facilities: params.facilities,
          rate: params.rate,
        }}
        onApply={(d) => update(d)}
      />
    </div>
  );
}
