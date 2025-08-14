'use server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: {
        id: true,
        members: {
          include: {
            user: true,
            role: true,
          },
          orderBy: { joinedAt: 'desc' },
        },
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { status: 'error', message: 'Workspace not found' },
        { status: 404 }
      )
    }

    const memberRows = workspace.members.map((m) => ({
      id: m.id,
      name: m.user.name ?? m.user.universityId ?? 'Unknown',
      role: m.role.name,
      email: m.user.email ?? '',
      URN: m.user.universityId,
      dateAdded: m.joinedAt?.toISOString() ?? null,
      status: 'Active' as const,
      lastActive: (m.user.lastActiveAt ?? null)?.toISOString() ?? null,
    }))

    // Also include pending one-time email invites (isLink=false) for this workspace
    const pendingInvites = await prisma.invite.findMany({
      where: {
        workspaceId: workspace.id,
        isLink: false,
        disabled: false,
        status: 'PENDING',
      },
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const inviteRows = pendingInvites.map((inv) => ({
      id: inv.id,
      name: inv.name ?? inv.email ?? 'Unknown',
      role: inv.role.name,
      email: inv.email ?? '',
      URN: inv.universityId ?? '',
      dateAdded: inv.createdAt.toISOString(),
      status: 'Invited' as const,
      lastActive: null as string | null,
    }))

    const members = [...memberRows, ...inviteRows]

    return NextResponse.json({ status: 'success', members })
  } catch (err) {
    console.error('GET /api/workspace/[workspaceSlug]/members error:', err)
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params
    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('memberId')

    if (!workspaceSlug || !memberId) {
      return NextResponse.json(
        { status: 'error', message: 'workspaceSlug and memberId are required' },
        { status: 400 }
      )
    }

    // Ensure member belongs to this workspace
    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) {
      return NextResponse.json(
        { status: 'error', message: 'Member not found' },
        { status: 404 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })
    if (!workspace || member.workspaceId !== workspace.id) {
      return NextResponse.json(
        { status: 'error', message: 'Member not in this workspace' },
        { status: 403 }
      )
    }

    await prisma.member.delete({ where: { id: memberId } })

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err) {
    console.error('DELETE /api/workspace/[workspaceSlug]/members error:', err)
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params
    const body = (await req.json()) as {
      memberId?: string
      roleId?: string
      roleName?: string
    }

    const { memberId, roleId, roleName } = body

    if (!workspaceSlug || !memberId) {
      return NextResponse.json(
        { status: 'error', message: 'workspaceSlug and memberId are required' },
        { status: 400 }
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

    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member || member.workspaceId !== workspace.id) {
      return NextResponse.json(
        { status: 'error', message: 'Member not found in this workspace' },
        { status: 404 }
      )
    }

    let newRoleId: string | null = null
    if (roleId) {
      const r = await prisma.role.findFirst({
        where: { id: roleId, workspaceId: workspace.id },
        select: { id: true },
      })
      if (!r) {
        return NextResponse.json(
          { status: 'error', message: 'Role not found in this workspace' },
          { status: 404 }
        )
      }
      newRoleId = r.id
    } else if (roleName) {
      const r = await prisma.role.findFirst({
        where: { name: roleName, workspaceId: workspace.id },
        select: { id: true },
      })
      if (!r) {
        return NextResponse.json(
          { status: 'error', message: 'Role not found in this workspace' },
          { status: 404 }
        )
      }
      newRoleId = r.id
    } else {
      return NextResponse.json(
        { status: 'error', message: 'Provide roleId or roleName' },
        { status: 400 }
      )
    }

    await prisma.member.update({
      where: { id: memberId },
      data: { roleId: newRoleId! },
    })

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err) {
    console.error('PUT /api/workspace/[workspaceSlug]/members error:', err)
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
