import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getPayments, getSettlement } from '@/services/api/payments';
import type { PaymentResponse, SettlementResponse } from '@/types/api';

interface UseGroupPaymentsOptions {
  groupId: string;
  userId?: string;
  enabled?: boolean;
}

export interface GroupPaymentsData {
  payments: PaymentResponse[];
  pendingToConfirm: PaymentResponse[];
  sentPending: PaymentResponse[];
  history: PaymentResponse[];
  settlement: SettlementResponse | null; // Total settlement
  monthlySettlement: SettlementResponse | null; // Monthly settlement
  isLoading: boolean;
  refetch: () => Promise<boolean>;
}

export function useGroupPayments({
  groupId,
  userId,
  enabled = true,
}: UseGroupPaymentsOptions): GroupPaymentsData {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [monthlySettlement, setMonthlySettlement] = useState<SettlementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [paymentsData, totalSettlementData, monthlySettlementData] = await Promise.all([
        getPayments(groupId),
        getSettlement(groupId),
        getSettlement(groupId, currentMonth, currentYear),
      ]);
      
      setPayments(paymentsData);
      setSettlement(totalSettlementData);
      setMonthlySettlement(monthlySettlementData);
      return true;
    } catch {
      setPayments([]);
      setSettlement(null);
      setMonthlySettlement(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      if (enabled) {
        load();
      }
    }, [enabled, load])
  );

  const pendingToConfirm = payments.filter(
    (p) => p.status === 'PENDING' && p.toUserId === userId
  );

  const sentPending = payments.filter(
    (p) => p.status === 'PENDING' && p.fromUserId === userId
  );

  const history = payments.filter((p) => p.status !== 'PENDING');

  return {
    payments,
    pendingToConfirm,
    sentPending,
    history,
    settlement,
    monthlySettlement,
    isLoading,
    refetch: load,
  };
}
