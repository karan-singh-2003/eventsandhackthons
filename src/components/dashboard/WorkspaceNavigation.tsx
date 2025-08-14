'use client'

import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'
import { getRoutes, type NavigationRoute } from '@/lib/navigationRoute'
import { useQueryData } from '@/hooks/useQueryData'
import { getUserInfo } from '@/lib/auth-client'
import { Button } from '../ui/button'

function Navigation() {
  const { workspaceSlug } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const userInfo = getUserInfo()
  const userId = userInfo?.userId
  const routes = getRoutes(workspaceSlug as any)
  // 🔴 Fetch unread notification status
  const { data: notificationData } = useQueryData(
    ['notifications-status', workspaceSlug],
    () =>
      fetch(
        `/api/notifications/status?workspaceSlug=${workspaceSlug}&userId=${userId}`
      ).then((res) => res.json()),
    !!workspaceSlug && !!userId
  )

  const hasUnread = notificationData?.hasUnread

  const handleNavigation = (item: NavigationRoute) => {
    let fullHref = item.href
    if (item.href.includes('[workspaceSlug]') && workspaceSlug) {
      fullHref = item.href.replace('[workspaceSlug]', workspaceSlug as string)
    }

    router.push(fullHref)
  }

  return (
    <>
      <Tooltip.Provider delayDuration={150}>
        <ul className="flex flex-col items-center space-y-2 mt-2">
          {routes.map((item: NavigationRoute) => {
            let itemFullHref = item.href
            if (item.href.includes('[workspaceSlug]') && workspaceSlug) {
              itemFullHref = item.href.replace(
                '[workspaceSlug]',
                workspaceSlug as string
              )
            }

            const isActive = pathname === itemFullHref
            const iconSrc = isActive ? item.activeIcon : item.icon

            const showDot = item.label === 'Notification' && hasUnread

            return (
              <Tooltip.Root key={item.href}>
                <Tooltip.Trigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      'group rounded-none transition-all p-2  flex items-center justify-center relative',
                      isActive
                        ? 'bg-gray-100 text-orange-600'
                        : 'hover:bg-gray-100'
                    )}
                    aria-label={item.label}
                  >
                    <Image
                      src={iconSrc || '/placeholder.svg'}
                      alt={item.label}
                      width={20}
                      height={20}
                      className="w-[28px] h-[28px]"
                    />
                    {/* 🔴 Red dot for unread notifications */}
                    {showDot && (
                      <span className="absolute top-[6px] right-[12px]  w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="z-50 rounded-none bg-white px-1.5 py-1.5 text-xs text-black "
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
      <Separator className="my-4 bg-gray-300" />
      <div className="flex flex-col items-center space-y-2 my-2">
        <Image
          src="/searchicon.svg"
          alt="Search Icon"
          width={20}
          height={20}
          className="w-[19px] h-[19px]"
        />
      </div>
    </>
  )
}

export default Navigation
