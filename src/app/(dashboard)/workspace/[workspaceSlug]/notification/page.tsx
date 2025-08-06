'use client'

import { getUserNotifications, markNotificationsAsRead } from '@/actions/user'
import { formatDistanceToNow } from 'date-fns'
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

  const {
    data: fetchedNotifications,
    isPending,
  } = useQueryData(
    ['notifications', userId, workspaceSlug],
    () => getUserNotifications(userId, workspaceSlug),
    !!workspaceSlug && !!userId
  )

 const queryClient = useQueryClient()

useEffect(() => {
  if (fetchedNotifications?.notifications?.length) {
    setNotifications(fetchedNotifications.notifications)

    if (fetchedNotifications.hasUnread) {
      markNotificationsAsRead()
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ['notifications-status', workspaceSlug],
          })
        })
        .catch((err) =>
          console.error('Failed to mark notifications as read', err)
        )
    }
  }
}, [fetchedNotifications, workspaceSlug])

  return (
    <div className="p-4  ">
      <h1 className="lg:text-2xl text-2xl font-bold lg:mb-7  text-foreground">Notifications</h1>

      {isPending ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx}>
              <Skeleton className="lg:h-5 h-8 lg:w-3/4 w-2/2 mb-2 rounded-none" />
              <Skeleton className="h-4 w-1/4 rounded-none" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <ul className="space-y-4 lg:mb-1 mb-[47px]">
          {notifications.map((notify, index) => (
            <li key={notify.id} className="bg-background">
              <p className="font-semibold lg:text-sm text-xs lg:my-1 my-3  text-foreground">{notify.message}</p>
              <span className="lg:text-sm text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notify.createdAt))} ago
              </span>
              {index < notifications.length - 1 && (
                <hr className="my-4 border-t border-gray-200 dark:border-[#414141]" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotificationsPage
