import { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}`;

const api = axios.create({
  baseURL,
});

api.defaults.headers.common['Content-Type'] = 'application/json';
api.defaults.headers.common.Accept = 'application/json';

type GetAccessTokenSilentlyFn = (options?: GetTokenSilentlyOptions) => Promise<string>;
type LogoutFn = () => void;

interface Auth0Error {
  error: string;
}

function isAuth0Error(error: unknown): error is Auth0Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as { error: unknown }).error === 'string'
  );
}

export const setupInterceptors = (
  getAccessTokenSilently: GetAccessTokenSilentlyFn,
  logout: LogoutFn,
) => {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        if (isAuth0Error(error) && error.error === 'login_required') {
          logout();
        }
        console.error('Error getting access token', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 404) {
        const mockResponse: AxiosResponse = {
          ...error.response!,
          status: 200,
          statusText: 'OK',
          data: null,
        };
        return Promise.resolve(mockResponse);
      }

      return Promise.reject(error);
    },
  );
};

export { api, baseURL };
