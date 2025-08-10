'use server'

import { prisma } from '@/lib/prisma'
import type { RoleResponse } from '@/components/Onboarding/Roles/types'
import { getAuthData } from '@/lib/auth-server'

// Define missing types based on Prisma schema
type RolePermissionWithDetails = {
  permission: {
    id: string
    name: string
    label: string
    category: {
      name: string
    }
  }
}

type WorkspaceInfo = {
  id: string
  name: string
}

// Get roles for a specific workspace (for role selection)
export async function getWorkspaceRoles(workspaceSlug: string) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    const roles = await prisma.role.findMany({
      where: { workspaceId: workspace.id },
      select: {
        id: true,
        name: true,
        workspaceId: true,
      },
      orderBy: { name: 'asc' },
    })

    return {
      status: 200,
      data: roles,
    }
  } catch (error) {
    console.error('Error fetching workspace roles:', error)
    return { status: 500, data: 'Failed to fetch roles' }
  }
}

export async function getAllRoles(
  workspaceSlug: string
): Promise<RoleResponse[]> {
  console.log('🔍 [getAllRoles] Fetching roles for workspace:', workspaceSlug)
  try {
    console.log(
      '🔍 [getAllRoles] Starting role fetch for workspace:',
      workspaceSlug
    )

    if (!workspaceSlug) {
      console.warn('🚨 [getAllRoles] No workspace slug provided')
      return []
    }

    // First check if workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true, name: true },
    })

    if (!workspace) {
      console.warn('🚨 [getAllRoles] Workspace not found:', workspaceSlug)
      return []
    }

    console.log('✅ [getAllRoles] Workspace found:', workspace)

    const roles = await prisma.role.findMany({
      where: { workspace: { slug: workspaceSlug } },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    console.log('📊 [getAllRoles] Found roles:', roles.length)

    const mappedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      createdBy: role.createdBy
        ? {
            id: role.createdBy.id,
            name: role.createdBy.name,
            email: role.createdBy.email,
          }
        : undefined,
      updatedBy: role.updatedBy
        ? {
            id: role.updatedBy.id,
            name: role.updatedBy.name,
            email: role.updatedBy.email,
          }
        : undefined,
      permissions: role.permissions.map((rp: RolePermissionWithDetails) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        label: rp.permission.label,
        categoryId: rp.permission.category.name,
      })),
      workspace: (role.workspace as WorkspaceInfo) || {
        id: role.workspaceId,
        name: 'Unknown',
      },
      _count: {
        members: role._count.members,
        permissions: role.permissions.length,
      },
    }))

    console.log('✅ [getAllRoles] Returning mapped roles:', mappedRoles.length)
    return mappedRoles
  } catch (error) {
    console.error('❌ [getAllRoles] Error fetching roles:', error)
    // Return empty array instead of throwing to prevent component crash
    return []
  }
}

export async function createRole(data: {
  name: string
  permissions: string[]
  workspaceSlug: string
}) {
  try {
    const authData = getAuthData()
    if (!authData) {
      throw new Error('User not authenticated')
    }
    const userId = (await authData).userInfo?.userId || ''
    console.log('Creating role for user:', userId)
    // Find workspace by slug
    const workspace = await prisma.workspace.findUnique({
      where: { slug: data.workspaceSlug },
    })
    const role = await prisma.role.create({
      data: {
        name: data.name,
        workspaceId: workspace?.id || '',
        createdById: userId, // Required by schema
        updatedById: userId, // Required by schema
        permissions: {
          create: data.permissions.map((permissionId: string) => ({
            permissionId,
          })),
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      createdBy: role.createdBy
        ? {
            id: role.createdBy.id,
            name: role.createdBy.name,
            email: role.createdBy.email,
          }
        : undefined,
      updatedBy: role.updatedBy
        ? {
            id: role.updatedBy.id,
            name: role.updatedBy.name,
            email: role.updatedBy.email,
          }
        : undefined,
      permissions:
        role.permissions?.map((rp: RolePermissionWithDetails) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          label: rp.permission.label,
          categoryId: rp.permission.category.name,
        })) || [],
      workspace: (role.workspace as WorkspaceInfo) || {
        id: role.workspaceId,
        name: 'Unknown',
      },
      _count: {
        members: role._count?.members || 0,
        permissions: role.permissions?.length || 0,
      },
    }
  } catch (error) {
    console.error('Error creating role:', error)
    throw new Error('Failed to create role')
  }
}

export async function updateRole(data: {
  id: string
  name?: string
  permissions?: string[]
  userId: string // Required for audit tracking
}) {
  try {
    // If permissions are being updated, we need to handle the many-to-many relationship
    if (data.permissions) {
      // First, delete existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: data.id },
      })

      // Then create new permissions
      await prisma.rolePermission.createMany({
        data: data.permissions.map((permissionId: string) => ({
          roleId: data.id,
          permissionId,
        })),
      })
    }

    // Update the role
    const role = await prisma.role.update({
      where: { id: data.id },
      data: {
        ...(data.name && { name: data.name }),
        updatedById: data.userId, // Update audit field
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            permission: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      createdBy: role.createdBy
        ? {
            id: role.createdBy.id,
            name: role.createdBy.name,
            email: role.createdBy.email,
          }
        : undefined,
      updatedBy: role.updatedBy
        ? {
            id: role.updatedBy.id,
            name: role.updatedBy.name,
            email: role.updatedBy.email,
          }
        : undefined,
      permissions:
        role.permissions?.map((rp: RolePermissionWithDetails) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          label: rp.permission.label,
          categoryId: rp.permission.category.name,
        })) || [],
      workspace: (role.workspace as WorkspaceInfo) || {
        id: role.workspaceId,
        name: 'Unknown',
      },
      _count: {
        members: role._count?.members || 0,
        permissions: role.permissions?.length || 0,
      },
    }
  } catch (error) {
    console.error('Error updating role:', error)
    throw new Error('Failed to update role')
  }
}

export async function deleteRole(roleId: string) {
  try {
    await prisma.role.delete({
      where: { id: roleId },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting role:', error)
    throw new Error('Failed to delete role')
  }
}
