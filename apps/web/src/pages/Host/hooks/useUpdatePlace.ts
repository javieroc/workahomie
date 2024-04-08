import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { api } from 'src/api';
import { useNotification } from 'src/hooks/useNotification';
import { UpdateHostPlaceFormValues } from '../types';

const putHostPlace = async ({ address, ...rest }: UpdateHostPlaceFormValues): Promise<void> => {
  const { data } = await api.put<void>(
    `/hosts/me/place`,
    {
      address: JSON.stringify(address),
      ...rest,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

function useUpdatePlace(
  options: UseMutationOptions<void, unknown, UpdateHostPlaceFormValues, unknown> = {},
): UseMutationResult<void, unknown, UpdateHostPlaceFormValues, unknown> {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useMutation({
    mutationFn: (payload: UpdateHostPlaceFormValues) => putHostPlace(payload),
    onSuccess: () => {
      notification({
        title: 'Host Workspace',
        description: 'Workspace data was updated',
        status: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOSTS, 'me'] });
    },
    ...options,
  });
}

export { useUpdatePlace };
