import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { ListResponse, PaginationApiParams, PaginationParams } from 'src/types';
import { Review } from '../types';

const getReviews = async (
  id: string,
  params: PaginationApiParams = {},
): Promise<ListResponse<Review>> => {
  const { data } = await api.get<ListResponse<Review>>(`/hosts/${id}/reviews`, { params });
  return data;
};

function useReviews(
  id: string,
  { pageIndex, pageSize }: PaginationParams,
  options?: UseQueryOptions<ListResponse<Review>, DefaultError, ListResponse<Review>>,
) {
  return useQuery<ListResponse<Review>>({
    queryKey: [QUERY_KEYS.HOSTS, pageIndex, pageSize],
    queryFn: () => getReviews(id, { offset: pageIndex * pageSize, limit: pageSize }),
    ...options,
  });
}

export { useReviews };
