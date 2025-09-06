"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import * as Tooltip from "@radix-ui/react-tooltip"
import { getRoutes, type NavigationRoute } from "@/lib/navigationRoute"
import { useQueryData } from "@/hooks/useQueryData"
import { getUserInfo } from "@/lib/auth-client"
import { useMobileSidebar } from "./WorkspaceSlider"
import NavigationRoutesecond from "@/lib/NavigationRoutesecond"
import { usePanelStore } from "@/store/modal-slice" // ✅ import panel store

function Navigation() {
  const { workspaceSlug } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const { close } = useMobileSidebar()
  const { setIsOpen } = usePanelStore()// ✅ get setter from panel store

  const userInfo = getUserInfo()
  const userId = userInfo?.userId
  const routes = getRoutes(workspaceSlug as any)
  const { data: notificationData } = useQueryData(
    ["notifications-status", workspaceSlug],
    () =>
      fetch(
        `/api/notifications/status?workspaceSlug=${workspaceSlug}&userId=${userId}`,
      ).then((res) => res.json()),
    !!workspaceSlug && !!userId,
  )

  const hasUnread = notificationData?.hasUnread

  const handleNavigation = (item: NavigationRoute) => {
    // ✅ always close panel when navigating
    setIsOpen(false)

    if (item.action === "dialog" && item.onClick) {
      item.onClick()
      close()
      return
    }

    if (item.action === "function" && item.onClick) {
      item.onClick()
      close()
      return
    }

    if (item.href) {
      let fullHref = item.href
      if (item.href.includes("[workspaceSlug]") && workspaceSlug) {
        fullHref = item.href.replace("[workspaceSlug]", workspaceSlug as string)
      }
      close()
      router.push(fullHref)
    }
  }

  return (
    <>
      <Tooltip.Provider delayDuration={150}>
        <ul className="flex flex-col items-center space-y-1.5 mt-2">
          {routes.map((item: NavigationRoute) => {
            let itemFullHref = item.href || ""
            if (item.href && item.href.includes("[workspaceSlug]") && workspaceSlug) {
              itemFullHref = item.href.replace("[workspaceSlug]", workspaceSlug as string)
            }

            const isActive = pathname === itemFullHref
            const IconComponent = isActive ? item.activeIcon : item.icon
            const showDot = item.label === "Notification" && hasUnread

            return (
              <Tooltip.Root key={item.href || item.label}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      "group rounded-none transition-all w-full lg:h-[38px] h-[32px] p-2 flex items-center justify-center relative",
                      "hover:bg-gray-100 focus:outline-none",
                      isActive ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-700",
                    )}
                    aria-label={item.label}
                  >
                    <IconComponent className="w-[17px] h-[17px] lg:w-[21px] lg:h-[21px]" />
                    {showDot && (
                      <span className="absolute top-[6px] right-[12px] w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="z-50 rounded-none bg-white px-1.5 py-1.5 text-xs text-black"
                  >
                    {item.label}
                    <Tooltip.Arrow className="fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            )
          })}
        </ul>
      </Tooltip.Provider>
      <Separator className="lg:my-4 my-3 bg-gray-300" />
      <NavigationRoutesecond />
    </>
  )
}

export default Navigation
