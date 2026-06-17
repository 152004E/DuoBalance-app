import type { AxiosInstance } from 'axios';

import { tokenStorage } from '@/storage/token';

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(
    async (config) => {
      const token = await tokenStorage.get();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized - token expired');
      }

      return Promise.reject(error);
    },
  );
}