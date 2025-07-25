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
