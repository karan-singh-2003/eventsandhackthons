import { NextRequest, NextResponse } from 'next/server'
import { getAuthData } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { workspaceSlug, approvalRequired } = await req.json()
    const { userInfo } = await getAuthData()

    if (!userInfo) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = userInfo.userId

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: 'Workspace not found' },
        { status: 404 }
      )
    }

    const role = 'VIEWER'

    let roleRecord = await prisma.role.findFirst({
      where: { name: role, workspaceId: workspace.id },
    })

    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: {
          name: role,
          workspaceId: workspace.id,
          createdById: user,
          updatedById: user,
        },
      })
    }

    const existingInvite = await prisma.invite.findFirst({
      where: {
        workspaceId: workspace.id,
        roleId: roleRecord.id,
        linkPublic: approvalRequired,
        isLink: true,
        disabled: false,
      },
      include: {
        role: true,
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        {
          inviteLink: `http://localhost:3000/invite/${existingInvite.token}`,
          expiresAt: existingInvite.expiresAt,
          role: existingInvite.role.name,
          workspaceName: workspace.name,
        },
        { status: 200 }
      )
    }

    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const newInvite = await prisma.invite.create({
      data: {
        token,
        isLink: true,
        workspaceId: workspace.id,
        invitedById: user,
        roleId: roleRecord.id,
        expiresAt,
        linkPublic: approvalRequired,
      },
      include: {
        role: true,
      },
    })

    return NextResponse.json(
      {
        inviteLink: `http://localhost:3000/invite/${newInvite.token}`,
        expiresAt,
        role: newInvite.role.name,
        workspaceName: workspace.name,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating invite link:', error)
    return NextResponse.json(
      { message: 'Something went wrong while creating the invite link' },
      { status: 500 }
    )
  }
}
