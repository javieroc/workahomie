import type { GeoPoint, Host } from './types';

export interface ParsedAddress {
  label: string;
  short: string;
  lat?: number;
  lng?: number;
}

/** host.address is historically a JSON string from Nominatim/Photon; be forgiving. */
export function parseAddress(address?: string): ParsedAddress {
  if (!address) return { label: '', short: '' };
  try {
    const parsed = JSON.parse(address) as Record<string, unknown>;
    const label = String(
      parsed.display_name ?? parsed.label ?? parsed.address ?? parsed.name ?? '',
    );
    const lat = Number(parsed.lat);
    const lng = Number(parsed.lon ?? parsed.lng);
    return {
      label,
      short: shortLabel(label),
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined,
    };
  } catch {
    return { label: address, short: shortLabel(address) };
  }
}

/** "29 W Washington St, Dublin 2, Leinster, Ireland" -> "Dublin 2, Ireland" (privacy-friendly) */
export function shortLabel(label: string) {
  const parts = label
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 2) return parts.join(', ');
  return `${parts[parts.length - 3]}, ${parts[parts.length - 1]}`;
}

export const toLngLat = (point?: GeoPoint): [number, number] | undefined =>
  point && point.coordinates?.length === 2
    ? [point.coordinates[0], point.coordinates[1]]
    : undefined;

export function formatDistance(meters?: number) {
  if (meters == null || !Number.isFinite(meters)) return undefined;
  if (meters < 1000) return `${Math.max(50, Math.round(meters / 50) * 50)} m away`;
  return `${(meters / 1000).toFixed(meters < 10_000 ? 1 : 0)} km away`;
}

export function formatCoord(lat: number, lng: number) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${ns}  ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

/**
 * Deterministic offset (≈150–300 m) so the exact door isn't revealed on public maps.
 * Same host always gets the same offset.
 */
export function fuzzLocation([lng, lat]: [number, number], seed: string): [number, number] {
  let h = 0;
  // eslint-disable-next-line no-bitwise -- unsigned 32-bit string hash
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  const dist = 150 + (h % 150); // meters
  const dLat = (dist * Math.cos(angle)) / 111_320;
  const dLng = (dist * Math.sin(angle)) / (111_320 * Math.cos((lat * Math.PI) / 180));
  return [lng + dLng, lat + dLat];
}

export const hostName = (h: Pick<Host, 'firstName' | 'lastName'>) =>
  [h.firstName, h.lastName].filter(Boolean).join(' ');

export const hostCover = (h: Pick<Host, 'pictures' | 'profileImages'>) =>
  h.pictures?.[0] ?? h.profileImages?.[0];
