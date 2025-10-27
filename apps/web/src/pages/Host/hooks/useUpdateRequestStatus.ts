import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { useNotification } from 'src/hooks';
import { Request } from 'src/types';

interface UpdateRequestStatusDto {
  status: 'accepted' | 'declined';
}

const updateRequestStatus = async (
  requestId: string,
  payload: UpdateRequestStatusDto,
): Promise<Request> => {
  const { data } = await api.put<Request>(`/requests/${requestId}`, payload);
  return data;
};

function useUpdateRequestStatus(
  requestId: string,
  options: UseMutationOptions<Request, unknown, UpdateRequestStatusDto, unknown> = {},
): UseMutationResult<Request, unknown, UpdateRequestStatusDto, unknown> {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useMutation({
    mutationFn: (payload: UpdateRequestStatusDto) => updateRequestStatus(requestId, payload),
    onSuccess: () => {
      notification({
        title: 'Request status updated',
        status: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REQUESTS] });
    },
    ...options,
  });
}

export { useUpdateRequestStatus };
