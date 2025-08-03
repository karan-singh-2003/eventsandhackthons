import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserInfo } from '@/lib/auth-server'

// Utility to convert workspace name to slug
function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove non-word characters
    .replace(/\-\-+/g, '-')       // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, '')      // Trim leading/trailing dashes
}
import { format } from 'date-fns'

export async function POST(req: Request) {
  try {
    const { name, workspaceSlug } = await req.json()
    const user = await getUserInfo()

    if (!user?.userId) {
      return NextResponse.json({ message: 'Unauthorized - No user found' }, { status: 401 })
    }

    if (!name || !workspaceSlug) {
      return NextResponse.json({ message: 'Missing name or workspace slug' }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json({ message: 'Workspace not found' }, { status: 404 })
    }

    const oldName = workspace.name

    const member = await prisma.member.findFirst({
      where: {
        userId: user.userId,
        workspaceId: workspace.id,
      },
    })

    if (!member) {
      return NextResponse.json({ message: 'You are not a member of this workspace' }, { status: 403 })
    }

    const newSlug = slugifyName(name)

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        name,
        slug: newSlug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    await prisma.user.update({
      where: { id: user.userId },
      data: {
        lastActiveWorkspaceId: updatedWorkspace.id,
      },
    })

    // ✅ Get user name from database
    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { name: true },
    })

    // ✅ Format date as readable string
    const today = format(new Date(), 'MMMM dd, yyyy') // e.g., July 29, 2025

    // ✅ Create notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        workspaceId: workspace.id,
        message: `${userInfo?.name || 'User'} renamed workspace from "${oldName}" to "${name}" on ${today}`,
      },
    })

    return NextResponse.json(
      {
        message: 'Workspace renamed successfully',
        workspace: updatedWorkspace,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error updating workspace:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
