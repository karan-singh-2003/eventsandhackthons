'use server'

import { prisma } from '../lib/prisma'

export const createNotification = async ({
  userId,
  message,
  workspaceId,
}: {
  userId: string
  message: string
  workspaceId?: string
}) => {
  return prisma.notification.create({
    data: {
      userId,
      message,
      workspaceId,
    },
  })
}


export async function getWorkspaceBySlugForUser(
  workspaceSlug: string,
  userEmail: string
) {
  return prisma.workspace.findFirst({
    where: {
      slug: workspaceSlug,
      OR: [
        {
          createdBy: {
            email: userEmail,
          },
        },
        {
          members: {
            some: {
              user: {
                email: userEmail,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdById: true,
      members: true,
    },
  })
}
  
import { getAuthData } from '@/lib/auth-server'

interface NotificationsResponse {
  notifications: {
    id: string
    message: string
    createdAt: Date
    read: boolean
    workspaceId: string
    userId: string
  }[]
  hasUnread: boolean
}



export async function getUserNotifications(
  userId: any,
  workspaceSlug: any
) {
  if (!workspaceSlug || !userId) {
    return { notifications: [], hasUnread: false }
  }

  // Find workspace by slug to get ID
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  })

  if (!workspace) {
    return { notifications: [], hasUnread: false }
  }

  const workspaceId = workspace.id

  const notifications = await prisma.notification.findMany({
    where: { userId, workspaceId },
    orderBy: { createdAt: 'desc' },
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      workspaceId,
      read: false,
    },
  })

  return {
    notifications,
    hasUnread: unreadCount > 0,
  }
}


export const markNotificationsAsRead = async () => {
  const authData = await getAuthData()
  const userId = authData?.userInfo?.userId

  if (!userId) return

  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  })
}