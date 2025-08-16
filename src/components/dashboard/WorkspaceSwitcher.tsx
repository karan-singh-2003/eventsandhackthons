"use client"
import { Button } from "../ui/button"
import { ChevronDown, Menu } from "lucide-react"
import ResponsiveMenuOrDrawer from "./ResponsiveMenuOrDrawer"
import WorkspaceSwitcherContent from "./WorkspaceSwitcherContent"
import { useParams, useRouter } from "next/navigation"
import { useQueryData } from "@/hooks/useQueryData"
import { Skeleton } from "../ui/skeleton"
import { useMobileSidebar } from "./WorkspaceSlider"

const WorkspaceSwitcher = () => {
  const { workspaceSlug } = useParams()
  const currentWorkspaceSlug = workspaceSlug
  const router = useRouter()
  const { toggle } = useMobileSidebar()

  const {
    data: workspaces = { data: [] },
    isPending,
    isFetching,
  } = useQueryData(
    ["workspaces"],
    async () => {
      const res = await fetch("/api/workspace/getworkspaces")
      if (!res.ok) throw new Error("Failed to fetch workspaces")
      return res.json()
    },
    true,
  )

  const currentWorkspace = workspaces.data.find((w: any) => w.workspaceSlug === currentWorkspaceSlug)

  const onSelect = async (workspaceSlug: string) => {
    try {
      await fetch("/api/workspace/updateLastActiveWorkspacewithSlug", {
        method: "POST",
        body: JSON.stringify({ workspaceSlug }),
      })
      router.push(`/workspace/${workspaceSlug}`)
    } catch (err) {
      console.error("Failed to update workspace:", err)
      router.push(`/workspace/${workspaceSlug}`)
    }
  }

  const isLoading = isPending || isFetching || !currentWorkspace?.workspaceName

  return (
    <ResponsiveMenuOrDrawer
      trigger={
        <div
          className="flex items-center gap-2 hover:bg-black/5 py-1.5 px-2 rounded-none w-full cursor-pointer"
          aria-label="Switch workspace"
        >
           <Button
        variant="outline"
        className="border-black/20 px-2 py-2 text-black/50 h-6 w-6 mr-1.5 text-[11.5px] bg-transparent lg:hidden"
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        aria-label="Toggle sidebar"
      >
        <Menu size={12} />
      </Button>

          {isPending ? (
            <Skeleton className="h-7 w-7 mr-1.5 rounded-none" />
          ) : (
          <Button
  variant="outline"
  className=" items-center justify-center border-black/20 h-6 w-6 mr-1.5 text-[11.5px] text-black/50 bg-transparent hidden lg:flex"
>
  {currentWorkspace ? currentWorkspace.workspaceName.slice(0, 2).toUpperCase() : "W"}
</Button>

          )}
          {isLoading ? (
            <Skeleton className="h-4 w-36 rounded-none" />
          ) : (
            <span className="font-semibold text-[15px] truncate">
              {currentWorkspace?.workspaceName ?? "Select Workspace"}
            </span>
          )}
          {!isLoading && <ChevronDown className="text-black/40" size={15} />}
        </div>
      }
    >
      <WorkspaceSwitcherContent
        workspaces={workspaces.data}
        currentWorkspaceSlug={currentWorkspaceSlug}
        onSelect={onSelect}
        onCreate={() => router.push("/onboarding/create-workspace")}
      />
    </ResponsiveMenuOrDrawer>
  )
}

export default WorkspaceSwitcher
