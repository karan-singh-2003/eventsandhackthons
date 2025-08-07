'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useQueryData } from '@/hooks/useQueryData'
import { getColorForString } from '@/utils/getColors'
import { Plus } from 'lucide-react'
import Spinner from './Spinner'
import { useIsMobile } from '@/hooks/usemobileswitcherOpen'

function WorkspacesSwitcher() {
  const { workspaceSlug } = useParams()
  const currentWorkspaceSlug = workspaceSlug
  const isMobile = useIsMobile()
  const router = useRouter()

  const {
    data: workspaces = { data: [] },
    isPending,
    isFetching,
  } = useQueryData(['workspaces'], async () => {
    const res = await fetch('/api/workspace/getworkspaces')
    if (!res.ok) throw new Error('Failed to fetch workspaces')
    return res.json()
  }, true)

  const currentWorkspace = workspaces.data.find(
    (w: any) => w.workspaceSlug === currentWorkspaceSlug
  )

  const onSelect = async (workspaceSlug: string) => {
    try {
      await fetch('/api/workspace/updateLastActiveWorkspacewithSlug', {
        method: 'POST',
        body: JSON.stringify({ workspaceSlug }),
      })
      router.push(`/workspace/${workspaceSlug}`)
    } catch (err) {
      console.error('Failed to update last active workspace:', err)
      router.push(`/workspace/${workspaceSlug}`)
    }
  }

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-[50px]">
        <Spinner color="#aaaa" size={14} />
      </div>
    )
  }

  return (
    <div className="flex gap-y-2">
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <button className="h-[32px] w-[32px] p-[8px] bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md flex items-center justify-center">
              <div className="text-sm font-semibold text-gray-900">
                {currentWorkspace?.workspaceName?.[0]?.toUpperCase() || 'W'}
              </div>
            </button>
          </DrawerTrigger>
         <DrawerContent>
  <DrawerHeader>
    <DrawerTitle>Select Workspace</DrawerTitle>
  </DrawerHeader>

  {/* Scrollable list */}
  <div className="px-4 py-2 space-y-2 max-h-[75vh] overflow-y-auto">
    {Array.isArray(workspaces?.data) &&
      workspaces.data.map((workspace: any) => (
        <div
          key={workspace.workspaceSlug}
          onClick={() => onSelect(workspace.workspaceSlug)}
          className="flex items-center gap-3 p-3 border rounded-md hover:bg-indigo-50 cursor-pointer"
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold"
            style={{
              backgroundColor: getColorForString(workspace.workspaceName),
            }}
          >
            {workspace.workspaceName?.[0]?.toUpperCase()}
          </div>
          <span className="text-base font-medium text-gray-900 truncate">
            {workspace.workspaceName}
          </span>
        </div>
      ))}
  </div>

  {/* ✅ Fixed button at bottom */}
  <div className="sticky bottom-0 left-0 w-full px-4 py-3 bg-white border-t">
    <button
      onClick={() => router.push('/create-workspace')}
      className="w-full flex items-center justify-center gap-2
        bg-indigo-600 hover:bg-indigo-700 text-white
        text-sm font-medium py-2 px-3 rounded-md transition-all"
    >
      <Plus className="h-5 w-5" />
      Create Workspace
    </button>
  </div>
</DrawerContent>

        </Drawer>
      ) : (
        <Select onValueChange={onSelect} value={currentWorkspaceSlug}>
          <SelectTrigger className="h-[30px] w-[30px] p-[8px] bg-white hover:bg-gray-50 border border-gray-300 shadow-sm  flex items-center justify-center">
            <div className="text-sm  text-gray-600">
              {currentWorkspace?.workspaceName?.[0]?.toUpperCase() || 'W'}
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-800 border border-gray-300 sm:w-[80px] lg:w-[230px] p-0">
            <div className="lg:max-h-[140px] max-h-[750px] overflow-y-auto px-1 py-1">
              {Array.isArray(workspaces?.data) &&
                workspaces.data.map((workspace: any) => (
                  <SelectItem
                    key={workspace.workspaceSlug}
                    value={workspace.workspaceSlug}
                    className="flex items-center gap-3 lg:px-3 lg:py-2 p-4 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    <div
                      className="lg:w-6 lg:h-6 h-8 w-8 flex items-center justify-center rounded-full text-white font-bold lg:text-xs text-xl"
                      style={{
                        backgroundColor: getColorForString(workspace.workspaceName),
                      }}
                    >
                      {workspace.workspaceName?.[0]?.toUpperCase()}
                    </div>
                    <span className="lg:text-sm text-2xl font-medium text-gray-900 truncate">
                      {workspace.workspaceName}
                    </span>
                  </SelectItem>
                ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t px-4 py-2">
              <button
                onClick={() => router.push('/create-workspace')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm lg:text-xs font-medium py-2 px-3 rounded-md transition-all"
              >
                <Plus className="lg:h-4 lg:w-4 h-8 w-8" />
                Create Workspace
              </button>
            </div>
          </SelectContent>
        </Select>
      )}

      {/* Workspace name */}
      <div className="lg:ml-3 ml-3 mt-2 lg:mt-2 lg:text-sm text-xs font-sans flex uppercase font-[500] text-[#252525] m-2">
        {currentWorkspace?.workspaceName || 'select workspace'}
      </div>
    </div>
  )
}

export default WorkspacesSwitcher

