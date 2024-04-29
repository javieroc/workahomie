import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host, ListResponse, PaginationApiParams, PaginationParams } from 'src/types';

const getHosts = async (params: PaginationApiParams = {}): Promise<ListResponse<Host>> => {
  const { data } = await api.get<ListResponse<Host>>('/hosts', { params });
  return data;
};

function useHosts(
  { pageIndex, pageSize }: PaginationParams,
  options?: UseQueryOptions<ListResponse<Host>, DefaultError, ListResponse<Host>>,
) {
  return useQuery<ListResponse<Host>>({
    queryKey: [QUERY_KEYS.HOSTS],
    queryFn: () => getHosts({ offset: pageIndex * pageSize, limit: pageSize }),
    select: ({ data, total }: ListResponse<Host>) => ({
      total,
      data: data.map((host) => ({
        ...host,
        place: { ...host.place, addressObj: JSON.parse(host.place.address) },
      })),
    }),
    ...options,
  });
}

export { useHosts };
