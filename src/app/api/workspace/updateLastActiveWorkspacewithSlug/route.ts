import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthData } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { workspaceSlug } = await req.json();

    if (!workspaceSlug) {
      return NextResponse.json({ error: 'Workspace slug is required' }, { status: 400 });
    }

    const { userInfo } = await getAuthData();
    if (!userInfo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userInfo.userId },
      data: {
        lastActiveWorkspaceId: workspace.id,
      },
    });

    return NextResponse.json({ message: 'Last active workspace updated successfully' });
  } catch (err) {
    console.error('Error updating last active workspace:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
