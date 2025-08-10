'use server'

import { prisma } from '@/lib/prisma'
import type { PermissionResponse } from '@/components/Onboarding/Roles/types'

export async function getAllPermissions(): Promise<PermissionResponse[]> {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          category: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    })

    return permissions
  } catch (error) {
    console.error('Error fetching permissions:', error)
    throw new Error('Failed to fetch permissions')
  }
}

export async function getPermissionsByCategory() {
  try {
    const categories = await prisma.permissionCategory.findMany({
      include: {
        permissions: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return categories
  } catch (error) {
    console.error('Error fetching permissions by category:', error)
    throw new Error('Failed to fetch permissions by category')
  }
}
