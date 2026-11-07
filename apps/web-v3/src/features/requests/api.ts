import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { Paginated, RequestStatus, StayRequest } from '@/lib/types';
import { useSession } from '@/auth/useSession';

export function useRequests(direction: 'incoming' | 'outgoing', enabled = true) {
  return useQuery({
    queryKey: qk.requests(direction),
    queryFn: async () =>
      (await api.get<Paginated<StayRequest>>(`/requests/${direction}`, { params: { limit: 50 } }))
        .data,
    enabled,
  });
}

export function useRequest(id: string | undefined) {
  return useQuery({
    queryKey: qk.request(id ?? ''),
    queryFn: async () => (await api.get<StayRequest>(`/requests/${id}`)).data,
    enabled: Boolean(id),
  });
}

export interface SendRequestInput {
  checkIn: string;
  checkOut: string;
  message?: string;
}

export function useSendRequest(hostId: string) {
  const qc = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: async (input: SendRequestInput) =>
      (
        await api.post<StayRequest>(`/hosts/${hostId}/requests`, {
          ...input,
          // display-only fields; the API derives identity from the token
          userName: user?.name,
          userEmail: user?.email,
          userAvatar: user?.picture,
        })
      ).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}

export function useUpdateRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Exclude<RequestStatus, 'pending'>;
    }) => {
      await api.put(`/requests/${id}`, { status });
      return { id, status };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  });
}
