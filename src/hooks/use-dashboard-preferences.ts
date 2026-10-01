import { useState, useEffect, useCallback } from 'react';
import {
  dashboardViewModeStorage,
  monthlyNoticeStorage,
  type DashboardViewMode,
} from '@/storage/preferences';

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function useDashboardPreferences() {
  const [viewMode, setViewModeState] = useState<DashboardViewMode>('monthly');
  const [isNoticeDismissed, setIsNoticeDismissed] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const currentMonthKey = getCurrentMonthKey();

  useEffect(() => {
    let mounted = true;
    async function loadPreferences() {
      try {
        const storedMode = await dashboardViewModeStorage.get();
        const lastSeenMonth = await monthlyNoticeStorage.get();

        if (mounted) {
          if (storedMode === 'all_time' || storedMode === 'monthly') {
            setViewModeState(storedMode);
          }
          setIsNoticeDismissed(lastSeenMonth === currentMonthKey);
          setIsLoaded(true);
        }
      } catch {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    }

    loadPreferences();
    return () => {
      mounted = false;
    };
  }, [currentMonthKey]);

  const setViewMode = useCallback(async (mode: DashboardViewMode) => {
    setViewModeState(mode);
    await dashboardViewModeStorage.set(mode);
  }, []);

  const dismissNoticeForCurrentMonth = useCallback(async () => {
    setIsNoticeDismissed(true);
    await monthlyNoticeStorage.set(currentMonthKey);
  }, [currentMonthKey]);

  return {
    viewMode,
    setViewMode,
    isNoticeDismissed,
    dismissNoticeForCurrentMonth,
    isLoaded,
    currentMonthKey,
  };
}
