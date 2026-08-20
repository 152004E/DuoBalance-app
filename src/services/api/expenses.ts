import {
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseQueryParams,
  ExpenseResponse,
} from '@/types/api';
import { api } from './client';
import { appendSourceToFormData } from './upload';

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

export const uploadExpenseReceipt = async (
  id: string,
  source: { uri: string; name?: string; type?: string } | File,
): Promise<ExpenseResponse> => {
  const isFile = typeof File !== 'undefined' && source instanceof File;

  const formData = new FormData();

  if (isFile) {
    formData.append('file', source as File, (source as File).name);
  } else {
    await appendSourceToFormData(
      formData,
      'file',
      source as { uri: string; name?: string; type?: string },
      'receipt.jpg',
    );
  }

  const { data } = await api.post<ExpenseResponse>(
    `/expenses/${id}/receipt`,
    formData,
  );
  return data;
};

export const removeExpenseReceipt = async (
  id: string,
): Promise<ExpenseResponse> => {
  const { data } = await api.delete<ExpenseResponse>(`/expenses/${id}/receipt`);
  return data;
};
