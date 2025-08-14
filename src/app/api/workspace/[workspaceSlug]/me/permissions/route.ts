import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserInfo } from '@/lib/auth-server'

// GET /api/workspace/[workspaceSlug]/me/permissions
export async function GET(
  _req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = await params
    if (!workspaceSlug) {
      return NextResponse.json(
        { status: 'error', message: 'workspaceSlug is required' },
        { status: 400 }
      )
    }

    const user = await getUserInfo()
    if (!user?.userId) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })
    if (!workspace) {
      return NextResponse.json(
        { status: 'error', message: 'Workspace not found' },
        { status: 404 }
      )
    }

    const member = await prisma.member.findFirst({
      where: { userId: user.userId, workspaceId: workspace.id },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: { select: { id: true } } },
            },
          },
        },
      },
    })

    if (!member || !member.role) {
      return NextResponse.json(
        { status: 'error', message: 'Not a member of this workspace' },
        { status: 403 }
      )
    }

    const permissionIds = new Set<string>(
      (member.role.permissions || []).map((rp) => rp.permission.id)
    )

    // Fallback: treat Owner as having delete permission if your DB seed might lack it
    if (member.role.name?.toLowerCase() === 'owner') {
      permissionIds.add('workspace:delete')
    }

    return NextResponse.json({
      status: 'success',
      permissions: Array.from(permissionIds),
    })
  } catch (err) {
    console.error(
      'GET /api/workspace/[workspaceSlug]/me/permissions error:',
      err
    )
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
