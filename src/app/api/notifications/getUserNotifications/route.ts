// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // make sure your prisma client is here

// GET /api/notifications?userId=xxx&workspaceSlug=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const workspaceSlug = searchParams.get('workspaceSlug');

    if (!workspaceSlug || !userId) {
      return NextResponse.json(
        { notifications: [], hasUnread: false },
        { status: 200 }
      );
    }

    // Find workspace by slug
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      return NextResponse.json(
        { notifications: [], hasUnread: false },
        { status: 200 }
      );
    }

    const workspaceId = workspace.id;

    const notifications = await prisma.notification.findMany({
      where: { userId, workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        workspaceId,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      hasUnread: unreadCount > 0,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
