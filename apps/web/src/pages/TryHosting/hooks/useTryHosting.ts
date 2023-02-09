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
import { useNavigate } from 'react-router-dom';
import { CreateHostDto } from '../types';

const postHost = async ({ profile, ...rest }: CreateHostDto): Promise<Host> => {
  const payload = Object.keys(rest).reduce((formData, key) => {
    const fieldData = rest[key as keyof Omit<CreateHostDto, 'profile'>];
    if (fieldData) {
      formData.append(key, fieldData);
    }
    return formData;
  }, new FormData());

  if (profile) {
    payload.append('profile', profile);
  }

  const { data } = await api.post<Host>(`/hosts`, payload);
  return data;
};

function useTryHosting(
  options: UseMutationOptions<Host, unknown, CreateHostDto, unknown> = {}
): UseMutationResult<Host, unknown, CreateHostDto, unknown> {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const navigate = useNavigate();

  return useMutation((payload: CreateHostDto) => postHost(payload), {
    onSuccess: () => {
      notification({
        title: 'Congrats!',
        description: 'You are a host now!',
        status: 'success',
      });
      queryClient.invalidateQueries([QUERY_KEYS.HOSTS]);
      navigate('/profile', { replace: true });
    },
    ...options,
  });
}

export { useTryHosting };
