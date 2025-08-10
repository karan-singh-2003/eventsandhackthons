import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Check } from 'lucide-react'

const WorkspaceSwitcherContent = () => {
  const workspaces = [
    { name: 'Karan Coding Club', slug: 'karan-coding-club' },
    { name: 'Hackathon Team', slug: 'hackathon-team' },
    { name: 'Events Group', slug: 'events-group' },
  ]

  // This could also come from props, context, or global state
  const [currentWorkspaceSlug, setCurrentWorkspaceSlug] =
    useState('hackathon-team')

  return (
    <div className="md:mx-0.5 md:my-2 mb-4">
      <h1 className="text-[12.5px] px-2 font-medium text-black/60 ">
        Switch Workspace
      </h1>
      <div className="md:mt-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.slug}
            className="flex my-2 items-center justify-between px-2.5 py-1 hover:bg-black/5 cursor-pointer"
            onClick={() => setCurrentWorkspaceSlug(workspace.slug)}
          >
            <div className="flex items-center gap-x-2">
              <div className="w-7 h-7 text-[11px] flex items-center justify-center rounded-none text-black/60 font-medium border-[1px] border-black/20 text-base">
                {workspace.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="md:text-[14.5px] font-medium text-black/70">
                {workspace.name}
              </div>
            </div>
            {currentWorkspaceSlug === workspace.slug && (
              <Check className="w-4 h-4 text-black" />
            )}
          </div>
        ))}
      </div>
      <hr className="my-2" />
      <Button variant="ghost" className="w-full">
        <Plus className="h-5 w-5" />
        Create Workspace
      </Button>
    </div>
  )
}

export default WorkspaceSwitcherContent
