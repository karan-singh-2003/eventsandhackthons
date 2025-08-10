import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/workspace?action=xxx&...params
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const action = searchParams.get('action')

    switch (action) {
      case 'getInviteWorkspace': {
        const token = searchParams.get('token')
        if (!token) {
          return NextResponse.json(
            { error: 'token is required' },
            { status: 400 }
          )
        }

        const invite = await prisma.invite.findUnique({
          where: { token },
          include: {
            workspace: true,
            role: true,
          },
        })

        if (!invite) {
          return NextResponse.json(
            { status: 404, invite: 'Invalid or expired invite.' },
            { status: 404 }
          )
        }

        if (invite.expiresAt < new Date()) {
          return NextResponse.json(
            { status: 410, invite: 'This invite link has expired.' },
            { status: 410 }
          )
        }

        const members = await prisma.member.findMany({
          where: { workspaceId: invite.workspaceId },
          include: { user: true, role: true },
        })

        const workspaceData = {
          approvalRequired: invite.linkPublic ?? false,
          workspace: {
            id: invite.workspace.id,
            name: invite.workspace.name,
            slug: invite.workspace.slug,
            imageUrl: null,
            createdAt: invite.workspace.createdAt,
            members: members.map((m) => ({
              id: m.id,
              userId: m.userId,
              workspaceId: m.workspaceId,
              role: m.role?.name ?? undefined,
              user: {
                id: m.user.id,
                name: m.user.name ?? m.user.email ?? 'User',
                email: m.user.email ?? '',
                createdAt: m.user.createdAt,
                updatedAt: m.user.updatedAt,
              },
            })),
            allowAutoJoin: false,
            createdById: invite.workspace.createdById,
          },
        }

        return NextResponse.json(
          { status: 200, invite: workspaceData },
          { status: 200 }
        )
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GET /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workspace - Update operations (placeholders)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'updateMemberRole':
        return NextResponse.json(
          { message: 'updateMemberRole not implemented' },
          { status: 501 }
        )
      case 'approveJoinRequest':
        return NextResponse.json(
          { message: 'approveJoinRequest not implemented' },
          { status: 501 }
        )
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('PUT /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workspace - Delete operations (placeholders)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'removeMember':
        return NextResponse.json(
          { message: 'removeMember not implemented' },
          { status: 501 }
        )
      case 'cancelInvitation':
        return NextResponse.json(
          { message: 'cancelInvitation not implemented' },
          { status: 501 }
        )
      case 'rejectJoinRequest':
        return NextResponse.json(
          { message: 'rejectJoinRequest not implemented' },
          { status: 501 }
        )
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('DELETE /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
