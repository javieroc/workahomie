import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { api } from 'src/api';
import { Host } from 'src/types';
import { useNotification } from 'src/hooks/useNotification';
import { UpdateHostDto } from '../types';

const putHost = async ({ profile, ...rest }: UpdateHostDto): Promise<Host> => {
  const payload = Object.keys(rest).reduce((formData, key) => {
    const fieldData = rest[key as keyof Omit<UpdateHostDto, 'profile'>];
    if (fieldData) {
      formData.append(key, fieldData);
    }
    return formData;
  }, new FormData());

  if (profile) {
    payload.append('profile', profile);
  }

  const { data } = await api.putForm<Host>(`/hosts/me`, payload);
  return data;
};

function useUpdateProfile(
  options: UseMutationOptions<Host, unknown, UpdateHostDto, unknown> = {},
): UseMutationResult<Host, unknown, UpdateHostDto, unknown> {
  const queryClient = useQueryClient();
  const notification = useNotification();

  return useMutation({
    mutationFn: (payload: UpdateHostDto) => putHost(payload),
    onSuccess: () => {
      notification({
        title: 'Profile',
        description: 'Profile data was updated',
        status: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOSTS, 'me'] });
    },
    ...options,
  });
}

export { useUpdateProfile };
