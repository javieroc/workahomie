import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host } from 'src/types';

const getHosts = async () => {
  const { data } = await api.get<Host[]>('/hosts');
  return data;
};

function useHosts(options?: UseQueryOptions<Host[], DefaultError, Host[]>) {
  return useQuery<Host[]>({
    queryKey: [QUERY_KEYS.HOSTS],
    queryFn: getHosts,
    select: (data: Host[]) =>
      data.map((host) => ({
        ...host,
        place: { ...host.place, addressLabel: JSON.parse(host.place.address).label },
      })),
    ...options,
  });
}

export { useHosts };
