import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Request } from 'src/types';
import { api } from 'src/api';
import { useAuth0 } from '@auth0/auth0-react';

const getRequest = async (id: string): Promise<Request> => {
  const { data } = await api.get<Request>(`/requests/${id}`);
  return data;
};

function useRequest(id: string, options?: UseQueryOptions<Request, DefaultError, Request>) {
  const { user } = useAuth0();
  return useQuery<Request>({
    queryKey: [QUERY_KEYS.REQUESTS, id],
    queryFn: () => getRequest(id),
    select: (request) => ({
      ...request,
      messages: request.messages.map((message) => ({
        ...message,
        isSender: message.userEmail === user?.email,
      })),
    }),
    ...options,
  });
}

export { useRequest };
