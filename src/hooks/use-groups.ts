import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyGroups } from '@/services/api/groups';
import type { GroupResponse } from '@/types/api';

interface UseGroupsReturn {
  groups: GroupResponse[];
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<any>;
}

export function useGroups(): UseGroupsReturn {
  const { data: groups = [], isLoading, error, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: getMyGroups,
  });

  const personalGroups = useMemo(
    () => groups.filter((g) => g.type === 'PERSONAL'),
    [groups],
  );

  const coupleGroups = useMemo(
    () => groups.filter((g) => g.type === 'COUPLE'),
    [groups],
  );

  const sharedGroups = useMemo(
    () => groups.filter((g) => g.type === 'GROUP'),
    [groups],
  );

  return {
    groups,
    personalGroups,
    coupleGroups,
    sharedGroups,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
