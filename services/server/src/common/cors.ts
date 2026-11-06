type OriginCallback = (err: Error | null, allow?: boolean) => void;

const normalize = (origin: string) => origin.trim().replace(/\/+$/, '');

/** Origins from the comma-separated CORS_ORIGINS env var, or null when unset (allow all). */
export function getAllowedOrigins(): string[] | null {
  const raw = process.env.CORS_ORIGINS;
  if (!raw || !raw.trim()) return null;
  return raw.split(',').map(normalize).filter(Boolean);
}

/**
 * Origin checker shared by HTTP and the socket.io gateway. It reads the env lazily so it works
 * even when evaluated before ConfigModule has loaded the .env file.
 */
export function corsOrigin(origin: string | undefined, callback: OriginCallback): void {
  const allowed = getAllowedOrigins();
  // Requests without Origin (server-to-server, native apps, curl) are not subject to CORS.
  if (!allowed || !origin) {
    callback(null, true);
    return;
  }
  callback(null, allowed.includes(normalize(origin)));
}
