import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { Host, Paginated } from '@/lib/types';
import { useSession } from '@/auth/useSession';

export function useWishlistIds() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: qk.wishlistIds,
    queryFn: async () => (await api.get<string[]>('/wishlists')).data.map(String),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useWishlist() {
  return useQuery({
    queryKey: qk.wishlistFull,
    queryFn: async () =>
      (await api.get<Paginated<Host>>('/wishlists/full', { params: { limit: 50 } })).data,
  });
}

/** Optimistic toggle; rolls back on failure. */
export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ hostId, saved }: { hostId: string; saved: boolean }) => {
      if (saved) await api.delete('/wishlists/remove', { data: { hostId } });
      else await api.post('/wishlists/add', { hostId });
    },
    onMutate: async ({ hostId, saved }) => {
      await qc.cancelQueries({ queryKey: qk.wishlistIds });
      const previous = qc.getQueryData<string[]>(qk.wishlistIds);
      qc.setQueryData<string[]>(qk.wishlistIds, (ids = []) =>
        saved ? ids.filter((id) => id !== hostId) : [...ids, hostId],
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(qk.wishlistIds, ctx?.previous),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
