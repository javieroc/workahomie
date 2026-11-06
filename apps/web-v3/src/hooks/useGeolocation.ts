import { useCallback, useState } from 'react';

export type GeoState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'ok'; lat: number; lng: number }
  | { status: 'error'; message: string };

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: 'idle' });

  const locate = useCallback(
    () =>
      new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          setState({ status: 'error', message: 'Location is not available in this browser' });
          reject(new Error('unsupported'));
          return;
        }
        setState({ status: 'locating' });
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setState({ status: 'ok', ...coords });
            resolve(coords);
          },
          (err) => {
            const message =
              err.code === err.PERMISSION_DENIED
                ? 'Location permission denied'
                : 'Could not get your location';
            setState({ status: 'error', message });
            reject(err);
          },
          { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
        );
      }),
    [],
  );

  return { state, locate };
}
