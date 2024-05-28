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
  const payload = Object.keys(rest).reduce((formData, key) => {
    const fieldData =
      rest[key as keyof Omit<UpdateHostPlaceFormValues, 'address' | 'pictures' | 'facilities'>];
    if (fieldData) {
      formData.append(key, fieldData);
    }
    return formData;
  }, new FormData());

  if (address) {
    payload.append('address', JSON.stringify(address));
  }

  if (pictures?.length) {
    pictures.forEach((picture) => {
      payload.append('pictures', picture);
    });
  }

  if (facilities?.length) {
    facilities.forEach((facility) => {
      payload.append('facilities', facility);
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
