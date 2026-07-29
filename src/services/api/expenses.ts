import {
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseQueryParams,
  ExpenseResponse,
} from '@/types/api';
import { api } from './client';

export const createExpense = async (
  payload: CreateExpensePayload & { groupId?: string },
): Promise<ExpenseResponse> => {
  const { data } = await api.post<ExpenseResponse>('/expenses', payload);
  return data;
};

export const getExpenses = async (
  query?: ExpenseQueryParams & { groupId?: string },
): Promise<ExpenseResponse[]> => {
  const { data } = await api.get<ExpenseResponse[]>('/expenses', {
    params: query,
  });
  return data;
};

export const getExpense = async (id: string): Promise<ExpenseResponse> => {
  const { data } = await api.get<ExpenseResponse>(`/expenses/${id}`);
  return data;
};

export const updateExpense = async (
  id: string,
  payload: UpdateExpensePayload,
): Promise<ExpenseResponse> => {
  const { data } = await api.patch<ExpenseResponse>(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};
