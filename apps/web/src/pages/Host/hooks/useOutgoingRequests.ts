import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { ListResponse, PaginationApiParams, PaginationParams, Request } from 'src/types';

const getRequests = async (params: PaginationApiParams = {}): Promise<ListResponse<Request>> => {
  const { data } = await api.get<ListResponse<Request>>('/requests/outgoing', { params });
  return data;
};

function useOutgoingRequests(
  { pageIndex, pageSize }: PaginationParams,
  options?: Omit<
    UseQueryOptions<ListResponse<Request>, DefaultError, ListResponse<Request>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<ListResponse<Request>>({
    queryKey: [QUERY_KEYS.REQUESTS, 'OUTGOING', pageIndex, pageSize],
    queryFn: () => getRequests({ offset: pageIndex * pageSize, limit: pageSize }),
    ...options,
  });
}

export { useOutgoingRequests };
