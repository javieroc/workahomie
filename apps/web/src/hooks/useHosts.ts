import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { Host, ListResponse, PaginationApiParams, PaginationParams } from 'src/types';

const getHosts = async (params: PaginationApiParams = {}): Promise<ListResponse<Host>> => {
  const { data } = await api.get<ListResponse<Host>>('/hosts', { params });
  return data;
};

const parsingAddress = (address: string) => {
  try {
    return JSON.parse(address);
  } catch (e) {
    return address;
  }
};

function useHosts(
  { pageIndex, pageSize }: PaginationParams,
  options?: UseQueryOptions<ListResponse<Host>, DefaultError, ListResponse<Host>>,
) {
  return useQuery<ListResponse<Host>>({
    queryKey: [QUERY_KEYS.HOSTS, pageIndex, pageSize],
    queryFn: () => getHosts({ offset: pageIndex * pageSize, limit: pageSize }),
    select: ({ data, total }: ListResponse<Host>) => ({
      total,
      data: data.map((host) => ({
        ...host,
        place: { ...host.place, addressObj: parsingAddress(host.place.address) },
      })),
    }),
    ...options,
  });
}

export { useHosts, parsingAddress };
