import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'
import { createWorkspaceSchema } from '@/Schemas/WorkspaceSchema'
import { createNotification } from '@/actions/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = createWorkspaceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    let { workspacename, workspaceslug } = result.data

    // ✅ Replace spaces with hyphens and lowercase
    workspaceslug = workspaceslug.trim().toLowerCase().replace(/\s+/g, '-')

    const authData = await getAuthData()

    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      )
    }

    const { userInfo, sessionInfo } = authData

    const sessionExpiry = new Date(sessionInfo.expiresAt)
    if (new Date() > sessionExpiry) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // Check if workspace with the same name or slug already exists
    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        OR: [
          { name: workspacename },
          { slug: workspaceslug }
        ],
      },
    })

    if (existingWorkspace) {
      return NextResponse.json(
        {
          error: 'Workspace name or slug already exists. Please choose a different one.',
        },
        { status: 409 }
      )
    }

    const newWorkspace = await prisma.workspace.create({
      data: {
        name: workspacename,
        slug: workspaceslug, // ✅ Store the cleaned slug
        createdById: userInfo.userId,
        roles: {
          create: {
            name: 'OWNER',
          },
        },
      },
      include: {
        roles: true,
      },
    })

    const ownerRole = newWorkspace.roles.find((role) => role.name === 'OWNER')
    if (!ownerRole) {
      return NextResponse.json({ error: 'Failed to create owner role' }, { status: 500 })
    }

    await prisma.member.create({
      data: {
        userId: userInfo.userId,
        workspaceId: newWorkspace.id,
        roleId: ownerRole.id,
        joinedAt: new Date(),
      },
    })

    await prisma.user.update({
      where: { id: userInfo.userId },
      data: { lastActiveWorkspaceId: newWorkspace.id },
    })

    try {
      await createNotification({
        userId: userInfo.userId,
        message: `Welcome to your new workspace: ${newWorkspace.name}! 🎉`,
        workspaceId: newWorkspace.id,
      })
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Workspace created successfully',
        workspace: {
          id: newWorkspace.id,
          name: newWorkspace.name,
          slug: newWorkspace.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create workspace API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
