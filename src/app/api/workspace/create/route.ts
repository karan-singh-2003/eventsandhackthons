import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'
import { createWorkspaceSchema } from '@/Schemas/WorkspaceSchema'
import { createNotification } from '@/actions/user'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const result = createWorkspaceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { workspacename, workspaceslug } = result.data

    // Get complete authentication data (user info + session info)
    const authData = await getAuthData()

    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      )
    }

    const { userInfo, sessionInfo } = authData

    // Verify session is not expired
    const sessionExpiry = new Date(sessionInfo.expiresAt)
    if (new Date() > sessionExpiry) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    console.log('Complete auth data:', authData)

    // Check for existing workspace name
    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        name: workspacename,
      },
    })

    if (existingWorkspace) {
      return NextResponse.json(
        {
          error:
            'Workspace name already exists. Please choose a different name.',
        },
        { status: 409 } // Conflict status code
      )
    }

    // Create workspace with owner role
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: workspacename,
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

    // Get the owner role that was just created
    const ownerRole = newWorkspace.roles.find((role) => role.name === 'OWNER')

    if (!ownerRole) {
      return NextResponse.json(
        { error: 'Failed to create owner role' },
        { status: 500 }
      )
    }

    // Create member relationship with owner role
    await prisma.member.create({
      data: {
        userId: userInfo.userId,
        workspaceId: newWorkspace.id,
        roleId: ownerRole.id,
        joinedAt: new Date(),
      },
    })

    console.log('Workspace created:', newWorkspace)
    console.log('Session info used:', sessionInfo)

    // Set last active workspace for the user
    await prisma.user.update({
      where: { id: userInfo.userId },
      data: { lastActiveWorkspaceId: newWorkspace.id },
    })

    // Create a welcome notification (you may need to implement this function)
    try {
      await createNotification({
        userId: userInfo.userId,
        message: `Welcome to your new workspace: ${newWorkspace.name}! 🎉`,
        workspaceId: newWorkspace.id,
      })
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError)
      // Don't fail the whole request for notification error
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Workspace created successfully',
        workspace: {
          id: newWorkspace.id,
          name: newWorkspace.name,
          slug: workspaceslug, // Use the slug from the request
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create workspace API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
