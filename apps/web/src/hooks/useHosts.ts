import { DefaultError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import {
  FiltersParams,
  Host,
  ListResponse,
  PaginationApiParams,
  PaginationParams,
} from 'src/types';

const getHosts = async (
  params: PaginationApiParams & FiltersParams = {},
): Promise<ListResponse<Host>> => {
  const { data } = await api.get<ListResponse<Host>>('/hosts', { params });
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

function useHosts(
  { pageIndex, pageSize, ...filtersParams }: PaginationParams & FiltersParams,
  options?: UseQueryOptions<ListResponse<Host>, DefaultError, ListResponse<Host>>,
) {
  return useQuery<ListResponse<Host>>({
    queryKey: [QUERY_KEYS.HOSTS, pageIndex, pageSize, filtersParams],
    queryFn: () => {
      const offset = pageIndex * pageSize;
      return getHosts({ offset, limit: pageSize, ...filtersParams });
    },
    select: useCallback(({ data, total }: ListResponse<Host>) => {
      const transformedData = data.map((host) => ({
        ...host,
        ...(host.address ? { addressObj: parsingAddress(host.address) } : {}),
        ...(host.location
          ? {
              location: {
                type: host.location.type,
                coordinates: [...host.location.coordinates].reverse(),
              },
            }
          : {}),
      }));
      return { total, data: transformedData };
    }, []),
    ...options,
  });
}

export { useHosts, parsingAddress };
