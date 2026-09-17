import {
  CreatePaymentPayload,
  PaymentResponse,
  SettlementResponse,
  SettlementSuggestionsResponse,
} from '@/types/api';
import { api } from './client';

export const createPayment = async (
  payload: CreatePaymentPayload,
): Promise<PaymentResponse> => {
  const { data } = await api.post<PaymentResponse>('/payments', payload);
  return data;
};

export const getPayments = async (
  groupId?: string,
): Promise<PaymentResponse[]> => {
  const { data } = await api.get<PaymentResponse[]>('/payments', {
    params: { groupId },
  });
  return data;
};

export const getSettlement = async (
  groupId?: string,
  month?: number,
  year?: number,
): Promise<SettlementResponse> => {
  const { data } = await api.get<SettlementResponse>('/settlements', {
    params: { groupId, month, year },
  });
  return data;
};

export const getSettlementSuggestions = async (
  groupId?: string,
  month?: number,
  year?: number,
): Promise<SettlementSuggestionsResponse> => {
  const { data } = await api.get<SettlementSuggestionsResponse>(
    '/settlements/suggestions',
    { params: { groupId, month, year } },
  );
  return data;
};

export const remindDebt = async (
  debtorId: string,
  type: 'MONTHLY' | 'TOTAL',
  groupId?: string,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    `/settlements/remind/${debtorId}`,
    { type },
    { params: { groupId } }
  );
  return data;
};

export const confirmPayment = async (
  paymentId: string,
): Promise<PaymentResponse> => {
  const { data } = await api.post<PaymentResponse>(
    `/payments/${paymentId}/confirm`,
  );
  return data;
};

export const rejectPayment = async (
  paymentId: string,
): Promise<PaymentResponse> => {
  const { data } = await api.post<PaymentResponse>(
    `/payments/${paymentId}/reject`,
  );
  return data;
};
