import { getUserDisplayName } from '@/utils/user';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/services/api/expenses';
import { getPayments } from '@/services/api/payments';
import type {
  GroupResponse,
  ExpenseResponse,
  PaymentResponse,
} from '@/types/api';
import type { WorkspaceState } from '@/features/workspace/workspace.types';
import {
  getCategoryMeta,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/constants/categories';
import { formatRelativeDate } from '@/utils/date';
import type { RecentExpense } from '@/components/expenses/recent-expenses-card';

export type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

export interface DashboardData {
  isLoading: boolean;
  hasData: boolean;
  balance: number;
  partnerShare: number;
  direction: BalanceDirection;
  transactions: RecentExpense[];
  topCategory: {
    category: string;
    amount: number;
    percentage: number;
    icon: string;
    color: string;
  } | null;
  memberSplit: {
    userName: string;
    partnerName: string;
    userAmount: number;
    partnerAmount: number;
  };
  refetch: () => Promise<any>;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function useDashboardData(
  workspace: WorkspaceState,
  groups: GroupResponse[],
  userId?: string,
): DashboardData {
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', targetGroupIds.join(',')],
    queryFn: async () => {
      const monthStart = getMonthStart().toISOString();
      const promises = targetGroupIds.map((groupId) =>
        getExpenses({ groupId, startDate: monthStart }),
      );
      const results = await Promise.all(promises);
      const expenses = results.flat();

      const paymentPromises = targetGroupIds.map((groupId) =>
        getPayments(groupId),
      );
      const paymentResults = await Promise.all(paymentPromises);
      const payments = paymentResults.flat();
      return { expenses, payments };
    },
    enabled: targetGroupIds.length > 0,
  });

  const isGlobalView = workspace.category === 'all' && !workspace.groupId;

  const expenses = useMemo(() => {
    const raw = data?.expenses ?? [];
    if (isGlobalView) {
      return raw.filter((e) => !e.linkedExpenseId && !e.linkedPaymentId);
    }
    return raw;
  }, [data?.expenses, isGlobalView]);
  const payments = data?.payments ?? [];

  // ── Balance neto del usuario ─────────────────────────────────────────
  const totalPaidByMe = expenses
    .filter((e) => e.paidById === userId)
    .reduce((acc, e) => acc + Number(e.amount), 0);

  const myShare = expenses.reduce((acc, e) => {
    if (e.splitType === 'PERSONAL') {
      return e.paidById === userId ? acc + Number(e.amount) : acc;
    }
    const mySplit = e.splits.find((s) => s.userId === userId);
    if (mySplit) {
      return acc + (Number(e.amount) * Number(mySplit.percentage)) / 100;
    }
    return acc + Number(e.amount) / Math.max(1, e.splits.length || 1);
  }, 0);

  const confirmedPayments = payments.filter(
    (p) => p.status === 'CONFIRMED',
  );

  const paymentsMade = confirmedPayments
    .filter((p) => p.fromUserId === userId)
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const paymentsReceived = confirmedPayments
    .filter((p) => p.toUserId === userId)
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const netBalance =
    totalPaidByMe - myShare - paymentsReceived + paymentsMade;
  const direction: BalanceDirection =
    netBalance > 0 ? 'OWED_TO_ME' : netBalance < 0 ? 'I_OWE' : 'SETTLED';

  // ── Transacciones del mes (últimas 5) ────────────────────────────────
  const memberNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const g of groups) {
      for (const m of g.members) {
        if (!names.has(m.user.id)) {
          names.set(m.user.id, getUserDisplayName(m.user));
        }
      }
    }
    return names;
  }, [groups]);

  const transactions: RecentExpense[] = expenses
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((e) => {
      const meta = getCategoryMeta(e.category);
      return {
        id: e.id,
        name: e.description,
        amount: Number(e.amount),
        paidBy: memberNames.get(e.paidById) ?? 'Miembro',
        date: formatRelativeDate(e.createdAt),
        category: CATEGORY_LABELS[e.category] ?? e.category,
        icon: meta.icon,
        iconBg: meta.color,
        originGroup: e.linkedExpense?.group || e.linkedPayment?.group || null,
      };
    });

  // ── Top categoría del mes ────────────────────────────────────────────
  const totalMonth = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  const categoryTotals = new Map<string, number>();
  for (const e of expenses) {
    categoryTotals.set(
      e.category,
      (categoryTotals.get(e.category) ?? 0) + Number(e.amount),
    );
  }

  const topEntry = Array.from(categoryTotals.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const topCategory = topEntry
    ? {
        category: CATEGORY_LABELS[topEntry[0]] ?? topEntry[0],
        amount: topEntry[1],
        percentage:
          totalMonth > 0 ? Math.round((topEntry[1] / totalMonth) * 100) : 0,
        icon: getCategoryMeta(topEntry[0]).icon,
        color: CATEGORY_COLORS[topEntry[0]] ?? '#64748B',
      }
    : null;

  // ── Aportes: yo vs el resto del workspace ────────────────────────────
  const paidByOthers = expenses
    .filter((e) => e.paidById !== userId)
    .reduce((acc, e) => acc + Number(e.amount), 0);

  const isCoupleMode = workspace.groupId
    ? groups.find((g) => g.id === workspace.groupId)?.type === 'COUPLE'
    : workspace.category === 'couple';

  const firstOtherId = expenses.find((e) => e.paidById !== userId)?.paidById;

  const partnerName = isCoupleMode
    ? (firstOtherId && memberNames.get(firstOtherId)) || 'Pareja'
    : 'El grupo';

  const memberSplit = {
    userName: 'Tú',
    partnerName,
    userAmount: totalPaidByMe,
    partnerAmount: paidByOthers,
  };

  return {
    isLoading,
    hasData: expenses.length > 0,
    balance: totalMonth,
    partnerShare: Math.abs(netBalance),
    direction,
    transactions,
    topCategory,
    memberSplit,
    refetch,
  };
}
