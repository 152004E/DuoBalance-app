import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, approveExpense, rejectExpense } from '@/services/api/expenses';
import { ExpenseStatus } from '@/types/api';

export function usePendingExpenses(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['expenses', 'pending', userId],
    queryFn: () => getExpenses({ status: ExpenseStatus.PENDING, paidById: userId }),
    enabled: !!userId,
  });

  const approveMutation = useMutation({
    mutationFn: (expenseId: string) => approveExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (expenseId: string) => rejectExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  return {
    pendingExpenses: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    reject: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
  };
}
