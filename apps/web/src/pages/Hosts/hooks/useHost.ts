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
    const parsed = JSON.parse(address);

    if (parsed.display_name) {
      return parsed;
    }

    return {
      ...parsed,
      display_name: parsed.address || parsed.name || '',
    };
  } catch {
    return { display_name: address };
  }
};

function useHost(id: string, options?: UseQueryOptions<Host, DefaultError, Host>) {
  return useQuery<Host>({
    queryKey: [QUERY_KEYS.HOSTS, id],
    queryFn: () => getHost(id),
    select: (data) => ({
      ...data,
      addressObj: parsingAddress(data.address),
    }),
    ...options,
  });
}

export { useHost };
