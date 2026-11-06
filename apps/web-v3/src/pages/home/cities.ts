// Cities used for the hero tour and quick links (matches the seeded data).
export const CITIES = [
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'London', country: 'United Kingdom', lat: 51.5072, lng: -0.1276 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', country: 'United States', lat: 40.7306, lng: -73.9352 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
] as const;

export type City = (typeof CITIES)[number];

export const exploreHref = (c: { lat: number; lng: number; name?: string }) =>
  `/explore?${new URLSearchParams({ lat: c.lat.toFixed(5), lng: c.lng.toFixed(5), ...(c.name ? { q: c.name } : {}) })}`;
