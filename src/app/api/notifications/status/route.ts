// app/api/notifications/status/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const workspaceSlug = searchParams.get('workspaceSlug')

  if (!userId || !workspaceSlug) {
    return NextResponse.json({ hasUnread: false })
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  })

  if (!workspace) {
    return NextResponse.json({ hasUnread: false })
  }

  const count = await prisma.notification.count({
    where: {
      userId,
      workspaceId: workspace.id,
      read: false,
    },
  })

  return NextResponse.json({ hasUnread: count > 0 })
}
