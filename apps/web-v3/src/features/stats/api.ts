import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { Stats } from '@/lib/types';

export function useStats() {
  return useQuery({
    queryKey: qk.stats,
    queryFn: async () => (await api.get<Stats>('/stats')).data,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
