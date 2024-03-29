import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { api } from 'src/api';
import { useNotification } from 'src/hooks/useNotification';
import { UpdateHostPlaceDto } from '../types';

const putHostPlace = async ({ pictures, ...rest }: UpdateHostPlaceDto): Promise<void> => {
  const payload = Object.keys(rest).reduce((formData, key) => {
    const fieldData = rest[key as keyof Omit<UpdateHostPlaceDto, 'pictures'>];
    if (fieldData) {
      if (Array.isArray(fieldData)) {
        fieldData.forEach((fieldDataElement) => {
          formData.append(key, fieldDataElement);
        });
      } else {
        formData.append(key, fieldData);
      }
    }
    return formData;
  }, new FormData());

  if (pictures) {
    pictures.forEach((picture) => {
      payload.append('pictures', picture);
    });
  }

  const { data } = await api.put<void>(`/hosts/me/place`, payload);
  return data;
};

function useUpdatePlace(
  options: UseMutationOptions<void, unknown, UpdateHostPlaceDto, unknown> = {},
): UseMutationResult<void, unknown, UpdateHostPlaceDto, unknown> {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useMutation({
    mutationFn: (payload: UpdateHostPlaceDto) => putHostPlace(payload),
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
