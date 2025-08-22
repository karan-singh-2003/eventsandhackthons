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
import { useMobileSidebar } from '../WorkspaceSlider'

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

  const { isOpen } = useMobileSidebar()
  const handleDelete = () => {
    // mutate requires a variable param by typing; pass undefined
    deleteWorkspace(undefined)
    router.push('/')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(handleSave)()
      setIsEditingName(false) // ✅ exit edit mode after save
    setIsEditingSlug(false)
    }
  }

  const [copyClicked, setCopyClicked] = useState(false)

  // Permissions for this workspace
  const { can, isPending: permsPending } = usePermissions(
    workspaceSlug as string
  )
  const canDeleteWorkspace = can(
    `${process.env.NEXT_PUBLIC_DELETE_WORKSPACE_PERMISSION_ID }`
  )

    const canChangeNameAndSlug = can(
    `${process.env.NEXT_PUBLIC_Change_WORKSPACE_Name_AND_SLUG_PERMISSION_ID}`
  )
  return (
    <div className=" mx-auto p-1 mb-[222px] lg:mb-1">
      {/* Header with tabs */}

      {/* Avatar and Upload Picture Section */}
     <div className="flex  max-w-full lg:flex-row lg:items-center justify-between lg:mb-8 mb-7 gap-4 mt-3">
  <div className="flex  lg:flex-row lg:items-center gap-2">
    {isPending ? (
      <Skeleton className="h-11 w-11 lg:w-[48px] lg:h-[48px] rounded-full" />
    ) : (
      <div
        className={clsx(
          'w-[35px] lg:p-0 p-3 h-[35px] lg:w-[48px] lg:h-[48px] rounded-full flex items-center justify-center text-[16px] lg:text-lg font-semibold text-black shadow-md'
        )}
        style={{
          backgroundColor: getBgColor(workspaceData?.workspace?.name || ''),
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
          <Skeleton className=" h-4 w-[124px] lg:w-48 rounded-none" />
          <Skeleton className=" h-4 w-[124px] lg:w-52 rounded-none" />
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className={`font-semibold uppercase lg:font-medium  ${isOpen ? "text-[10px]" : "text-[12.5px]"} lg:text-lg text-[#494949]`}>
            {workspaceData?.workspace?.name}
          </h1>
        <span
      className={`
        font-medium text-[#8b8b8b]
        ${isOpen ? "text-[8px]" : "text-[10px]"}  /* Mobile case changes */
        lg:text-[13px] lg:text-left              /* Desktop unaffected */
      `}
    >
      JPG, PNG. Recommended size is 256x256px
    </span>

        </div>
      )}
    </div>
  </div>

  {/* Upload Picture Button aligned right via justify-between */}
  <Button
    variant="outline"
    className="border border-[#6F6D6D] bg-transparent  w-[75px] h-[24px] lg:h-auto  lg:w-auto  text-[8.5px] lg:text-[11px] px-2 lg:py-1 lg:px-6 py-2  rounded-2xl text-[#464545]"
    size="sm"
  >
    Upload picture
  </Button>
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
      <div className="lg:space-y-6 space-y-4">
        {/* Workspace Name Field */}
        <div>
       <label className="block text-[11.5px] lg:text-[14px] text-[#646464] font-semibold mb-2">
    Workspace Name
  </label>
  <div className="w-full lg:w-[411px]">
    {isEditingName && canChangeNameAndSlug ? (
      <input
        {...register('name')}
        autoFocus
        type="text"
        
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 lg:h-auto h-[30px] border border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-[11.5px] lg:text-[14px]  uppercase font-medium text-[#10414d]"
      />
            ) : (
              <div>
                {isPending ? (
                  <Skeleton className="h-9 lg:w-103 w-[280px] rounded-none" />
                ) : (
                <div
        className="w-full px-3 py-2 lg:h-auto h-[30px] bg-gray-100 cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-[11.5px] lg:text-[14px]"
        onClick={() => {if(canChangeNameAndSlug){setIsEditingName(true)}}}
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
          <label className="block text-[11.5px] lg:text-[14px] font-semibold text-[#646464] mb-2">
    Workspace Slug
  </label>
  <div className="w-full lg:w-[411px]">
    {isEditingSlug && canChangeNameAndSlug ? (
      <input
        {...register('slug')}
        autoFocus
        type="text"
        
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 lg:h-auto h-[30px] border border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-[11.5px] lg:text-[14px]  uppercase font-medium text-[#10414d]"
      />
            ) : (
              <div>
                {isPending ? (
                  <Skeleton className="h-9 lg:w-103 w-[280px] rounded-none" />
                ) : (
                   <div
        className="w-full px-3 py-2 lg:h-auto h-[30px] bg-gray-100 cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-[11.5px] lg:text-[14px]"
        onClick={() => {
                      if (canChangeNameAndSlug) {
                        setIsEditingSlug(true)
                      }
                    }}
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
          <label className=" flex justify-between  text-[11.5px] lg:text-[14px] font-semibold text-[#646464] mb-2">
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
                className="ml-1 lg:text-xs text-[8px] text-muted-foreground"
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
              <Skeleton className="h-9 lg:w-103 w-[280px] rounded-none" />
            ) : (
           <div
  className="w-full px-3 py-2 bg-gray-100 min-h-[30px] cursor-pointer 
             hover:bg-gray-200 uppercase font-medium text-[#10414d] 
             text-[11.5px] lg:text-[14px] truncate"
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
    {/* Left section (heading + description) */}
    <div>
      <h3 className="text-[11.5px] lg:text-[15px] font-semibold text-[#4d4d4d]">
        Delete Workspace
      </h3>
      <p className="text-[10px] lg:text-[14px] font-medium text-muted-foreground/90 mt-1 max-w-2xl">
        Deleting this workspace will remove all projects, files, and members linked to it. 
        Once deleted, the data cannot be recovered.
      </p>
    </div>

    {/* Right section (Delete button + dialog) */}
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent font-medium text-[8.9px] px-[48px] lg:px-5  lg:py-2 py-3 rounded-2xl w-[82px] h-[23px] lg:h-full lg:w-auto"
          disabled={deletepending || !canDeleteWorkspace}
        >
          {deletepending ? "Deleting..." : "Delete Workspace"}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[672px] rounded-none -p-0.5 p-3.5"
        showCloseButton={false}
      >
        <div className="border-b-[0.5px] border-[#c7c7c7] pb-5 -mx-4">
          <div className="px-4 flex flex-col gap-y-2">
            <DialogTitle className="lg:text-[22px] text-[15px] font-semibold text-gray-900">
              Are you sure you want to delete this workspace?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-[11.5px] lg:text-[15px]">
              This will permanently delete all the data in this workspace.
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 my-1">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="rounded-full bg-transparent lg:text-sm text-[10px]  h-7.5"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletepending || (!permsPending && !canDeleteWorkspace)}
            className="rounded-full lg:text-sm text-[10px] h-7.5"
          >
            {deletepending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>

    </div>
  )
}

export default WorkspaceSettingsProfile
