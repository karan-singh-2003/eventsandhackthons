import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'
import { z } from 'zod'

const createRoleSchema = z.object({
  workspaceSlug: z.string(),
  name: z.string().min(1).max(50),
  permissions: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    console.log('POST /api/roles called')
    console.log('Request body:', body)
    const result = createRoleSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { workspaceSlug, name, permissions } = result.data

    // Get authentication data
    const authData = await getAuthData()
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      )
    }

    const { userInfo } = authData

    // Check if user is the owner of the workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        createdById: userInfo.userId,
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Unauthorized - Only workspace owner can create roles' },
        { status: 403 }
      )
    }

    // Check if role name already exists in this workspace
    const existingRole = await prisma.role.findFirst({
      where: {
        workspaceId: workspace?.id,
        name,
      },
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists in this workspace' },
        { status: 409 }
      )
    }

    // Create the role
    const newRole = await prisma.role.create({
      data: {
        name,
        workspaceId: workspace?.id,
        createdById: userInfo.userId,
        updatedById: userInfo.userId,
      },
    })

    // Create role permissions
    if (permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissions.map((permissionId) => ({
          roleId: newRole.id,
          permissionId,
        })),
      })
    }

    // Fetch the created role with permissions
    const roleWithPermissions = await prisma.role.findUnique({
      where: { id: newRole.id },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Role created successfully',
        role: roleWithPermissions,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create role API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
