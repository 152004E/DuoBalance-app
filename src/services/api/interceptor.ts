import { api } from './client';
import { tokenStorage } from '@/storage/token';

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