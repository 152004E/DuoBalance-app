import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPersonalBudget, setPersonalBudget } from '@/services/api/budget';
import { BudgetPayload } from '@/types/api';

export function useBudget(month: number, year: number, enabled: boolean = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['budget', month, year],
    queryFn: () => getPersonalBudget(month, year),
    enabled,
  });

  const mutation = useMutation({
    mutationFn: (payload: BudgetPayload) => setPersonalBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  return {
    budget: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    setBudget: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
