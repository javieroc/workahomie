import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toSearchParams, type HostSearch } from '@/features/hosts/api';
import type { Host, Paginated } from '@/lib/types';
import { useSession } from '@/auth/useSession';

const PAGE = 18;

export function useExploreHosts(search: HostSearch) {
  const { isAuthenticated } = useSession();
  const params = toSearchParams(search);
  return useInfiniteQuery({
    queryKey: ['hosts', 'explore', params, isAuthenticated],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      (
        await api.get<Paginated<Host>>(isAuthenticated ? '/hosts/wishlisted' : '/hosts', {
          params: { ...params, limit: PAGE, offset: pageParam },
        })
      ).data,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, p) => n + p.data.length, 0);
      return loaded < last.total && last.data.length > 0 ? loaded : undefined;
    },
    placeholderData: keepPreviousData,
  });
}
