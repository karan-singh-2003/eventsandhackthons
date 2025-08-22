'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryData } from '@/hooks/useQueryData'
import { formatDistanceToNow } from 'date-fns'
import { getAuthData } from '@/lib/auth-client'
import type { Notification } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

function NotificationsPage() {
  const { workspaceSlug } = useParams()
  const authData = getAuthData()
  const userId = authData?.userInfo?.userId

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'unread' | 'all'>('unread')
  const [loadingUnread, setLoadingUnread] = useState(false)

  const queryClient = useQueryClient()

  // ALL notifications (unchanged)
  const { data: fetchedAll, isPending: isAllPending } = useQueryData(
    ['notifications-all', userId, workspaceSlug],
    async () => {
      const res = await fetch(
        `/api/notifications/getUserNotifications?userId=${userId}&workspaceSlug=${workspaceSlug}`
      )
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json()
    },
    !!workspaceSlug && !!userId
  )

  // When switching to UNREAD, consume them from API
  useEffect(() => {
    if (!workspaceSlug || !userId) return
    if (filter !== 'unread') return

    let cancelled = false
    ;(async () => {
      setLoadingUnread(true)
      try {
        const res = await fetch('/api/notifications/unreadnotification/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // if your auth uses cookies
          body: JSON.stringify({ workspaceSlug, limit: 50 }),
        })
        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`consume unread failed: ${res.status} ${msg}`)
        }
        const json = await res.json()
        if (!cancelled) {
          setNotifications(json.notifications || [])
          // refresh any unread badges elsewhere
          queryClient.invalidateQueries({
            queryKey: ['notifications-status', workspaceSlug],
          })
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) setNotifications([])
      } finally {
        if (!cancelled) setLoadingUnread(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [filter, workspaceSlug, userId, queryClient])

  // When on ALL, show all (sorted newest first locally)
  useEffect(() => {
    if (!fetchedAll?.notifications) return
    if (filter !== 'all') return

    const sorted = [...fetchedAll.notifications].sort(
      (a: Notification, b: Notification) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setNotifications(sorted)
  }, [fetchedAll, filter])

  const isPending = filter === 'all' ? isAllPending : loadingUnread

  return (
    <div className="lg:p-2 p-0 lg:mb-1 mb-[73px] mx-4">
  
   <div className="flex items-center lg:mt-0 mt-2  justify-between mb-5">
      <h1 className="lg:text-2xl text-[16px]   font-medium text-foreground">
        Notifications
      </h1>

 <ToggleGroup
    type="single"
    value={filter}
    onValueChange={(val: any) => val && setFilter(val)}
    className="flex rounded-xl border border-gray-200  "
  >
    <ToggleGroupItem
      value="unread"
      className="lg:px-4 lg:py-1 text-[8.5px] rounded-xl data-[state=on]:bg-gray-200 
                 h-[18px] w-[60px] lg:h-full lg:w-full lg:text-xs px-2 py-1"
    >
      Unread
    </ToggleGroupItem>
    <ToggleGroupItem
      value="all"
      className="lg:px-4 lg:py-1 text-[8.5px] rounded-xl data-[state=on]:bg-gray-200 
                 h-[18px] w-[60px] lg:text-xs lg:h-full lg:w-full px-2 py-1"
    >
      All
    </ToggleGroupItem>
  </ToggleGroup>
</div>


      {isPending ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="max-w-[800px]">
              <Skeleton className="lg:h-5 h-8 lg:w-3/4 w-full mb-2 rounded-none" />
              <Skeleton className="h-4 w-1/4 rounded-none my-2.5" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground text-[11.5px] lg:text-[14px] ">
          {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
        </p>
      ) : (
        <div className="space-y-4 lg:mb-1 mb-[47px] max-w-[800px]">
          {notifications.map((notify, index) => (
            <div key={notify.id} className="bg-background">
              <p className="font-medium lg:text-base lg:text-[11] text-[11px]">
                {notify.message}
              </p>
              {/* If you want relative time, import from 'date-fns' and use formatDistanceToNow */}
              <span className="lg:text-sm text-[9px] font-medium text-muted-foreground">
                {formatDistanceToNow(new Date(notify.createdAt))} ago
              </span>
              {index < notifications.length - 1 && (
                <hr className="my-3 border-t border-gray-200 dark:border-[#414141]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
