import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from '@/services/api/expenses';
import type { GroupResponse } from '@/types/api';

export interface GroupSummary {
  count: number;
  total: number;
}

interface UseGroupSummariesReturn {
  summaries: Record<string, GroupSummary>;
  isLoading: boolean;
}

function getCurrentMonthRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

/**
 * Carga el resumen real (nº de gastos y total del mes) de cada grupo en paralelo.
 * Se re-ejecuta cuando cambia la lista de grupos (p.ej. tras refetch).
 */
export function useGroupSummaries(
  groups: GroupResponse[],
): UseGroupSummariesReturn {
  const [summaries, setSummaries] = useState<Record<string, GroupSummary>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadSummaries = useCallback(async () => {
    if (groups.length === 0) {
      setSummaries({});
      return;
    }

    setIsLoading(true);
    try {
      const { startDate, endDate } = getCurrentMonthRange();
      const results = await Promise.all(
        groups.map(async (group) => {
          try {
            const expenses = await getExpenses({
              groupId: group.id,
              startDate,
              endDate,
            });
            const total = expenses.reduce(
              (acc, e) => acc + Number(e.amount),
              0,
            );
            return { id: group.id, count: expenses.length, total };
          } catch {
            return { id: group.id, count: 0, total: 0 };
          }
        }),
      );

      const next: Record<string, GroupSummary> = {};
      for (const r of results) {
        next[r.id] = { count: r.count, total: r.total };
      }
      setSummaries(next);
    } finally {
      setIsLoading(false);
    }
  }, [groups]);

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  return { summaries, isLoading };
}
