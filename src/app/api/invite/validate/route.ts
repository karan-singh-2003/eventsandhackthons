import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    const { userInfo } = await getAuthData()
    if (!userInfo) {
      return NextResponse.json(
        { valid: false, message: 'Unauthorized - No user info found' },
        { status: 401 }
      )
    }
    console.log('in validate invite route')
    console.log('User info:', userInfo)

    const { token } = await req.json()
    console.log('Received token:', token)
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      )
    }
    console.log('Validating invite token:', token)
    // Find the invite with the token
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    console.log('Invite found:', invite)
    if (!invite) {
      return NextResponse.json(
        { valid: false, message: 'Invalid invite token' },
        { status: 404 }
      )
    }

    // Check if invite is disabled
    if (invite.disabled) {
      return NextResponse.json(
        { valid: false, message: 'This invite has been disabled' },
        { status: 403 }
      )
    }

    // Check if invite has expired
    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'This invite has expired' },
        { status: 410 }
      )
    }

    // Check if user is already a member of the workspace
    const existingMember = await prisma.member.findFirst({
      where: {
        userId: userInfo.userId,
        workspaceId: invite.workspaceId,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { redirectTo: `/${invite.workspace.slug}` },
        { status: 200 }
      )
    }

    console.log('is user already in workspace', invite.email === userInfo.email)
    // Check if it's a one-time email invite that's already been used and if same user is trying to use it
    if (!invite.isLink && invite.usedAt && invite.email === userInfo.email) {
      return NextResponse.json(
        { redirectTo: `/${invite.workspace.slug}` },
        { status: 410 }
      )
    }

    // also check if user has send join request for this invite
    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        workspaceId: invite.workspaceId,
        userId: userInfo.userId,
      },
    })
    if (existingRequest) {
      return NextResponse.json(
        {
          valid: false,
          message: 'You have already sent a join request for this workspace',
        },
        { status: 409 }
      )
    }

    // Return valid invite information
    return NextResponse.json(
      {
        valid: true,
        invite: {
          id: invite.id,
          isLink: invite.isLink,
          linkPublic: invite.linkPublic,
          workspace: {
            id: invite.workspace.id,
            name: invite.workspace.name,
            slug: invite.workspace.slug,
          },
          role: {
            id: invite.role.id,
            name: invite.role.name,
          },
          expiresAt: invite.expiresAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error validating invite:', error)
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
