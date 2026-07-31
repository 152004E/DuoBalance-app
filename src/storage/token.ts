import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

const KEYS = {
  ACCESS_TOKEN: 'duobalance_access_token',
  REFRESH_TOKEN: 'duobalance_refresh_token',
  USER: 'duobalance_user',
} as const;

function createStorage<T>(key: string) {
  return {
    async get(): Promise<T | null> {
      if (isWeb) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
      const data = await SecureStore.getItemAsync(key);
      return data ? JSON.parse(data) : null;
    },

    async set(value: T) {
      const data = JSON.stringify(value);
      if (isWeb) {
        localStorage.setItem(key, data);
        return;
      }
      return SecureStore.setItemAsync(key, data);
    },

    async remove() {
      if (isWeb) {
        localStorage.removeItem(key);
        return;
      }
      return SecureStore.deleteItemAsync(key);
    },
  };
}

export const tokenStorage = createStorage<string>(KEYS.ACCESS_TOKEN);

export const refreshTokenStorage = createStorage<string>(KEYS.REFRESH_TOKEN);

export const userStorage = createStorage<unknown>(KEYS.USER);
