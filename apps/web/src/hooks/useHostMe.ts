import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host } from 'src/types';

const getHostMe = async () => {
  const { data } = await api.get<Host>('/hosts/me');
  return data;
};

function useHostMe(options?: UseQueryOptions<Host, unknown, Host>) {
  return useQuery<Host>([QUERY_KEYS.HOSTS, 'me'], () => getHostMe(), {
    retry: 1,
    ...options,
  });
}

export { useHostMe };
