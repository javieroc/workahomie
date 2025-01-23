import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { ListResponse, PaginationApiParams, PaginationParams } from 'src/types';
import { Request } from '../types';

const getRequests = async (params: PaginationApiParams = {}): Promise<ListResponse<Request>> => {
  const { data } = await api.get<ListResponse<Request>>('/requests', { params });
  return data;
};

function useIncomingRequests(
  { pageIndex, pageSize }: PaginationParams,
  options?: UseQueryOptions<ListResponse<Request>, DefaultError, ListResponse<Request>>,
) {
  return useQuery<ListResponse<Request>>({
    queryKey: [QUERY_KEYS.REQUESTS, 'INCOMING', pageIndex, pageSize],
    queryFn: () => getRequests({ offset: pageIndex * pageSize, limit: pageSize }),
    ...options,
  });
}

export { useIncomingRequests };
