import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host } from 'src/types';

const getHosts = async () => {
  const { data } = await api.get<Host[]>('/hosts');
  return data;
};

const parsingAddress = (address: string) => {
  try {
    return JSON.parse(address);
  } catch (e) {
    return address;
  }
};

function useHosts(options?: UseQueryOptions<Host[], DefaultError, Host[]>) {
  return useQuery<Host[]>({
    queryKey: [QUERY_KEYS.HOSTS],
    queryFn: getHosts,
    select: (data: Host[]) =>
      data.map((host) => ({
        ...host,
        place: { ...host.place, addressObj: parsingAddress(host.place.address) },
      })),
    ...options,
  });
}

export { useHosts };
