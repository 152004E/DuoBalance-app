import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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

export function useSettlementSuggestions({
  workspace,
  groups,
  userId,
  enabled = true,
}: UseSettlementSuggestionsOptions) {
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

  const { data: dues = [], isLoading, refetch } = useQuery({
    queryKey: ['settlement-suggestions', groupIdsKey, userId],
    queryFn: async () => {
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
      acc.sort((a, b) => b.amount - a.amount);
      return acc;
    },
    enabled: enabled && !!userId && targetGroupIds.length > 0,
  });

  const totalDue = dues.reduce((acc, d) => acc + d.amount, 0);

  return { dues, totalDue, isLoading, refetch };
}
