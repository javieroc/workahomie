import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { api } from 'src/api';
import { Request } from 'src/types';
import { CreateRequestDto } from '../types';

const sendHostRequest = async (hostId: string, payload: CreateRequestDto): Promise<Request> => {
  const { data } = await api.post<Request>(`/hosts/${hostId}/requests`, payload);
  return data;
};

function useSendRequest(
  hostId: string,
  options: UseMutationOptions<Request, unknown, CreateRequestDto, unknown> = {},
): UseMutationResult<Request, unknown, CreateRequestDto, unknown> {
  return useMutation({
    mutationFn: (payload: CreateRequestDto) => sendHostRequest(hostId, payload),
    ...options,
  });
}

export { useSendRequest };
