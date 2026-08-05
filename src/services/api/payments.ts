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
): Promise<SettlementResponse> => {
  const { data } = await api.get<SettlementResponse>('/settlements', {
    params: { groupId },
  });
  return data;
};

export const getSettlementSuggestions = async (
  groupId?: string,
): Promise<SettlementSuggestionsResponse> => {
  const { data } = await api.get<SettlementSuggestionsResponse>(
    '/settlements/suggestions',
    { params: { groupId } },
  );
  return data;
};
