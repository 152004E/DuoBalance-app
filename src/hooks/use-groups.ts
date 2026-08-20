import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMyGroups } from '@/services/api/groups';
import type { GroupResponse } from '@/types/api';

interface UseGroupsReturn {
  groups: GroupResponse[];
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGroups(): UseGroupsReturn {
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyGroups();
      setGroups(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los grupos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

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
    error,
    refetch: loadGroups,
  };
}
