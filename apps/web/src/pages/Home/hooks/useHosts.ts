import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from 'src/constants/queryKey';

function useHosts() {
  // options?: UseQueryOptions<Product, unknown, Product>
  // return useQuery<Product>([QUERY_KEYS.PRODUCTS, id], () => GlobalApi.getProduct(id), {
  //   select: (product) => ({
  //     ...product,
  //     iconUrl: product.iconUrl ?? defaultImage,
  //   }),
  //   ...options,
  // });
}

export { useHosts };
