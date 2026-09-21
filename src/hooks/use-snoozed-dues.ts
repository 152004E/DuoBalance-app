import { useState, useEffect, useCallback } from 'react';
import { snoozeStorage } from '@/storage/token';
import type { SettlementDue } from './use-settlement-suggestions';

const SNOOZE_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 48 hours

interface SnoozeState {
  lastViewedAt: number;
  totalDueAmount: number;
}

export function useSnoozedDues(dues: SettlementDue[]) {
  const [snoozeState, setSnoozeState] = useState<SnoozeState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate current total due
  const currentTotalDue = dues.reduce((acc, due) => acc + Number(due.amount), 0);

  // Load from storage on mount
  useEffect(() => {
    snoozeStorage.get().then((data) => {
      if (data) {
        setSnoozeState(data);
      }
      setIsLoaded(true);
    });
  }, []);

  const markDuesAsViewed = useCallback(async () => {
    if (currentTotalDue === 0) return; // Don't snooze if there are no dues
    
    const newState: SnoozeState = {
      lastViewedAt: Date.now(),
      totalDueAmount: currentTotalDue,
    };
    setSnoozeState(newState);
    await snoozeStorage.set(newState);
  }, [currentTotalDue]);

  // Determine if dues should be counted in the badge
  let activeDuesCount = dues.length;

  if (isLoaded && snoozeState) {
    const timeSinceViewed = Date.now() - snoozeState.lastViewedAt;
    const isSnoozedTimeValid = timeSinceViewed < SNOOZE_DURATION_MS;
    const hasAmountIncreased = currentTotalDue > snoozeState.totalDueAmount;

    // If we are within 48h and the amount hasn't gone up, we hide them from the badge
    if (isSnoozedTimeValid && !hasAmountIncreased) {
      activeDuesCount = 0;
    }
  }

  return {
    activeDuesCount,
    markDuesAsViewed,
  };
}
