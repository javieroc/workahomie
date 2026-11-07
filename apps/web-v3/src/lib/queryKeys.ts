export const qk = {
  hosts: (params: object) => ['hosts', 'list', params] as const,
  pins: (params: object) => ['hosts', 'pins', params] as const,
  host: (id: string) => ['hosts', 'detail', id] as const,
  hostMe: ['hosts', 'me'] as const,
  reviews: (hostId: string, page: number) => ['reviews', hostId, page] as const,
  reviewEligibility: (hostId: string) => ['reviews', hostId, 'eligibility'] as const,
  requests: (dir: 'incoming' | 'outgoing') => ['requests', dir] as const,
  request: (id: string) => ['requests', 'detail', id] as const,
  wishlistIds: ['wishlist', 'ids'] as const,
  wishlistFull: ['wishlist', 'full'] as const,
  stats: ['stats'] as const,
  places: (q: string) => ['places', q] as const,
};
