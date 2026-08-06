import axios from 'axios';

import { setupInterceptors } from './interceptor';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

setupInterceptors(api);

// ── DEBUG temporal: loguea TODAS las peticiones del API ───────────────
api.interceptors.request.use((config) => {
  console.log(
    `[API →] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`,
    { params: config.params, data: config.data },
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      `[API ←] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
      response.data,
    );
    return response;
  },
  (error) => {
    console.log(
      `[API ✗] ${error.response?.status ?? 'network'} ${error.config?.method?.toUpperCase() ?? ''} ${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
      {
        responseData: JSON.stringify(error.response?.data ?? null),
        headers: JSON.stringify(error.response?.headers ?? null),
        message: error.message,
      },
    );
    return Promise.reject(error);
  },
);
