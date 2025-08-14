'use client'

import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { useQueryData } from '@/hooks/useQueryData'
import { useEffect, useState } from 'react'
import type { Notification } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthData } from '@/lib/auth-client'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

const NotificationsPage = () => {
  const { workspaceSlug } = useParams()
  const authData = getAuthData()
  const userId = authData?.userInfo?.userId

  const [notifications, setNotifications] = useState<Notification[]>([])

  const { data: fetchedNotifications, isPending } = useQueryData(
    ['notifications', userId, workspaceSlug],
    async () => {
      const res = await fetch(
        `/api/notifications/getUserNotifications?userId=${userId}&workspaceSlug=${workspaceSlug}`
      )
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json()
    },
    !!workspaceSlug && !!userId
  )

  const queryClient = useQueryClient()
  useEffect(() => {
    if (fetchedNotifications?.notifications?.length) {
      setNotifications(fetchedNotifications.notifications)

      if (fetchedNotifications.hasUnread) {
        fetch('/api/notifications/markReadNotifications', { method: 'POST' })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to mark as read')
            queryClient.invalidateQueries({
              queryKey: ['notifications-status', workspaceSlug],
            })
          })
          .catch((err) =>
            console.error('Failed to mark notifications as read', err)
          )
      }
    }
  }, [fetchedNotifications, workspaceSlug, queryClient])

  return (
    <div className="lg:p-2  p-0 lg:mb-1 mb-[73px] mx-4">
      <h1 className="lg:text-2xl text-xl font-bold lg:mb-7  mb-3 text-foreground">
        Notifications
      </h1>

      {isPending ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="max-w-[800px]">
              <Skeleton className="lg:h-5 h-8 lg:w-3/4 w-2/2 mb-2 rounded-none" />
              <Skeleton className="h-4 w-1/4 rounded-none my-2.5" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-4 lg:mb-1 mb-[47px] max-w-[800px]">
          {notifications.map((notify, index) => (
            <div key={notify.id} className="bg-background">
              <p className="font-medium  lg:text-base text-sm    ">
                {notify.message}
              </p>
              <span className="lg:text-sm text-xs font-medium text-muted-foreground">
                {formatDistanceToNow(new Date(notify.createdAt))} ago
              </span>
              {index < notifications.length - 1 && (
                <hr className="my-4 border-t border-gray-200 dark:border-[#414141]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
