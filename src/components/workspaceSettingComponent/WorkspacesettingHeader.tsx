'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useQueryData } from '@/hooks/useQueryData';
import { getWorkspaceBySlug } from '@/actions/usegetWorkspacebySlug';
import { getColorForString } from '@/utils/getColors';
import useRenameWorkspace from '@/hooks/useRenameWorkspace';
import { updateWorkspaceSchema } from '@/Schemas/updateWorkspaceNameSchema';
import { Button } from '../ui/button';
import CopyWorkspaceId from './WorkspaceIdcopy';

function WorkspacesettingHeader() {
  const { workspaceSlug } = useParams();

  const {
    data: workspaceData,
    isPending,
    isFetching,
  } = useQueryData(
    ['workspaces', workspaceSlug],
    () => getWorkspaceBySlug({ workspaceSlug: workspaceSlug as string }),
    true
  );

  const {
    mutate: renameWorkspace,
    isPending: isRenaming,
     serverError,
  } = useRenameWorkspace();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    mode: 'onChange',
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  // Set form values on fetch
  useEffect(() => {
    if (workspaceData?.workspace) {
      setValue('name', workspaceData.workspace.name);
      setValue('slug', workspaceData.workspace.slug);
    }
  }, [workspaceData, setValue]);

  const bgColor = getColorForString(workspaceData?.workspace?.name || '');

 const handleSave = (data: { name: string; slug: string }) => {
  const payload: { name?: string; slug?: string } = {};

  const currentName = workspaceData?.workspace?.name;
  const currentSlug = workspaceData?.workspace?.slug;

  if (data.name && data.name !== currentName) {
    payload.name = data.name;
  }

  if (data.slug && data.slug !== currentSlug) {
    payload.slug = data.slug;
  }

  if (Object.keys(payload).length > 0) {
    renameWorkspace({ workspaceId: workspaceData?.workspace?.id, ...payload });
  }

  setIsEditingName(false);
  setIsEditingSlug(false);
};


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(handleSave)();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-center mt-2 p-4 rounded-md">
     
      
        {/* Avatar and workspace name */}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
  <div
    className={clsx(
      'lg:w-11 lg:h-11 w-12 h-12 rounded-full flex items-center justify-center lg:text-sm text-lg font-semibold text-black shadow-md'
    )}
    style={{ backgroundColor: bgColor }}
  >
    {workspaceData?.workspace?.name.slice(0, 2).toUpperCase()}
  </div>

  <div className="flex flex-col items-center lg:items-start mt-2 lg:mt-0 w-full">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-2">
      <div className="flex flex-col">
        <span className="lg:text-sm text-lg uppercase font-semibold text-black">
          {isPending || isFetching
            ? 'Loading...'
            : workspaceData?.workspace?.name || 'Workspace'}
        </span>
        <span className="lg:text-xs text-xs text-[#999999] mt-1">
          Workspace Settings
        </span>
      </div>
      <Button
        variant='outline'
        size="sm"
        className="w-full lg:w-auto border-1 border-gray-400 bg-transparent text-xs  px-2 py-4 lg:ml-[260px]"
      >
        Upload Picture
      </Button>
    </div>

    {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}
    {errors.name && (
      <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
    )}
    {errors.slug && (
      <p className="text-red-500 text-sm mt-2">{errors.slug.message}</p>
    )}
  </div>
</div>

      </div>

      {/* Workspace Name Field */}
      <div className="items-center justify-between lg:px-4 px-4 lg:py-2 py-2 mt-2 lg:text-sm text-xs">
        Workspace Name
        <div className="w-full lg:w-[426px]">
          {isEditingName ? (
            <input
              {...register('name')}
              type="text"
              onBlur={handleSubmit(handleSave)}
              onKeyDown={handleKeyDown}
              className="flex uppercase text-[#10414d] font-semibold bg-white border border-gray-300 lg:px-2 px-2 w-full lg:py-2 py-2 mt-2 shadow-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <div
              className="flex uppercase text-[#10414d] font-semibold lg:text-xs text-xs bg-[#f0f0f0] lg:px-2 px-2 w-full lg:py-2 py-2 mt-2 shadow-sm lg:w-[426px] rounded-md cursor-pointer hover:bg-[#e8e8e8]"
              onClick={() => setIsEditingName(true)}
            >
              {isPending || isFetching
                ? 'Loading...'
                : workspaceData?.workspace?.name || 'Workspace'}
            </div>
          )}
        </div>
      </div>

      {/* Workspace Slug Field */}
      <div className="items-center justify-between lg:px-4 px-4 lg:py-2 py-2 mt-2 lg:text-sm text-xs">
        Workspace Slug
        <div className="w-full lg:w-[426px]">
          {isEditingSlug ? (
            <input
              {...register('slug')}
              type="text"
              onBlur={handleSubmit(handleSave)}
              onKeyDown={handleKeyDown}
              className="flex lowercase text-[#10414d] font-semibold bg-white border border-gray-300 lg:px-2 px-2 w-full lg:py-2 py-2 mt-2 shadow-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <div
              className="flex lowercase text-[#10414d] font-semibold lg:text-xs text-xs bg-[#f0f0f0] lg:px-2 px-2 w-full lg:py-2 py-2 mt-2 shadow-sm lg:w-[426px] rounded-md cursor-pointer hover:bg-[#e8e8e8]"
              onClick={() => setIsEditingSlug(true)}
            >
              {isPending || isFetching
                ? 'Loading...'
                : workspaceData?.workspace?.slug || 'workspace-slug'}
            </div>
          )}
        </div>
      </div>

      {/* Workspace ID (read-only) */}
      <div className="items-center justify-between lg:px-4 px-4 lg:py-2 py-2 mt-2 lg:text-sm text-xs">
        Workspace ID
        <div className="flex uppercase text-[#10414d] font-semibold lg:text-xs text-xs bg-[#f0f0f0] lg:px-2 px-2 w-full lg:py-2  py-2 mt-2 shadow-sm lg:w-[426px]">
          {isPending || isFetching ? 'Loading...' : workspaceData?.workspace?.id || 'Workspace'}
        </div>
      </div>
    </>
  );
}

export default WorkspacesettingHeader;

