/**
 * Free geocoding without API keys.
 * - Photon (komoot) for search-as-you-type: built for autocomplete, OSM data.
 * - Nominatim for reverse geocoding (low volume: only when a host drops a pin).
 * Both have fair-use policies; requests are debounced and cached by TanStack Query.
 */
export interface Place {
  id: string;
  name: string;
  label: string;
  lat: number;
  lng: number;
  kind?: string;
  /** [minLng, minLat, maxLng, maxLat] when the place is an area */
  extent?: [number, number, number, number];
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id: number;
    osm_type: string;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    country?: string;
    type?: string;
    osm_value?: string;
    extent?: [number, number, number, number];
  };
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
  bias?: { lat: number; lng: number },
) {
  const params = new URLSearchParams({ q: query, limit: '6' });
  if (bias) {
    params.set('lat', String(bias.lat));
    params.set('lon', String(bias.lng));
  }
  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) throw new Error('Geocoding failed');
  const json = (await res.json()) as { features: PhotonFeature[] };
  return json.features.map((f): Place => {
    const p = f.properties;
    const street = [p.street, p.housenumber].filter(Boolean).join(' ');
    const name = p.name ?? street ?? p.city ?? '';
    const label = [
      name,
      p.name && street ? street : undefined,
      p.city !== name ? p.city : undefined,
      p.state,
      p.country,
    ]
      .filter(Boolean)
      .join(', ');
    return {
      id: `${p.osm_type}${p.osm_id}`,
      name: name || label,
      label,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      kind: p.osm_value ?? p.type,
      extent: p.extent,
    };
  });
}

export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    zoom: '18',
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { signal });
  if (!res.ok) throw new Error('Reverse geocoding failed');
  const json = (await res.json()) as { display_name?: string; lat: string; lon: string };
  return {
    display_name: json.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    lat: String(lat),
    lon: String(lng),
  };
}
