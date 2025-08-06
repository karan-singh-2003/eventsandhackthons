"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"
import { useDeleteWorkspace } from "@/hooks/useDeleteWorkspace"
import { useQueryData } from "@/hooks/useQueryData"
import { useCallback } from "react"

const WorkspaceSettingMain: React.FC = () => {
  const { workspaceSlug } = useParams()
  const router = useRouter()

 

 
  const {
      data: Workspaces = { data: [] },
      isPending:worspacePending,
      isFetching,
    } = useQueryData(['workspaces'], async () => {
      const res = await fetch('/api/workspace/getworkspaces');
      if (!res.ok) throw new Error('Failed to fetch workspaces');
      return res.json();
    }, true);
  
  const workspaces: any[] = Workspaces?.data ?? []

  const { mutate: deleteWorkspace, isPending: deletepending } = useDeleteWorkspace({
    workspaceSlug: workspaceSlug as string,
  })

  const handleDelete = () => {
    deleteWorkspace()
    const remainingWorkspaces = workspaces.filter((ws) => ws.workspaceSlug !== workspaceSlug)
    const fallbackworkspaceSlug = remainingWorkspaces[0]?.workspaceSlug
    if (fallbackworkspaceSlug) {
      router.push(`/`)
    } else {
      router.push(`/`)
    }
  }

  return (
    <div className="mt-4 p-4 border-t border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between lg:mb-1 mb-[56px]">
      <div className="flex flex-col gap-2 mb-3 md:mb-0">
        <div className="lg:text-xl text-sm font-semibold text-gray-900">Delete Workspace</div>
        <p className="lg:text-sm text-xs lg:w-full  text-gray-600">
          This action will be permanently delete this workspace.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent rounded-lg lg:px-6 px-6 lg:py-3 py-3  font-medium w-full md:w-auto transition-colors duration-200 lg:text-sm text-xs sm:ml-[119px] "
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
              {/* Removed whitespace here */}
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
  )
}

export default WorkspaceSettingMain
