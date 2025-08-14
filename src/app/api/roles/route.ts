import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/roles?workspaceSlug=xxx&action=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceSlug = searchParams.get('workspaceSlug')
    const action = searchParams.get('action') || 'getAll'

    if (!workspaceSlug) {
      return NextResponse.json(
        { error: 'workspaceSlug is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'getWorkspaceRoles': {
        const workspace = await prisma.workspace.findUnique({
          where: { slug: workspaceSlug },
          select: { id: true },
        })
        if (!workspace) {
          return NextResponse.json({ status: 404, data: 'Workspace not found' })
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
        return NextResponse.json({ status: 200, data: roles })
      }
      case 'getAll':
      default: {
        const workspace = await prisma.workspace.findUnique({
          where: { slug: workspaceSlug },
          select: { id: true },
        })
        if (!workspace) {
          return NextResponse.json({ status: 404, data: 'Workspace not found' })
        }
        const roles = await prisma.role.findMany({
          where: { workspaceId: workspace.id },
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    label: true,
                    category: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
            updatedBy: {
              select: {
                id: true,
                name: true,
              },
            },
            workspace: true,
          },
          orderBy: { name: 'asc' },
        })
        return NextResponse.json({ status: 200, data: roles })
      }
    }
  } catch (error) {
    console.error('GET /api/roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/roles - Create role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, workspaceSlug, permissions, createdById, updatedById } = body

    if (!name || !workspaceSlug || !createdById || !updatedById) {
      return NextResponse.json(
        {
          error:
            'name, workspaceSlug, createdById, and updatedById are required',
        },
        { status: 400 }
      )
    }

    // Find workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }
    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        workspaceId: workspace.id,
        createdById,
        updatedById,
      },
    })
    // Add permissions if provided
    if (permissions && permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissions.map((permissionId: string) => ({
          roleId: role.id,
          permissionId,
        })),
      })
    }
    return NextResponse.json({ status: 200, data: role })
  } catch (error) {
    console.error('POST /api/roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/roles - Update role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, permissions, userId } = body

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      )
    }

    // Update role name
    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name },
    })
    // Update permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: id } })
    if (permissions && permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissions.map((permissionId: string) => ({
          roleId: id,
          permissionId,
        })),
      })
    }
    return NextResponse.json({ status: 200, data: updatedRole })
  } catch (error) {
    console.error('PUT /api/roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/roles?roleId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    if (!roleId) {
      return NextResponse.json({ error: 'roleId is required' }, { status: 400 })
    }

    await prisma.rolePermission.deleteMany({ where: { roleId } })
    await prisma.role.delete({ where: { id: roleId } })
    return NextResponse.json({ status: 200, message: 'Role deleted' })
  } catch (error) {
    console.error('DELETE /api/roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
