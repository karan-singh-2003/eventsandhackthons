// app/api/user/workspaces/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserInfo } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getUserInfo();

    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all workspace memberships for this user
    const memberships = await prisma.member.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = memberships.map((m) => m.workspaceId);

    if (workspaceIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Fetch workspace info + member count
    const workspacesWithMeta = await Promise.all(
      workspaceIds.map(async (workspaceId) => {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        });

        const memberCount = await prisma.member.count({
          where: { workspaceId },
        });

          return {
          id: workspace?.id,
          workspaceName: workspace?.name,
          workspaceSlug: workspace?.slug, // <-- rename here
          memberCount,
        };
      })
    );

    return NextResponse.json({ data: workspacesWithMeta }, { status: 200 });
  } catch (err) {
    console.error('Workspace API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
