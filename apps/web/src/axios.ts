import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}`;

const api = axios.create({
  baseURL,
});

api.defaults.headers.common['Content-Type'] = 'application/json';
api.defaults.headers.common.Accept = 'application/json';

const setAuthHeader = (token: string): void => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const removeAuthHeader = (): void => {
  delete api.defaults.headers.common.Authorization;
};

export { api, baseURL, setAuthHeader, removeAuthHeader };
