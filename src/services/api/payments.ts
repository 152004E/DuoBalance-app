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
  console.log('[payments] createPayment() payload:', payload);
  try {
    const { data } = await api.post<PaymentResponse>('/payments', payload);
    console.log('[payments] createPayment() respuesta:', data);
    return data;
  } catch (err: unknown) {
    console.log('[payments] createPayment() ERROR:', err);
    throw err;
  }
};

export const getPayments = async (
  groupId?: string,
): Promise<PaymentResponse[]> => {
  console.log('[payments] getPayments() groupId:', groupId);
  try {
    const { data } = await api.get<PaymentResponse[]>('/payments', {
      params: { groupId },
    });
    console.log('[payments] getPayments() respuesta (%d):', data.length, data);
    return data;
  } catch (err: unknown) {
    console.log('[payments] getPayments() ERROR:', err);
    throw err;
  }
};

export const getSettlement = async (
  groupId?: string,
): Promise<SettlementResponse> => {
  console.log('[payments] getSettlement() groupId:', groupId);
  try {
    const { data } = await api.get<SettlementResponse>('/settlements', {
      params: { groupId },
    });
    console.log('[payments] getSettlement() respuesta:', data);
    return data;
  } catch (err: unknown) {
    console.log('[payments] getSettlement() ERROR:', err);
    throw err;
  }
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

export const confirmPayment = async (
  paymentId: string,
): Promise<PaymentResponse> => {
  console.log('[payments] confirmPayment() paymentId:', paymentId);
  try {
    const { data } = await api.post<PaymentResponse>(
      `/payments/${paymentId}/confirm`,
    );
    console.log('[payments] confirmPayment() respuesta:', data);
    return data;
  } catch (err: unknown) {
    console.log('[payments] confirmPayment() ERROR:', err);
    throw err;
  }
};

export const rejectPayment = async (
  paymentId: string,
): Promise<PaymentResponse> => {
  console.log('[payments] rejectPayment() paymentId:', paymentId);
  try {
    const { data } = await api.post<PaymentResponse>(
      `/payments/${paymentId}/reject`,
    );
    console.log('[payments] rejectPayment() respuesta:', data);
    return data;
  } catch (err: unknown) {
    console.log('[payments] rejectPayment() ERROR:', err);
    throw err;
  }
};
