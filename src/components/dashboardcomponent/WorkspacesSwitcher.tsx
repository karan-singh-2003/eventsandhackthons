'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from './Spinner';
import { useQueryData } from '@/hooks/useQueryData';
import { getColorForString } from '@/utils/getColors';
import { Plus } from 'lucide-react';

function WorkspacesSwitcher() {
  const {workspaceSlug} = useParams();
  const currentWorkspaceSlug = workspaceSlug

  const {
    data: workspaces = { data: [] },
    isPending,
    isFetching,
  } = useQueryData(['workspaces'], async () => {
    const res = await fetch('/api/workspace/getworkspaces');
    if (!res.ok) throw new Error('Failed to fetch workspaces');
    return res.json();
  }, true);

  const router = useRouter();

  const currentWorkspace = workspaces.data.find(
    (w: any) => w.workspaceSlug === currentWorkspaceSlug
  );

  const onSelect = async (workspaceSlug: string) => {
  try {
    // Update last active workspace
    await fetch('/api/workspace/updateLastActiveWorkspacewithSlug', {
      method: 'POST',
      body: JSON.stringify({ workspaceSlug }),
    });

    // Navigate to selected workspace
    router.push(`/workspace/${workspaceSlug}`);
  } catch (err) {
    console.error('Failed to update last active workspace:', err);
    router.push(`/workspace/${workspaceSlug}`);
  }
};


  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-[50px]">
        <Spinner color="#aaaa" size={14} />
      </div>
    );
  }

  return (
    <div className="flex  gap-y-2">
      <Select onValueChange={onSelect} value={currentWorkspaceSlug}>
  <SelectTrigger
    className="  ml-1
    h-[60px] w-[60px] p-[30px] 
    lg:h-[12px] lg:w-[12px] lg:p-[15px]
    bg-white 
    hover:bg-gray-50
    focus:bg-gray-100
    active:bg-gray-200
    border border-gray-300 
    shadow-sm 
    rounded-md
    transition-all 
    flex items-center justify-center"
  >
    <div className="lg:text-sm text-3xl font-sans font-[600] text-gray-900">
      {currentWorkspace?.workspaceName?.[0]?.toUpperCase() || 'W'}
    </div>
  </SelectTrigger>

  <SelectContent className="bg-white text-gray-800 border border-gray-300 sm:w-[480px] lg:w-[280px] p-0">
    {/* Scrollable list container */}
    <div className="lg:max-h-[230px] max-h-[750px]  overflow-y-auto px-2 py-2">
      {Array.isArray(workspaces?.data) &&
        workspaces.data.map((workspace: any) => (
          <SelectItem
            key={workspace.workspaceSlug}
            value={workspace.workspaceSlug}
            className="flex items-center gap-3 lg:px-3 lg:py-2 p-4 hover:bg-indigo-100 rounded-md transition-colors"
          >
            <div
              className="lg:w-8 lg:h-8 h-15 w-15 flex items-center justify-center rounded-full text-white font-bold lg:text-sm text-3xl"
              style={{
                backgroundColor: getColorForString(workspace.workspaceName),
              }}
            >
              {workspace.workspaceName?.[0]?.toUpperCase()}
            </div>
            <span className="lg:text-sm text-2xl  font-medium text-gray-900 truncate">
              {workspace.workspaceName}
            </span>
          </SelectItem>
        ))}
    </div>

    {/* Sticky create button */}
    <div className="sticky bottom-0 bg-white border-t px-4 py-2">
      <button
        onClick={() => router.push('/create-workspace')}
        className="w-full flex items-center justify-center gap-2
          bg-indigo-600 hover:bg-indigo-700 text-white
          text-xl lg:text-xs font-medium py-2 px-3 rounded-md transition-all"
      >
        <Plus className="lg:h-4 lg:w-4 h-8 w-8" />
        Create Workspace
      </button>
    </div>
  </SelectContent>
</Select>
      <div className=" lg:ml-3 ml-6 lg:text-sm text-3xl  font-sans flex uppercase font-[600] text-[#363636] m-2">
        {currentWorkspace?.workspaceName || 'select workspace'}
      </div>
    </div>
  );
}

export default WorkspacesSwitcher;
