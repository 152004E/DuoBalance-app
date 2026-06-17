import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'duobalance_access_token',
  USER: 'duobalance_user',
} as const;

export const tokenStorage = {
  async get() {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },

  async set(token: string) {
    return SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
  },

  async remove() {
    return SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  },
};

export const userStorage = {
  async get() {
    const data = await SecureStore.getItemAsync(KEYS.USER);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  },

  async set(user: unknown) {
    return SecureStore.setItemAsync(
      KEYS.USER,
      JSON.stringify(user),
    );
  },

  async remove() {
    return SecureStore.deleteItemAsync(KEYS.USER);
  },
};