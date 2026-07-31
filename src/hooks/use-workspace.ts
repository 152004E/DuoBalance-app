// src/hooks/use-workspace.ts

import { useContext } from 'react';

import { WorkspaceContext } from '@/features/workspace/workspace.context';

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider');
  }

  return context;
}
