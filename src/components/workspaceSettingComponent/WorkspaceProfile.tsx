"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { useParams, useRouter } from "next/navigation"
import clsx from "clsx"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import { useQueryData } from "@/hooks/useQueryData"
import { getWorkspaceBySlug } from "@/actions/usegetWorkspacebySlug"
import { getColorForString } from "@/utils/getColors"
import useRenameWorkspace from "@/hooks/useRenameWorkspace"
import { useDeleteWorkspace } from "@/hooks/useDeleteWorkspace"
import { updateWorkspaceSchema } from "@/Schemas/updateWorkspaceNameSchema"

const WorkspaceSettingsProfile = () => {
  const { workspaceSlug } = useParams()
  const router = useRouter()

  const {
    data: workspaceData,
    isPending,
    isFetching,
  } = useQueryData(
    ["workspaces", workspaceSlug],
    () => getWorkspaceBySlug({ workspaceSlug: workspaceSlug as string }),
    true,
  )

  const { data: Workspaces = { data: [] }, isPending: workspacePending } = useQueryData(
    ["workspaces"],
    async () => {
      const res = await fetch("/api/workspace/getworkspaces")
      if (!res.ok) throw new Error("Failed to fetch workspaces")
      return res.json()
    },
    true,
  )

  const workspaces: any[] = Workspaces?.data ?? []

  const { mutate: renameWorkspace, isPending: isRenaming, serverError } = useRenameWorkspace()

  const { mutate: deleteWorkspace, isPending: deletepending } = useDeleteWorkspace({
    workspaceSlug: workspaceSlug as string,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    mode: "onChange",
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingSlug, setIsEditingSlug] = useState(false)

  // Set form values on fetch
  useEffect(() => {
    if (workspaceData?.workspace) {
      setValue("name", workspaceData.workspace.name)
      setValue("slug", workspaceData.workspace.slug)
    }
  }, [workspaceData, setValue])

  const bgColor = getColorForString(workspaceData?.workspace?.name || "")

  const handleSave = (data: { name: string; slug: string }) => {
    const payload: { name?: string; slug?: string } = {}

    const currentName = workspaceData?.workspace?.name
    const currentSlug = workspaceData?.workspace?.slug

    if (data.name && data.name !== currentName) {
      payload.name = data.name
    }

    if (data.slug && data.slug !== currentSlug) {
      payload.slug = data.slug
    }

    if (Object.keys(payload).length > 0) {
      renameWorkspace({ workspaceId: workspaceData?.workspace?.id, ...payload })
    }

    setIsEditingName(false)
    setIsEditingSlug(false)
  }

  const handleDelete = () => {
    deleteWorkspace()
    const remainingWorkspaces = workspaces.filter((ws) => ws.workspaceSlug !== workspaceSlug)
    const fallbackworkspaceSlug = remainingWorkspaces[0]?.workspaceSlug
    router.push("/")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(handleSave)()
    }
  }

  return (
    <div className=" mx-auto p-1 mb-[95px] lg:mb-1">
      {/* Header with tabs */}
     

      {/* Avatar and Upload Picture Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
       <div className="flex flex-col items-center lg:items-center lg:flex-row gap-4 lg:gap-4">

          <div
            className={clsx(
              "w-16 h-16  lg:w-[52px] lg:h-[52px]   mx-auto lg:mx-0     rounded-full flex items-center justify-center text-xl lg:text-lg  font-semibold text-black shadow-md",
            )}
            style={{ backgroundColor: bgColor }}
          >
            {workspaceData?.workspace?.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span className="text-lg lg:text-[14px] text-center lg:text-left  font-semibold text-black uppercase">
              {isPending || isFetching ? "Loading..." : workspaceData?.workspace?.name || "Workspace"}
            </span>
            <span className="text-xs  lg:text-[13px] text-center lg:text-left text-gray-500">JPG, PNG. Recommended size is 256x256px</span>
          </div>
           <Button variant="outline" className="w-full lg:w-auto border border-[#6F6D6D] bg-transparent text-sm lg:text-[11px] px-4 lg:ml-[102px] lg:py-1 lg:px-6 py-2  rounded-2xl text-[#464545]" 
        size='sm'
        >
          Upload picture
        </Button>
        </div>

        {/* Upload Picture Button - positioned to the right on desktop */}
       
      </div>

      {/* Error Messages */}
      {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
      {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name.message}</p>}
      {errors.slug && <p className="text-red-500 text-sm mb-4">{errors.slug.message}</p>}

      {/* Form Fields */}
      <div className="space-y-6 ">
        {/* Workspace Name Field */}
        <div>
          <label className="block text-sm lg:text-[14px] text-[#646464]  font-semibold  mb-2">Workspace Name</label>
          <div className="w-full lg:w-[411px]">
            {isEditingName ? (
              <input
                {...register("name")}
                type="text"
                onBlur={handleSubmit(handleSave)}
                onKeyDown={handleKeyDown}
                className="w-full  px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-[14px] focus:border-blue-500 uppercase font-semibold text-[#10414d]"
              />
            ) : (
              <div
                className="w-full px-3 py-2 bg-gray-100  cursor-pointer hover:bg-gray-200 uppercase font-medium text-[#10414d] text-sm lg:text-[14px]"
                onClick={() => setIsEditingName(true)}
              >
                {isPending || isFetching ? "Loading..." : workspaceData?.workspace?.name || "Workspace"}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Slug Field */}
        <div>
          <label className="block text-sm lg:text-[14px] font-semibold text-[#646464]  mb-2">Workspace Slug</label>
          <div className="w-full lg:w-[411px]">
            {isEditingSlug ? (
              <input
                {...register("slug")}
                type="text"
                onBlur={handleSubmit(handleSave)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-[14px] focus:border-blue-500 lowercase font-semibold text-[#10414d]"
              />
            ) : (
              <div
                className="w-full px-3 py-2 bg-gray-100  cursor-pointer hover:bg-gray-200 lowercase font-medium text-[#10414d] text-sm lg:text-[14px]"
                onClick={() => setIsEditingSlug(true)}
              >
                {isPending || isFetching ? "Loading..." : workspaceData?.workspace?.slug || "workspace-slug"}
              </div>
            )}
          </div>
        </div>

        {/* Workspace ID Field */}
        <div>
          <label className="block text-sm lg:text-[14px] font-semibold text-[#646464] mb-2">
            Workspace Id
            <button className="ml-2 text-xs text-blue-600 hover:text-blue-800">copy</button>
          </label>
          <div className="w-full lg:w-[411px] px-3 py-2 bg-gray-100  font-mono text-sm text-[#10414d] lg:text-[14px]" >
            {isPending || isFetching ? "Loading..." : workspaceData?.workspace?.id || "workspace-id"}
          </div>
        </div>
      </div>

      {/* Delete Workspace Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-sm lg:text-[14px] font-semibold text-[#696767]">Delete Workspace</h3>
           <div className="lg:flex">

            <p className="text-xs lg:text-[13px] text-gray-600 mt-1">The Workspace will be permanently deleted</p>

              <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline" size='sm'
                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent font-medium text-sm  lg:px-3 px-4 py-2 w-full lg:w-auto  lg:mt-0 mt-[16px] lg:ml-[179px] rounded-2xl"
                disabled={deletepending}
                >
                {deletepending ? "Deleting..." : "Delete Workspace"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you absolutely sure you want to delete this workspace? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-lg px-4 py-2 bg-transparent">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deletepending}
                  className="rounded-lg px-4 py-2"
                  >
                  {deletepending ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
                  </div>
          </div>

        
        </div>
      </div>
    </div>
  )
}

export default WorkspaceSettingsProfile
