import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { Paginated, Review, ReviewEligibility } from '@/lib/types';
import { useSession } from '@/auth/useSession';

const PAGE = 6;

export function useReviews(hostId: string, page: number) {
  return useQuery({
    queryKey: qk.reviews(hostId, page),
    queryFn: async () =>
      (
        await api.get<Paginated<Review>>(`/hosts/${hostId}/reviews`, {
          params: { limit: PAGE, offset: page * PAGE },
        })
      ).data,
  });
}
useReviews.pageSize = PAGE;

export function useReviewEligibility(hostId: string) {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: qk.reviewEligibility(hostId),
    queryFn: async () =>
      (await api.get<ReviewEligibility>(`/hosts/${hostId}/reviews/eligibility`)).data,
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useCreateReview(hostId: string) {
  const qc = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: async (input: { rating: number; review: string }) =>
      (
        await api.post<Review>(`/hosts/${hostId}/reviews`, {
          ...input,
          userName: user?.name,
          userAvatar: user?.picture,
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reviews', hostId] });
      void qc.invalidateQueries({ queryKey: qk.host(hostId) });
    },
  });
}
