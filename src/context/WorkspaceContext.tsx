'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WorkspaceData {
  id: string
  name: string
  slug: string
  description?: string
}

interface WorkspaceContextType {
  workspace: WorkspaceData | null
  setWorkspace: (workspace: WorkspaceData) => void
  clearWorkspace: () => void
  isWorkspaceCreated: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
)

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspace, setWorkspaceState] = useState<WorkspaceData | null>(null)

  const setWorkspace = (workspaceData: WorkspaceData) => {
    console.log('🏢 [WorkspaceProvider] Setting workspace:', workspaceData)
    setWorkspaceState(workspaceData)
  }

  const clearWorkspace = () => {
    console.log('🗑️ [WorkspaceProvider] Clearing workspace')
    setWorkspaceState(null)
  }

  const isWorkspaceCreated = !!workspace

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        clearWorkspace,
        isWorkspaceCreated,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

// Convenience hooks for easier access
export function useWorkspaceData() {
  const { workspace } = useWorkspace()
  return workspace
}

export function useWorkspaceName() {
  const { workspace } = useWorkspace()
  return workspace?.name || ''
}

export function useWorkspaceSlug() {
  const { workspace } = useWorkspace()
  return workspace?.slug || ''
}

export function useWorkspaceId() {
  const { workspace } = useWorkspace()
  return workspace?.id || ''
}
