import { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import axios, { InternalAxiosRequestConfig } from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}`;

const api = axios.create({
  baseURL,
});

api.defaults.headers.common['Content-Type'] = 'application/json';
api.defaults.headers.common.Accept = 'application/json';

type GetAccessTokenSilentlyFn = (options?: GetTokenSilentlyOptions) => Promise<string>;

export const setupInterceptors = (getAccessTokenSilently: GetAccessTokenSilentlyFn) => {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting access token', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

export { api, baseURL };
