import { getUserDisplayName } from '@/utils/user';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/services/api/expenses';
import { getPayments } from '@/services/api/payments';
import type { GroupResponse } from '@/types/api';
import type { WorkspaceState } from '@/features/workspace/workspace.types';
import type { DashboardViewMode } from '@/storage/preferences';
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
  hasAllTimeExpenses: boolean;
  viewMode: DashboardViewMode;
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
  viewMode: DashboardViewMode = 'monthly',
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
    queryKey: ['dashboard', targetGroupIds.join(','), viewMode],
    queryFn: async () => {
      const monthStart = getMonthStart().toISOString();

      // Consultar gastos según el modo seleccionado
      const expensePromises = targetGroupIds.map((groupId) =>
        getExpenses(
          viewMode === 'monthly'
            ? { groupId, startDate: monthStart }
            : { groupId },
        ),
      );
      const expenseResults = await Promise.all(expensePromises);
      const expenses = expenseResults.flat();

      // Consultar pagos del grupo
      const paymentPromises = targetGroupIds.map((groupId) =>
        getPayments(groupId),
      );
      const paymentResults = await Promise.all(paymentPromises);
      const payments = paymentResults.flat();

      // Si estamos en modo mensual y no hay gastos este mes, chequear si existen gastos históricos
      let hasAllTimeExpenses = expenses.length > 0;
      let allTimeExpenses = expenses;

      if (viewMode === 'monthly') {
        const allTimePromises = targetGroupIds.map((groupId) =>
          getExpenses({ groupId }),
        );
        const allTimeResults = await Promise.all(allTimePromises);
        allTimeExpenses = allTimeResults.flat();
        hasAllTimeExpenses = allTimeExpenses.length > 0;
      }

      return { expenses, payments, hasAllTimeExpenses, allTimeExpenses };
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

  const allTimeExpenses = useMemo(() => {
    const raw = data?.allTimeExpenses ?? [];
    if (isGlobalView) {
      return raw.filter((e) => !e.linkedExpenseId && !e.linkedPaymentId);
    }
    return raw;
  }, [data?.allTimeExpenses, isGlobalView]);

  const payments = data?.payments ?? [];
  const hasAllTimeExpenses = data?.hasAllTimeExpenses ?? false;

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

  const confirmedPayments = payments.filter((p) => p.status === 'CONFIRMED');

  const paymentsMade = confirmedPayments
    .filter((p) => p.fromUserId === userId)
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const paymentsReceived = confirmedPayments
    .filter((p) => p.toUserId === userId)
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const netBalance = totalPaidByMe - myShare - paymentsReceived + paymentsMade;
  const direction: BalanceDirection =
    netBalance > 0 ? 'OWED_TO_ME' : netBalance < 0 ? 'I_OWE' : 'SETTLED';

  // ── Transacciones recientes (últimas 5) ──────────────────────────────
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

  // Si hay gastos en el período activo, usamos esos; si no, mostramos los últimos históricos para no dejar la pantalla muerta
  const sourceExpensesForTransactions =
    expenses.length > 0 ? expenses : allTimeExpenses;

  const transactions: RecentExpense[] = sourceExpensesForTransactions
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

  // ── Top categoría ────────────────────────────────────────────────────
  const totalBalance = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

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
          totalBalance > 0
            ? Math.round((topEntry[1] / totalBalance) * 100)
            : 0,
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
    hasData: expenses.length > 0 || transactions.length > 0,
    hasAllTimeExpenses,
    viewMode,
    balance: totalBalance,
    partnerShare: Math.abs(netBalance),
    direction,
    transactions,
    topCategory,
    memberSplit,
    refetch,
  };
}
