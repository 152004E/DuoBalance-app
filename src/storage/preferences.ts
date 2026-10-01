import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export type DashboardViewMode = 'monthly' | 'all_time';

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

export const dashboardViewModeStorage = createStorage<DashboardViewMode>(
  'duobalance_dashboard_view_mode',
);

export const monthlyNoticeStorage = createStorage<string>(
  'duobalance_last_seen_monthly_notice',
);
