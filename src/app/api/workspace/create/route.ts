import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'
import { createWorkspaceSchema } from '@/schemas/WorkspaceSchema'
import { createNotification } from '@/actions/notifications'

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

    // Check for existing workspace name or slug
    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        OR: [{ name: workspacename }, { slug: workspaceslug }],
      },
    })

    if (existingWorkspace) {
      if (existingWorkspace.name === workspacename) {
        return NextResponse.json(
          {
            error:
              'Workspace name already exists. Please choose a different name.',
          },
          { status: 409 } // Conflict status code
        )
      } else {
        return NextResponse.json(
          {
            error:
              'Workspace URL already exists. Please choose a different name.',
          },
          { status: 409 } // Conflict status code
        )
      }
    }

    console.log('Creating workspace for user:', userInfo.userId)

    // Verify user exists in database before creating workspace
    const userExists = await prisma.user.findUnique({
      where: { id: userInfo.userId },
      select: { id: true },
    })
    console.log('User exists:', userExists)

    if (!userExists) {
      console.error('User not found in database:', userInfo.userId)
      return NextResponse.json(
        {
          error: 'User not found in database',
          details:
            'Please ensure you are properly authenticated and your user account exists',
        },
        { status: 400 }
      )
    }

    // Create workspace
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: workspacename,
        slug: workspaceslug,
        createdById: userInfo.userId,
      },
    })

    console.log('Workspace created successfully:', newWorkspace.id)

    // Create only the owner role for the workspace
    console.log('Creating owner role for workspace...')

    const ownerRole = await prisma.role.create({
      data: {
        name: 'OWNER',
        workspaceId: newWorkspace.id,
        createdById: userInfo.userId,
        updatedById: userInfo.userId,
      },
    })

    console.log('Created owner role:', ownerRole.id)

    if (!ownerRole) {
      return NextResponse.json(
        { error: 'Failed to create owner role' },
        { status: 500 }
      )
    }

    // Get all permissions to assign to the owner role
    console.log('Getting all permissions to assign to owner role...')
    const allPermissions = await prisma.permission.findMany({
      select: { id: true },
    })

    console.log(`Found ${allPermissions.length} permissions to assign`)

    // Create RolePermission relationships for all permissions
    if (allPermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: allPermissions.map((permission: { id: string }) => ({
          roleId: ownerRole.id,
          permissionId: permission.id,
        })),
      })
      console.log(
        `Assigned all ${allPermissions.length} permissions to owner role`
      )
    }

    // Create member relationship with owner role
    console.log('Creating member relationship...')
    await prisma.member.create({
      data: {
        userId: userInfo.userId,
        workspaceId: newWorkspace.id,
        roleId: ownerRole.id,
        joinedAt: new Date(),
      },
    })

    console.log('Member relationship created successfully')

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
  } catch (error: unknown) {
    console.error('Create workspace API error:', error)

    // Check if it's a Prisma foreign key constraint error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2003'
    ) {
      console.error(
        'Foreign key constraint violation:',
        'meta' in error ? error.meta : 'Unknown meta'
      )
      return NextResponse.json(
        {
          error: 'Database constraint violation - User reference not found',
          details: 'The user making this request may not exist in the database',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
