import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { api } from 'src/api';
import { Request } from 'src/types';
import { useAuth0 } from '@auth0/auth0-react';
import { CreateRequestDto } from '../types';

const sendHostRequest = async (hostId: string, payload: CreateRequestDto): Promise<Request> => {
  const { data } = await api.post<Request>(`/hosts/${hostId}/requests`, payload);
  return data;
};

function useSendRequest(
  hostId: string,
  options: UseMutationOptions<Request, unknown, CreateRequestDto, unknown> = {},
): UseMutationResult<Request, unknown, CreateRequestDto, unknown> {
  const { user } = useAuth0();
  return useMutation({
    mutationFn: (payload: CreateRequestDto) =>
      sendHostRequest(hostId, {
        ...payload,
        userId: user?.sub?.split('|')[1],
        userAvatar: user?.picture,
        userEmail: user?.email,
        userName: user?.name,
      }),
    ...options,
  });
}

export { useSendRequest };
