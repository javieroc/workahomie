import axios, { AxiosError } from 'axios';
import { env } from './env';

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { Accept: 'application/json' },
});

type TokenGetter = () => Promise<string | undefined>;
let getToken: TokenGetter | null = null;

/** Registered by <AuthBridge/> once Auth0 resolves; anonymous requests skip the token entirely. */
export const setTokenGetter = (fn: TokenGetter | null) => {
  getToken = fn;
};

export const getAccessToken = () => getToken?.() ?? Promise.resolve(undefined);

api.interceptors.request.use(async (config) => {
  if (getToken) {
    try {
      const token = await getToken();
      // eslint-disable-next-line no-param-reassign -- axios interceptors mutate config by design
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // token refresh failed: send the request anonymously, the API decides
    }
  }
  return config;
});

export const isNotFound = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 404;

export const apiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (error instanceof AxiosError) {
    const msg = (error.response?.data as { message?: string | string[] } | undefined)?.message;
    if (Array.isArray(msg)) return msg[0] ?? fallback;
    if (msg) return msg;
  }
  return fallback;
};
