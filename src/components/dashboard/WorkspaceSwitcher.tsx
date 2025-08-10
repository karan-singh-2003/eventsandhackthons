//
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import ResponsiveMenuOrDrawer from './ResponsiveMenuOrDrawer'
import WorkspaceSwitcherContent from './WorkspaceSwitcherContent'

const workspaces = [
  { name: 'Karan Coding Club', slug: 'karan-coding-club' },
  { name: 'Hackathon Team', slug: 'hackathon-team' },
  { name: 'Events Group', slug: 'events-group' },
]

const WorkspaceSwitcher = () => {
  const [selected, setSelected] = useState(workspaces[0])
  const loading = false

  const handleSelect = (workspace: { name: string; slug: string }) => {
    setSelected(workspace)
  }

  const handleCreate = () => {
    alert('Create Workspace clicked')
  }

  if (loading) {
    return (
      <div className="flex gap-x-2 py-1.5 px-2">
        <Skeleton className="h-6 w-6 rounded-none" />
        <Skeleton className="h-6 w-24 rounded-none" />
      </div>
    )
  }

  return (
    <ResponsiveMenuOrDrawer
      trigger={
        <div
          className="flex items-center gap-2 hover:bg-black/5 py-1.5 px-2 rounded-none w-full cursor-pointer"
          aria-label="Switch workspace"
        >
          <Button
            variant="outline"
            className="border-black/20 px-2 py-2 text-black/50 h-6 w-6 text-[11.5px]"
          >
            {selected.name.slice(0, 2).toUpperCase()}
          </Button>
          <span className="font-semibold text-[15px] truncate">
            {selected.name}
          </span>
          <ChevronDown className="text-black/40" size={15} />
        </div>
      }
    >
      <WorkspaceSwitcherContent />
    </ResponsiveMenuOrDrawer>
  )
}

export default WorkspaceSwitcher
