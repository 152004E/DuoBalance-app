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
  history: PaymentResponse[];
  settlement: SettlementResponse | null;
  isLoading: boolean;
  refetch: () => Promise<boolean>;
}

/**
 * Carga los pagos y el settlement real del grupo.
 * - `pendingToConfirm`: pagos PENDING donde yo soy el receptor (solicitudes por confirmar).
 * - `history`: pagos CONFIRMED/REJECTED (historial de liquidaciones).
 * Se re-ejecuta cada vez que la pantalla recibe foco (useFocusEffect) y al llamar refetch.
 */
export function useGroupPayments({
  groupId,
  userId,
  enabled = true,
}: UseGroupPaymentsOptions): GroupPaymentsData {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const [paymentsData, settlementData] = await Promise.all([
        getPayments(groupId),
        getSettlement(groupId),
      ]);
      setPayments(paymentsData);
      setSettlement(settlementData);
      return true;
    } catch {
      setPayments([]);
      setSettlement(null);
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
    }, [enabled, load]),
  );

  const pendingToConfirm = payments.filter(
    (p) => p.status === 'PENDING' && p.toUserId === userId,
  );

  const history = payments.filter((p) => p.status !== 'PENDING');

  return {
    payments,
    pendingToConfirm,
    history,
    settlement,
    isLoading,
    refetch: load,
  };
}
