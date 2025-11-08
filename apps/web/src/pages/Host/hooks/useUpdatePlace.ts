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

const putHostPlace = async ({
  address,
  pictures,
  facilities,
  ...rest
}: UpdateHostPlaceFormValues): Promise<void> => {
  const payload = new FormData();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload.append(key, value as any);
    }
  });

  if (address) {
    payload.append('address', JSON.stringify(address));
  }

  if (facilities?.length) {
    facilities.forEach((f) => payload.append('facilities', f));
  }

  if (pictures?.new?.length) {
    pictures.new.forEach((file) => payload.append('pictures', file));
  }

  if (pictures?.existing?.length) {
    pictures.existing.forEach((p) => {
      payload.append('existingPictures', p.url);
    });
  }

  const { data } = await api.putForm<void>(`/hosts/me/place`, payload);
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
