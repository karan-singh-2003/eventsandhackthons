'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

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

// Safe hooks that don't throw if used outside provider and fall back to route/query
export function useWorkspaceSlugSafe() {
  const context = useContext(WorkspaceContext)
  const params = useParams() as { workspaceSlug?: string; slug?: string }
  const searchParams = useSearchParams()

  const fromContext = context?.workspace?.slug
  const fromParams = params?.workspaceSlug || params?.slug
  const fromSearch =
    searchParams?.get('workspaceSlug') || searchParams?.get('slug')

  return fromContext || fromParams || fromSearch || ''
}

export function useWorkspaceDataSafe(): WorkspaceData | null {
  const context = useContext(WorkspaceContext)
  return context?.workspace ?? null
}

export function useWorkspaceNameSafe() {
  const context = useContext(WorkspaceContext)
  return context?.workspace?.name || ''
}

export function useWorkspaceIdSafe() {
  const context = useContext(WorkspaceContext)
  return context?.workspace?.id || ''
}
