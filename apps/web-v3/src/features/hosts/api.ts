import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, isNotFound } from '@/lib/api';
import { qk } from '@/lib/queryKeys';
import type { BBox, Host, HostPin, Paginated } from '@/lib/types';
import { useSession } from '@/auth/useSession';

export interface HostSearch {
  lat?: number;
  lng?: number;
  radius?: number;
  bbox?: BBox;
  occupations?: string[];
  facilities?: string[];
  rate?: number;
  limit?: number;
  offset?: number;
}

// Rounding keeps query keys stable while the map jitters by a few pixels.
const round = (n: number) => Math.round(n * 1e4) / 1e4;

/** Serialises filters to the query-string shape the API expects. */
export function toSearchParams({ bbox, occupations, facilities, ...rest }: HostSearch) {
  const params: Record<string, string | number> = {};
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null && !(typeof v === 'number' && Number.isNaN(v)))
      params[k] = v as number;
  });
  if (bbox) {
    params.swLat = round(bbox.swLat);
    params.swLng = round(bbox.swLng);
    params.neLat = round(bbox.neLat);
    params.neLng = round(bbox.neLng);
  }
  if (occupations?.length) params.occupations = occupations.join(',');
  if (facilities?.length) params.facilities = facilities.join(',');
  return params;
}

export function useHosts(search: HostSearch, enabled = true) {
  const { isAuthenticated } = useSession();
  const params = toSearchParams(search);
  return useQuery({
    queryKey: qk.hosts({ ...params, auth: isAuthenticated }),
    // Authenticated users hit /wishlisted so cards know whether they're saved.
    queryFn: async () =>
      (await api.get<Paginated<Host>>(isAuthenticated ? '/hosts/wishlisted' : '/hosts', { params }))
        .data,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useHostPins(search: HostSearch, enabled = true) {
  // pins are not paginated
  const params = toSearchParams({ ...search, limit: undefined, offset: undefined });
  return useQuery({
    queryKey: qk.pins(params),
    queryFn: async () => (await api.get<{ data: HostPin[] }>('/hosts/pins', { params })).data.data,
    placeholderData: keepPreviousData,
    enabled: enabled && Boolean(search.bbox),
    staleTime: 60_000,
  });
}

export function useHost(id: string | undefined) {
  return useQuery({
    queryKey: qk.host(id ?? ''),
    queryFn: async () => (await api.get<Host>(`/hosts/${id}`)).data,
    enabled: Boolean(id),
  });
}

/** null = signed in but not a host yet */
export function useHostMe() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: qk.hostMe,
    queryFn: async () => {
      try {
        return (await api.get<Host>('/hosts/me')).data;
      } catch (e) {
        if (isNotFound(e)) return null;
        throw e;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export interface ProfileInput {
  firstName: string;
  lastName: string;
  occupation: string;
  occupationDescription?: string;
  phone: string;
  aboutMe?: string;
  profile?: File | null;
}

const toFormData = (values: Record<string, unknown>) => {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => fd.append(k, item as string | Blob));
    else fd.append(k, v as string | Blob);
  });
  return fd;
};

export function useSaveProfile(mode: 'create' | 'update') {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProfileInput) => {
      const fd = toFormData({ ...input });
      const { data } =
        mode === 'create'
          ? await api.postForm<Host>('/hosts', fd)
          : await api.putForm<Host>('/hosts/me', fd);
      return data;
    },
    onSuccess: (host) => {
      qc.setQueryData(qk.hostMe, host);
      void qc.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
}

export interface PlaceInput {
  placeDescription: string;
  placeDetails?: string;
  facilities: string[];
  address: { display_name: string; lat: string; lon: string };
  existingPictures: string[];
  newPictures: File[];
}

export function useSavePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      address,
      existingPictures,
      newPictures,
      facilities,
      ...rest
    }: PlaceInput) => {
      const fd = toFormData({ ...rest });
      fd.append('address', JSON.stringify(address));
      // Always send arrays as JSON so a single value isn't mistaken for a string.
      fd.append('facilities', JSON.stringify(facilities));
      fd.append('existingPictures', JSON.stringify(existingPictures));
      newPictures.forEach((f) => fd.append('pictures', f));
      return (await api.putForm<Host>('/hosts/me/place', fd)).data;
    },
    onSuccess: (host) => {
      qc.setQueryData(qk.hostMe, host);
      void qc.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
}
