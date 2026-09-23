import { BudgetPayload, BudgetResponse } from '@/types/api';
import { api } from './client';

export const getPersonalBudget = async (
  month: number,
  year: number,
): Promise<BudgetResponse> => {
  const { data } = await api.get<BudgetResponse>('/budget/personal', {
    params: { month, year },
  });
  return data;
};

export const setPersonalBudget = async (
  payload: BudgetPayload,
): Promise<BudgetResponse> => {
  const { data } = await api.post<BudgetResponse>('/budget/personal', payload);
  return data;
};
