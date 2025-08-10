import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'default'

    switch (action) {
      case 'getAll': {
        const permissions = await prisma.permission.findMany({
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
        })
        return NextResponse.json({ status: 200, data: permissions })
      }

      case 'getByCategory': {
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
        return NextResponse.json(categories)
      }

      case 'default':
      default:
        // Original functionality - keep for backward compatibility
        const permissions = await prisma.permission.findMany({
          include: {
            category: true,
          },
          orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
        })

        // Group permissions by category
        const groupedPermissions = permissions.reduce((acc, permission) => {
          const categoryName = permission.category.name
          if (!acc[categoryName]) {
            acc[categoryName] = []
          }
          acc[categoryName].push({
            id: permission.id,
            name: permission.name,
            label: permission.label,
          })
          return acc
        }, {} as Record<string, Array<{ id: string; name: string; label: string }>>)

        return NextResponse.json(
          { permissions: groupedPermissions },
          { status: 200 }
        )
    }
  } catch (error) {
    console.error('Get permissions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}
