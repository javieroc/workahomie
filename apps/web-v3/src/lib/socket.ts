import { io, type Socket } from 'socket.io-client';
import { env } from './env';

let socket: Socket | null = null;

/**
 * One shared connection. The token is resolved lazily on every (re)connect,
 * so expired access tokens are refreshed instead of failing forever.
 */
export function getSocket(getToken: () => Promise<string | undefined>) {
  if (socket) return socket;
  socket = io(env.apiUrl, {
    transports: ['websocket'],
    auth: (cb) => {
      getToken()
        .then((token) => cb({ token }))
        .catch(() => cb({}));
    },
    reconnectionAttempts: 8,
  });
  return socket;
}

export function closeSocket() {
  socket?.disconnect();
  socket = null;
}
