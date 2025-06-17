import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';

const getWishlists = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>('/wishlists');
  return data;
};

function useWishlists(
  userId: string,
  options?: Partial<UseQueryOptions<string[], DefaultError, string[]>>,
) {
  return useQuery<string[]>({
    queryKey: [QUERY_KEYS.WISHLISTS, userId],
    queryFn: () => getWishlists(),
    ...options,
  });
}

export { useWishlists };
