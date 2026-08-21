import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getPayments } from '@/services/api/payments';
import type { GroupResponse, PaymentResponse } from '@/types/api';
import type { WorkspaceState } from '@/features/workspace/workspace.types';

export interface PendingIncomingPayment {
  groupId: string;
  groupName: string;
  fromUserId: string;
  fromFirstName: string;
  fromLastName: string;
  amount: number;
}

interface UsePendingIncomingPaymentsOptions {
  workspace: WorkspaceState;
  groups: GroupResponse[];
  userId?: string;
  enabled?: boolean;
}

/**
 * Carga los pagos pendientes que otros usuarios me enviaron (pendingToConfirm)
 * para todos los grupos del workspace.
 * Se re-ejecuta al cambiar de workspace/grupos y al enfocar la pantalla.
 */
export function usePendingIncomingPayments({
  workspace,
  groups,
  userId,
  enabled = true,
}: UsePendingIncomingPaymentsOptions) {
  const [incomingPayments, setIncomingPayments] = useState<
    PendingIncomingPayment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const targetGroupIds = useMemo(() => {
    if (workspace.groupId) return [workspace.groupId];
    if (workspace.category === 'personal') {
      return groups.filter((g) => g.type === 'PERSONAL').map((g) => g.id);
    }
    if (workspace.category === 'couple') {
      return groups.filter((g) => g.type === 'COUPLE').map((g) => g.id);
    }
    if (workspace.category === 'group') {
      return groups.filter((g) => g.type === 'GROUP').map((g) => g.id);
    }
    return groups.map((g) => g.id);
  }, [workspace.groupId, workspace.category, groups]);

  const groupIdsKey = targetGroupIds.join(',');

  const nameByGroup = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) {
      map.set(g.id, g.name);
    }
    return map;
  }, [groups]);

  const load = useCallback(async () => {
    if (!enabled || !userId) {
      setIncomingPayments([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await Promise.all(
        targetGroupIds.map((groupId) =>
          getPayments(groupId).catch((): PaymentResponse[] => []),
        ),
      );
      const acc: PendingIncomingPayment[] = [];
      results.forEach((payments, index) => {
        const groupId = targetGroupIds[index];
        for (const p of payments) {
          if (p.status === 'PENDING' && p.toUserId === userId) {
            acc.push({
              groupId,
              groupName: nameByGroup.get(groupId) ?? 'Grupo',
              fromUserId: p.fromUserId,
              fromFirstName: p.fromUser?.firstName ?? 'Alguien',
              fromLastName: p.fromUser?.lastName ?? '',
              amount: Number(p.amount),
            });
          }
        }
      });
      acc.sort((a, b) => b.amount - a.amount);
      setIncomingPayments(acc);
    } catch {
      setIncomingPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, [targetGroupIds, groupIdsKey, userId, nameByGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    useCallback(() => {
      if (enabled) {
        load();
      }
    }, [enabled, load]),
  );

  const totalIncoming = incomingPayments.reduce((acc, p) => acc + p.amount, 0);

  return { incomingPayments, totalIncoming, isLoading, refetch: load };
}
