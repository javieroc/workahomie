import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host } from 'src/types';
import { parsingAddress } from './useHosts';

const getHostMe = async () => {
  const { data } = await api.get<Host>('/hosts/me');
  return data;
};

function useHostMe(options?: UseQueryOptions<Host, DefaultError, Host>) {
  return useQuery<Host>({
    queryKey: [QUERY_KEYS.HOSTS, 'me'],
    queryFn: getHostMe,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data: Host) => ({
      ...data,
      place: {
        ...data.place,
        addressObj: parsingAddress(data.place.address),
      },
    }),
    ...options,
  });
}

export { useHostMe };
