'use client'

import { useEffect, useState } from 'react'
import type React from 'react'
import { useParams, useRouter } from 'next/navigation'
import clsx from 'clsx'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

import { useQueryData } from '@/hooks/useQueryData'
import { getWorkspaceBySlug } from '@/actions/usegetWorkspacebySlug'
import useRenameWorkspace from '@/hooks/useRenameWorkspace'
import { useDeleteWorkspace } from '@/hooks/useDeleteWorkspace'
import { updateWorkspaceSchema } from '@/Schemas/updateWorkspaceNameSchema'

import { Skeleton } from '@/components/ui/skeleton'
import { getBgColor, getTextColor } from '@/utils/generatecolor'
import { usePermissions } from '@/hooks/usePermissions'

const WorkspaceSettingsProfile = () => {
  const { workspaceSlug } = useParams()
  const router = useRouter()

  const { data: workspaceData, isPending } = useQueryData(
    ['workspaces', workspaceSlug],
    () => getWorkspaceBySlug({ workspaceSlug: workspaceSlug as string }),
    true
  )

  // (Optional) Fetch workspaces if needed in future

  const { mutate: renameWorkspace, serverError } = useRenameWorkspace()

  const { mutate: deleteWorkspace, isPending: deletepending } =
    useDeleteWorkspace({
      workspaceSlug: workspaceSlug as string,
    })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    mode: 'onChange',
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingSlug, setIsEditingSlug] = useState(false)

  // Set form values on fetch
  useEffect(() => {
    if (workspaceData?.workspace) {
      setValue('name', workspaceData.workspace.name)
      setValue('slug', workspaceData.workspace.slug)
    }
  }, [workspaceData, setValue])

  // Colors are derived inline via getBgColor/getTextColor

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
    renameWorkspace({
      workspaceId: workspaceData?.workspace?.id as string,
      ...payload,
    });
  }
};


  const handleDelete = () => {
    // mutate requires a variable param by typing; pass undefined
    deleteWorkspace(undefined)
    router.push('/')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(handleSave)()
    }
  }

  const [copyClicked, setCopyClicked] = useState(false)

  // Permissions for this workspace
  const { can, isPending: permsPending } = usePermissions(
    workspaceSlug as string
  )
  const canDeleteWorkspace = can(
    `${process.env.NEXT_PUBLIC_DELETE_WORKSPACE_PERMISSION_ID}`
  )

  return (
    <div className=" mx-auto p-1 mb-[95px] lg:mb-1">
      {/* Header with tabs */}

      {/* Avatar and Upload Picture Section */}
      <div className="flex flex-col max-w-full  lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 mt-3">
        <div className="flex flex-col items-center lg:items-center lg:flex-row gap-4 lg:gap-4">
          {isPending ? (
            <Skeleton className="h-16 w-16 lg:w-[48px] lg:h-[48px] rounded-full" />
          ) : (
            <div
              className={clsx(
                'w-16 h-16  lg:w-[48px] lg:h-[48px]   mx-auto lg:mx-0     rounded-full flex items-center justify-center text-xl lg:text-lg  font-semibold text-black shadow-md'
              )}
              style={{
                backgroundColor: getBgColor(
                  workspaceData?.workspace?.name || ''
                ),
                color: getTextColor(workspaceData?.workspace?.name || ''),
              }}
            >
              {(workspaceData?.workspace?.name ?? 'WS')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="flex flex-col">
            {isPending ? (
              <div className="flex flex-col gap-y-2">
                <Skeleton className="h-4 w-48 rounded-none" />
                <Skeleton className="h-4 w-52 rounded-none" />
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="font-medium text-[#494949]">
                  {workspaceData?.workspace?.name}
                </h1>
                <span className="text-xs font-medium lg:text-[13px] text-center lg:text-left text-[#8b8b8b]">
                  JPG, PNG. Recommended size is 256x256px
                </span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className=" border border-[#6F6D6D] bg-transparent ml-[330px] text-sm lg:text-[11px] px-4  lg:py-1 lg:px-6 py-2  rounded-2xl text-[#464545]"
            size="sm"
          >
            Upload picture
          </Button>
        </div>

        {/* Upload Picture Button - positioned to the right on desktop */}
      </div>

      {/* Error Messages */}
      {serverError && (
        <p className="text-red-500 text-sm mb-4">{serverError}</p>
      )}
      {errors.name && (
        <p className="text-red-500 text-sm mb-4">{errors.name.message}</p>
      )}
      {errors.slug && (
        <p className="text-red-500 text-sm mb-4">{errors.slug.message}</p>
      )}

      {/* Form Fields */}
      <div className="space-y-6 ">
        {/* Workspace Name Field */}
        <div>
       <label className="block text-sm lg:text-[14px] text-[#646464] font-semibold mb-2">
    Workspace Name
  </label>
  <div className="w-full lg:w-[411px]">
    {isEditingName ? (
      <input
        {...register('name')}
        autoFocus
        type="text"
        onBlur={handleSubmit(handleSave)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-[14px]  uppercase font-medium text-[#10414d]"
      />
            ) : (
              <div>
                {isPending ? (
                  <Skeleton className="h-9 w-103 rounded-none" />
                ) : (
                <div
        className="w-full px-3 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-sm lg:text-[14px]"
        onClick={() => setIsEditingName(true)}
      >
        {workspaceData?.workspace?.name || 'Workspace'}
      </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Slug Field */}
        <div>
          <label className="block text-sm lg:text-[14px] font-semibold text-[#646464] mb-2">
    Workspace Slug
  </label>
  <div className="w-full lg:w-[411px]">
    {isEditingSlug ? (
      <input
        {...register('slug')}
        autoFocus
        type="text"
        onBlur={handleSubmit(handleSave)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-[14px]  uppercase font-medium text-[#10414d]"
      />
            ) : (
              <div>
                {isPending ? (
                  <Skeleton className="h-9 w-103 rounded-none" />
                ) : (
                   <div
        className="w-full px-3 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-sm lg:text-[14px]"
        onClick={() => setIsEditingSlug(true)}
      >
        {workspaceData?.workspace?.slug || 'workspace-slug'}
      </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Workspace ID Field */}
        <div className="max-w-[410px]">
          <label className=" flex justify-between  text-sm lg:text-[14px] font-semibold text-[#646464] mb-2">
            Workspace Id
            <div className="flex items-center ">
              {!copyClicked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 15 15"
                  id="Align-Front-1--Streamline-Core"
                  height={12}
                  width={12}
                  className="mr-[2.5px] text-[#888888]"
                >
                  <desc>
                    {
                      '\n    Align Front 1 Streamline Icon: https://streamlinehq.com\n  '
                    }
                  </desc>
                  <g id="align-front-1--design-front-layer-layers-pile-stack-arrange-square">
                    <path
                      id="Vector"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4 13.5 8.5 0c0.5523 0 1 -0.4477 1 -1l0 -8.5c0 -0.55229 -0.4477 -1 -1 -1L4 3c-0.55229 0 -1 0.44771 -1 1l0 8.5c0 0.5523 0.44771 1 1 1Z"
                      strokeWidth={1.9}
                    />
                    <path
                      id="Vector_2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M0.5 10.5v-9c0 -0.26522 0.105357 -0.51957 0.292893 -0.707107C0.98043 0.605357 1.23478 0.5 1.5 0.5h9"
                      strokeWidth={1.9}
                    />
                  </g>
                </svg>
              )}
              <button
                className="ml-1 text-xs text-muted-foreground"
                onClick={() => {
                  navigator.clipboard.writeText(
                    workspaceData?.workspace?.id || 'workspace-id'
                  )
                  setCopyClicked(true)
                  setTimeout(() => setCopyClicked(false), 2000)
                }}
              >
                {copyClicked ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </label>
          <div>
            {isPending ? (
              <Skeleton className="h-9 w-103 rounded-none" />
            ) : (
              <div
                className="w-full px-3 py-2 bg-gray-100  cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-sm lg:text-[14px]"
               
              >
                {workspaceData?.workspace?.id || 'Workspace'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Workspace Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-sm lg:text-[15px] font-semibold text-[#4d4d4d]">
              Delete Workspace
            </h3>
            <div className="lg:flex">
              <p className="text-xs lg:text-[14px] font-medium text-muted-foreground/90 mt-1">
                Deleting this workspace will remove all projects, files, and
                members linked to it. Once deleted, the data cannot be recovered
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent font-medium text-sm  lg:px-3 px-4 py-2 w-full lg:w-auto  lg:mt-0 mt-[16px] lg:ml-[179px] rounded-2xl"
                    disabled={deletepending || !canDeleteWorkspace}
                  >
                    {deletepending ? 'Deleting...' : 'Delete Workspace'}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[672px]  rounded-none -p-0.5 p-3.5"
                  showCloseButton={false}
                >
                  <div className=" border-b-[0.5px] border-[#c7c7c7] pb-5 -mx-4">
                    <div className="px-4 flex flex-col gap-y-2 ">
                      <DialogTitle className="lg:text-[22px] text-xl font-semibold text-gray-900">
                        Are you sure you want to delete this workspace?
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground lg:text-[15px]">
                        This will permanently delete all the data in this
                        workspace
                      </DialogDescription>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 my-1">
                    <DialogClose asChild>
                      <Button
                        variant="secondary"
                        className="rounded-full bg-transparent h-7.5"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={
                        deletepending || (!permsPending && !canDeleteWorkspace)
                      }
                      className="rounded-full text-sm h-7.5 "
                    >
                      {deletepending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* {!permsPending && !canDeleteWorkspace && (
                <p className="text-xs text-muted-foreground mt-2">
                  You don’t have permission to delete this workspace.
                </p>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceSettingsProfile
