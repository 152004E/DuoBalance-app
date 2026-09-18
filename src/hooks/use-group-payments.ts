import { useQuery } from '@tanstack/react-query';
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
  refetch: () => Promise<any>;
}

export function useGroupPayments({
  groupId,
  userId,
  enabled = true,
}: UseGroupPaymentsOptions): GroupPaymentsData {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['group-payments', groupId],
    queryFn: async () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [paymentsData, totalSettlementData, monthlySettlementData] = await Promise.all([
        getPayments(groupId),
        getSettlement(groupId),
        getSettlement(groupId, currentMonth, currentYear),
      ]);
      
      return {
        payments: paymentsData,
        settlement: totalSettlementData,
        monthlySettlement: monthlySettlementData,
      };
    },
    enabled: enabled && !!groupId,
  });

  const payments = data?.payments ?? [];
  const settlement = data?.settlement ?? null;
  const monthlySettlement = data?.monthlySettlement ?? null;

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
    refetch,
  };
}
