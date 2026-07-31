import type { AxiosInstance, AxiosResponse } from 'axios';

import { tokenStorage, refreshTokenStorage } from '@/storage/token';
import { eventEmitter } from '@/utils/event-emitter';

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export function setupInterceptors(api: AxiosInstance) {
  let isRefreshing = false;
  let pendingRequests: ((token: string) => void)[] = [];

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
      if (error.response?.status !== 401 || !error.config) {
        return Promise.reject(error);
      }

      const url = error.config.url ?? '';
      if (AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
        return Promise.reject(error);
      }

      const storedRefreshToken = await refreshTokenStorage.get();

      if (!storedRefreshToken) {
        eventEmitter.emit('session:expired');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(error.config));
          });
        });
      }

      isRefreshing = true;

      try {
        const response: AxiosResponse<RefreshResponse> = await api.post(
          '/auth/refresh',
          { refreshToken: storedRefreshToken },
        );
        const { access_token, refresh_token } = response.data;

        await tokenStorage.set(access_token);
        await refreshTokenStorage.set(refresh_token);

        pendingRequests.forEach((cb) => cb(access_token));
        pendingRequests = [];

        error.config.headers.Authorization = `Bearer ${access_token}`;
        return api(error.config);
      } catch {
        pendingRequests = [];
        eventEmitter.emit('session:expired');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
