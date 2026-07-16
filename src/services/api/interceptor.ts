import { router } from 'expo-router';
import type { AxiosInstance } from 'axios';

import { tokenStorage, userStorage } from '@/storage/token';

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
        await tokenStorage.remove();
        await userStorage.remove();
        router.replace('/login');
      }

      return Promise.reject(error);
    },
  );
}