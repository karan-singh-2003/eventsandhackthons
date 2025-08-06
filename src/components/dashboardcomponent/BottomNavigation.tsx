'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getRoutes } from '@/lib/navigationRoute'
import { useQueryData } from '@/hooks/useQueryData'
import { getAuthData } from '@/lib/auth-client'
import { MoreHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'

export default function BottomNavigation() {
  const { workspaceSlug } = useParams()
  const pathname = usePathname()

  if (!workspaceSlug) return null

  const authData = getAuthData()
  const userId = authData?.userInfo?.userId

  const { data: notificationStatus } = useQueryData(
    ['notifications-status', workspaceSlug],
    () =>
      fetch(
        `/api/notifications/status?workspaceSlug=${workspaceSlug}&userId=${userId}`
      ).then((res) => res.json()),
    !!workspaceSlug && !!userId
  )

  const hasUnread = notificationStatus?.hasUnread

  const baseRoutes = getRoutes(workspaceSlug as string)
  const routes = baseRoutes.map((route) => ({
    ...route,
    showDot: route.label === 'Notification' && hasUnread,
  }))

  const visibleRoutes = routes.slice(0, 3)
  const menuRoutes = routes.slice(3)

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-300 lg:hidden">
      <div className="grid grid-cols-4 px-2 py-3">
        {visibleRoutes.map((item) => {
          const isActive = pathname === item.href
          const iconSrc = isActive ? item.activeIcon : item.icon

          return (
            <Link
              href={item.href}
              key={item.href}
              className="relative flex flex-col items-center justify-center py-1"
              aria-label={item.label}
            >
              <Image
                src={iconSrc || '/placeholder.svg'}
                alt={item.label}
                width={24}
                height={24}
                className={cn(
                  'mb-1 transition-opacity duration-150',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              />
              {item.showDot && (
                <span
                  className="absolute top-0 right-[12px] h-2 w-2 rounded-full bg-red-600 shadow"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'text-xs font-bold',
                  isActive ? 'text-blue-900' : 'text-gray-600'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* More menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="relative flex flex-col items-center justify-center py-1 text-gray-600"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-auto  rounded-t-xl"
          >
            <SheetHeader className="p-3">
              <SheetTitle className="font-bold text-center text-xl">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="grid grid-cols-3 gap-2 pb-4">
              {menuRoutes.map((item) => {
                const isActive = pathname === item.href
                const iconSrc = isActive ? item.activeIcon : item.icon

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex flex-col items-center justify-center py-2"
                      aria-label={item.label}
                    >
                      <Image
                        src={iconSrc || '/placeholder.svg'}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="mb-1"
                      />
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          isActive ? 'text-blue-900' : 'text-gray-600'
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
