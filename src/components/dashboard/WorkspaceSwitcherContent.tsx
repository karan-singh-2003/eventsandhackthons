import React from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { useParams } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'

interface Workspace {
  workspaceName: string
  workspaceSlug: string
}

interface Props {
  workspaces: Workspace[]
  currentWorkspaceSlug: any
  onSelect: (slug: string) => void
  onCreate: () => void
}

const WorkspaceSwitcherContent = ({
  workspaces,
  currentWorkspaceSlug,
  onSelect,
  onCreate,
}: Props) => {
   const { workspaceSlug } = useParams()
  const { can, isPending: permsPending } = usePermissions(
    workspaceSlug as string
  )
  const canCreateRole = can(
    `${process.env.NEXT_PUBLIC_CREATE_WORKSPACE_PERMISSION_ID}`
  )
  return (
    <div className="md:mx-0.5 md:my-2 mb-4">
      <h1 className="text-[12.5px] px-2 font-medium text-black/60">
        Switch Workspace
      </h1>

      <div className="md:mt-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.workspaceSlug}
            className="flex my-2 items-center justify-between px-2.5 py-1 hover:bg-black/5 cursor-pointer"
            onClick={() => onSelect(workspace.workspaceSlug)}
          >
            <div className="flex items-center gap-x-2">
              <div className="lg:w-7 lg:h-7 w-5 h-5 text-[11px] flex items-center justify-center rounded-none text-black/60 font-medium border-[1px] border-black/20">
                {workspace.workspaceName.slice(0, 2).toUpperCase()}
              </div>
              <div className="md:text-[14.5px]  text-[11.5px] font-medium text-black/70">
                {workspace.workspaceName}
              </div>
            </div>
            {currentWorkspaceSlug === workspace.workspaceSlug && (
              <Check className="lg:w-4 lg:h-4 w-3 h-3 text-black" />
            )}
          </div>
        ))}
      </div>

      <hr className="my-2" />

      <Button variant="ghost" disabled={!canCreateRole} className="w-full lg:text-sm text-[12px]" onClick={onCreate}>
        <Plus className="lg:h-5 lg:w-5 h-4 w-4 " />
        Create Workspace
      </Button>
    </div>
  )
}

export default WorkspaceSwitcherContent
