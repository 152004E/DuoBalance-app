import { useState, useMemo, useCallback } from 'react';
import { getSettlementSuggestions } from '@/services/api/payments';
import type { GroupResponse } from '@/types/api';
import type { WorkspaceState } from '@/features/workspace/workspace.types';

export interface SettlementDue {
  groupId: string;
  groupName: string;
  toUserId: string;
  toFirstName: string;
  toLastName: string;
  amount: number;
}

interface UseSettlementSuggestionsOptions {
  workspace: WorkspaceState;
  groups: GroupResponse[];
  userId?: string;
  enabled?: boolean;
}

/**
 * Carga las liquidaciones sugeridas por el backend (getSettlementSuggestions)
 * para los grupos del workspace y extrae las deudas del usuario actual
 * (sugerencias donde `from === userId`).
 * Se re-ejecuta al cambiar de workspace/grupos y al enfocar la pantalla.
 */
export function useSettlementSuggestions({
  workspace,
  groups,
  userId,
  enabled = true,
}: UseSettlementSuggestionsOptions) {
  const [dues, setDues] = useState<SettlementDue[]>([]);
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
      setDues([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await Promise.all(
        targetGroupIds.map((groupId) =>
          getSettlementSuggestions(groupId).catch(() => null),
        ),
      );
      const acc: SettlementDue[] = [];
      results.forEach((result, index) => {
        if (!result) return;
        const groupId = targetGroupIds[index];
        for (const s of result.suggestions) {
          if (s.from.id === userId) {
            acc.push({
              groupId,
              groupName: nameByGroup.get(groupId) || result.group.name,
              toUserId: s.to.id,
              toFirstName: s.to.firstName,
              toLastName: s.to.lastName,
              amount: s.amount,
            });
          }
        }
      });
      // Ordena de mayor a menor deuda para destacar lo más urgente
      acc.sort((a, b) => b.amount - a.amount);
      setDues(acc);
    } catch {
      setDues([]);
    } finally {
      setIsLoading(false);
    }
  }, [targetGroupIds, groupIdsKey, userId, nameByGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalDue = dues.reduce((acc, d) => acc + d.amount, 0);

  return { dues, totalDue, isLoading, refetch: load };
}