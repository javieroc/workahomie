import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host } from 'src/types';

const getHost = async (id: string): Promise<Host> => {
  const { data } = await api.get<Host>(`/hosts/${id}`);
  return data;
};

const parsingAddress = (address: string) => {
  try {
    return JSON.parse(address);
  } catch (e) {
    return address;
  }
};

function useHost(id: string, options?: UseQueryOptions<Host, DefaultError, Host>) {
  return useQuery<Host>({
    queryKey: [QUERY_KEYS.HOSTS, id],
    queryFn: () => getHost(id),
    select: (data) => ({
      ...data,
      place: { ...data.place, addressObj: parsingAddress(data.place.address) },
    }),
    ...options,
  });
}

export { useHost };
