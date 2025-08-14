import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'

type RevokeBody = {
  token?: string
  email?: string
  workspaceSlug?: string
}

export async function POST(req: NextRequest) {
  try {
    const { userInfo } = await getAuthData()
    if (!userInfo?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as RevokeBody
    const { token, email, workspaceSlug } = body

    if (!token && !(email && workspaceSlug)) {
      return NextResponse.json(
        { error: 'Provide a token or email+workspaceSlug' },
        { status: 400 }
      )
    }

    // If token provided, revoke that specific invite
    if (token) {
      const invite = await prisma.invite.findUnique({ where: { token } })
      if (!invite) {
        return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
      }

      await prisma.invite.update({
        where: { token },
        data: { disabled: true, status: 'REJECTED' },
      })

      return NextResponse.json({ success: true })
    }

    // Otherwise, revoke pending one-time invites for this email in the workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug! },
      select: { id: true },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    const result = await prisma.invite.updateMany({
      where: {
        workspaceId: workspace.id,
        email: email!,
        isLink: false,
        disabled: false,
        status: 'PENDING',
      },
      data: { disabled: true, status: 'REJECTED' },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'No pending invites found for this user' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, revoked: result.count })
  } catch (err) {
    console.error('Error revoking invite:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
