import { getUserDisplayName } from '@/utils/user';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/services/api/expenses';
import type {
  ExpenseCategory,
  GroupResponse,
  ExpenseResponse,
} from '@/types/api';
import type { WorkspaceState } from '@/features/workspace/workspace.types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories';

export type ReportPeriod = 'Este mes' | 'Últimos 3 meses' | 'Este año' | 'Todo';

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export interface ReportsData {
  barData: BarDatum[];
  donutData: DonutDatum[];
  count: number;
  average: number;
  countComparison: number | null;
  averageComparison: number | null;
  isLoading: boolean;
  hasData: boolean;
  refetch: () => Promise<any>;
}

const MEMBER_COLORS = [
  '#10B981',
  '#8B5CF6',
  '#3B82F6',
  '#F97316',
  '#06B6D4',
  '#EC4899',
];

function monthStart(offset: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
}

function monthEnd(offset: number): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + offset + 1,
    0,
    23,
    59,
    59,
    999,
  );
}

function periodWindow(period: ReportPeriod): {
  start: Date | null;
  end: Date | null;
} {
  switch (period) {
    case 'Este mes':
      return { start: monthStart(0), end: monthEnd(0) };
    case 'Últimos 3 meses':
      return { start: monthStart(-2), end: monthEnd(0) };
    case 'Este año': {
      const now = new Date();
      return { start: new Date(now.getFullYear(), 0, 1), end: now };
    }
    case 'Todo':
      return { start: null, end: null };
  }
}

function previousWindow(period: ReportPeriod): {
  start: Date | null;
  end: Date | null;
} {
  switch (period) {
    case 'Este mes':
      return { start: monthStart(-1), end: monthEnd(-1) };
    case 'Últimos 3 meses':
      return { start: monthStart(-5), end: monthEnd(-3) };
    case 'Este año': {
      const now = new Date();
      return {
        start: new Date(now.getFullYear() - 1, 0, 1),
        end: new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        ),
      };
    }
    case 'Todo':
      return { start: null, end: null };
  }
}

export function useReportsData(
  workspace: WorkspaceState,
  groups: GroupResponse[],
  period: ReportPeriod,
  category?: ExpenseCategory | 'all',
): ReportsData {
  const targetGroupIds = useMemo(() => {
    if (workspace.groupId) return [workspace.groupId];
    if (workspace.category === 'personal') {
      return groups.filter((g) => g.type === 'PERSONAL').map((g) => g.id);
    }
    if (workspace.category === 'couple') {
      return groups.filter((g) => g.type === 'COUPLE').map((g) => g.id);
    }
    if (workspace.category === 'group') {
      return groups.filter((g) => g.type === 'GROUP').map((g) => g.id);
    }
    return groups.map((g) => g.id);
  }, [workspace.groupId, workspace.category, groups]);

  const groupIdsKey = targetGroupIds.join(',');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports-data', groupIdsKey, period, category],
    queryFn: async () => {
      const current = periodWindow(period);
      const previous = previousWindow(period);
      const categoryFilter = category && category !== 'all' ? { category } : {};
      const currentPromises = targetGroupIds.map((groupId) =>
        getExpenses({
          groupId,
          ...(current.start ? { startDate: current.start.toISOString() } : {}),
          ...(current.end ? { endDate: current.end.toISOString() } : {}),
          ...categoryFilter,
        }),
      );
      const previousPromises =
        period === 'Todo'
          ? []
          : targetGroupIds.map((groupId) =>
              getExpenses({
                groupId,
                ...(previous.start
                  ? { startDate: previous.start.toISOString() }
                  : {}),
                ...(previous.end
                  ? { endDate: previous.end.toISOString() }
                  : {}),
                ...categoryFilter,
              }),
            );

      const [currentResults, previousResults] = await Promise.all([
        Promise.all(currentPromises),
        Promise.all(previousPromises),
      ]);

      return {
        expenses: currentResults.flat(),
        lastMonthExpenses: previousResults.flat(),
      };
    },
    enabled: targetGroupIds.length > 0,
  });

  const expenses = data?.expenses ?? [];
  const lastMonthExpenses = data?.lastMonthExpenses ?? [];

  // ── Cálculos derivados ────────────────────────────────────────────────
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const count = expenses.length;
  const average = count > 0 ? Math.round(total / count) : 0;

  const lastMonthTotal = lastMonthExpenses.reduce(
    (acc, e) => acc + Number(e.amount),
    0,
  );

  const lastMonthCount = lastMonthExpenses.length;
  const hasComparison = period !== 'Todo';
  const countComparison = hasComparison
    ? lastMonthCount > 0
      ? Math.round(((count - lastMonthCount) / lastMonthCount) * 100)
      : count > 0
        ? 100
        : null
    : null;

  const lastMonthAverage =
    lastMonthCount > 0 ? Math.round(lastMonthTotal / lastMonthCount) : 0;
  const averageComparison = hasComparison
    ? lastMonthAverage > 0
      ? Math.round(((average - lastMonthAverage) / lastMonthAverage) * 100)
      : average > 0
        ? 100
        : null
    : null;

  const categoryTotals = new Map<string, number>();
  for (const e of expenses) {
    const cat = e.category;
    categoryTotals.set(cat, (categoryTotals.get(cat) ?? 0) + Number(e.amount));
  }
  const barData: BarDatum[] = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, value]) => ({
      label: CATEGORY_LABELS[category] ?? category,
      value,
      color: CATEGORY_COLORS[category] ?? '#94A3B8',
    }));

  const memberTotals = new Map<string, number>();
  for (const e of expenses) {
    const payerId = e.paidById;
    memberTotals.set(
      payerId,
      (memberTotals.get(payerId) ?? 0) + Number(e.amount),
    );
  }

  const memberNames = new Map<string, string>();
  for (const g of groups) {
    for (const m of g.members) {
      if (!memberNames.has(m.user.id)) {
        memberNames.set(m.user.id, getUserDisplayName(m.user));
      }
    }
  }

  const donutData: DonutDatum[] = Array.from(memberTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([userId, value], i) => ({
      label: memberNames.get(userId) ?? 'Miembro',
      value,
      color: MEMBER_COLORS[i % MEMBER_COLORS.length],
    }));

  return {
    barData,
    donutData,
    count,
    average,
    countComparison,
    averageComparison,
    isLoading,
    hasData: count > 0,
    refetch,
  };
}
