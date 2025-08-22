// app/api/notifications/unread/consume/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'

export async function POST(req: Request) {
  try {
    const auth = await getAuthData()
    const userId = auth?.userInfo?.userId
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workspaceSlug, limit = 50 } = await req.json()

    if (!workspaceSlug) {
      return NextResponse.json({ error: 'workspaceSlug is required' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const data = await prisma.$transaction(async (tx) => {
      // 1) get latest unread (desc)
      const unread = await tx.notification.findMany({
        where: { userId, workspaceId: workspace.id, read: false },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
      })

      // 2) mark those as read
      if (unread.length) {
        await tx.notification.updateMany({
          where: { id: { in: unread.map((n) => n.id) } },
          data: { read: true },
        })
      }

      // 3) remaining unread count (after marking)
      const remainingUnread = await tx.notification.count({
        where: { userId, workspaceId: workspace.id, read: false },
      })

      return { unread, remainingUnread, consumedCount: unread.length }
    })

    return NextResponse.json({
      notifications: data.unread,          // the unread you *just* saw
      consumedCount: data.consumedCount,   // how many got marked read
      remainingUnread: data.remainingUnread,
    })
  } catch (err) {
    console.error('consume-unread error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
