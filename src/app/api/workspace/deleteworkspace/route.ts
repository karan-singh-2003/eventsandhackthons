import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserInfo } from '@/lib/auth-server'
import { format } from 'date-fns'

export async function POST(req: Request) {
  try {
    const { workspaceSlug } = await req.json()

    const user = await getUserInfo()

    if (!user?.userId) {
      return NextResponse.json({ message: 'Unauthorized - No user found' }, { status: 401 })
    }

    if (!workspaceSlug) {
      return NextResponse.json({ message: 'Missing workspace slug' }, { status: 400 })
    }

    // ✅ Fetch workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json({ message: 'Workspace not found' }, { status: 404 })
    }

    // ✅ Check if the user is a member of the workspace
    const member = await prisma.member.findFirst({
      where: {
        userId: user.userId,
        workspaceId: workspace.id,
      },
    })

    if (!member) {
      return NextResponse.json({ message: 'You are not a member of this workspace' }, { status: 403 })
    }

    // ✅ Delete workspace
    const deletedWorkspace = await prisma.workspace.delete({
      where: { id: workspace.id },
      select: { id: true, name: true, slug: true },
    })

    // ✅ Find another workspace the user is a member of (excluding the deleted one)
    const nextWorkspace = await prisma.member.findFirst({
      where: {
        userId: user.userId,
        workspaceId: { not: workspace.id },
      },
      include: {
        workspace: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })

    // ✅ Update user's last active workspace to next available one (if any)
    if (nextWorkspace?.workspace?.id) {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          lastActiveWorkspaceId: nextWorkspace.workspace.id,
        },
      })
    } else {
      // ❌ No other workspace left — remove active workspace
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          lastActiveWorkspaceId: null,
        },
      })
    }

    // ✅ Get user name from DB
    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { name: true },
    })

    const today = format(new Date(), 'MMMM dd, yyyy')

    // ✅ Create notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        message: `${userInfo?.name || 'User'} deleted workspace "${workspace.name}" on ${today}`,
      },
    })

    return NextResponse.json({
      message: 'Workspace deleted successfully',
      workspace: deletedWorkspace,
      newActiveWorkspace: nextWorkspace?.workspace || null,
    }, { status: 200 })

  } catch (error) {
    console.error('Error deleting workspace:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
