import { NextRequest, NextResponse } from 'next/server'
import {
  getWorkspaceRoles,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from '@/actions/roles'

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
      case 'getWorkspaceRoles':
        const workspaceRoles = await getWorkspaceRoles(workspaceSlug)
        return NextResponse.json(workspaceRoles)

      case 'getAll':
      default:
        const allRoles = await getAllRoles(workspaceSlug)
        return NextResponse.json({ status: 200, data: allRoles })
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
    const { name, workspaceSlug, permissions } = body

    if (!name || !workspaceSlug) {
      return NextResponse.json(
        { error: 'name and workspaceSlug are required' },
        { status: 400 }
      )
    }

    const result = await createRole({
      name,
      workspaceSlug,
      permissions: permissions || [],
    })

    return NextResponse.json(result)
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

    const result = await updateRole({
      id,
      name,
      permissions: permissions || [],
      userId,
    })

    return NextResponse.json(result)
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

    const result = await deleteRole(roleId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE /api/roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
