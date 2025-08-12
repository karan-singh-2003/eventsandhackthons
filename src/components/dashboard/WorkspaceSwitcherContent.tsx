import React from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from '../ui/button'

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
  onCreate
}: Props) => {
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
              <div className="w-7 h-7 text-[11px] flex items-center justify-center rounded-none text-black/60 font-medium border-[1px] border-black/20">
                {workspace.workspaceName.slice(0, 2).toUpperCase()}
              </div>
              <div className="md:text-[14.5px] font-medium text-black/70">
                {workspace.workspaceName}
              </div>
            </div>
            {currentWorkspaceSlug === workspace.workspaceSlug && (
              <Check className="w-4 h-4 text-black" />
            )}
          </div>
        ))}
      </div>

      <hr className="my-2" />

      <Button variant="ghost" className="w-full" onClick={onCreate}>
        <Plus className="h-5 w-5" />
        Create Workspace
      </Button>
    </div>
  )
}

export default WorkspaceSwitcherContent
