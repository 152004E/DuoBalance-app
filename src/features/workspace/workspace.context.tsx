import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { WorkspaceState } from './workspace.types';
import { DEFAULT_WORKSPACE } from './workspace.constants';

interface WorkspaceContextType {
  workspace: WorkspaceState;
  setWorkspace: (workspace: WorkspaceState) => void;
  selectPersonal: () => void;
  selectCouple: (groupId?: string | null) => void;
  selectGroup: (groupId: string | null) => void;
  resetWorkspace: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(
  null,
);

interface Props {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: Props) {
  const [workspace, setWorkspace] = useState<WorkspaceState>(DEFAULT_WORKSPACE);

  const selectPersonal = useCallback(() => {
    setWorkspace({ category: 'personal', groupId: null });
  }, []);

  const selectCouple = useCallback((groupId: string | null = null) => {
    setWorkspace({ category: 'couple', groupId });
  }, []);

  const selectGroup = useCallback((groupId: string | null) => {
    setWorkspace({ category: 'group', groupId });
  }, []);

  const resetWorkspace = useCallback(() => {
    setWorkspace(DEFAULT_WORKSPACE);
  }, []);

  const value = useMemo(
    () => ({
      workspace,
      setWorkspace,
      selectPersonal,
      selectCouple,
      selectGroup,
      resetWorkspace,
    }),
    [
      workspace,
      setWorkspace,
      selectPersonal,
      selectCouple,
      selectGroup,
      resetWorkspace,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
