import { NextRequest, NextResponse } from 'next/server'
import {
  getInviteWorkspace,
  findAllJoinRequests,
  getWorkspaceMembers,
  updateMemberRole,
  removeMemberFromWorkspace,
  cancelInvitation,
  approveJoinRequest,
  rejectJoinRequest,
} from '@/actions/workspace'

// GET /api/workspace?action=xxx&...params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'getInviteWorkspace': {
        const token = searchParams.get('token')
        if (!token) {
          return NextResponse.json(
            { error: 'token is required' },
            { status: 400 }
          )
        }
        const result = await getInviteWorkspace(token)
        return NextResponse.json(result)
      }

      case 'findAllJoinRequests': {
        const workspaceId = searchParams.get('workspaceId')
        if (!workspaceId) {
          return NextResponse.json(
            { error: 'workspaceId is required' },
            { status: 400 }
          )
        }
        const result = await findAllJoinRequests({ workspaceId })
        return NextResponse.json(result)
      }

      case 'getWorkspaceMembers': {
        const workspaceSlug = searchParams.get('workspaceSlug')
        if (!workspaceSlug) {
          return NextResponse.json(
            { error: 'workspaceSlug is required' },
            { status: 400 }
          )
        }
        const result = await getWorkspaceMembers(workspaceSlug)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GET /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workspace - Update operations
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'updateMemberRole': {
        const { memberId, roleId, workspaceSlug } = body
        if (!memberId || !roleId || !workspaceSlug) {
          return NextResponse.json(
            { error: 'memberId, roleId, and workspaceSlug are required' },
            { status: 400 }
          )
        }
        const result = await updateMemberRole({
          memberId,
          roleId,
          workspaceSlug,
        })
        return NextResponse.json(result)
      }

      case 'approveJoinRequest': {
        const { requestId, workspaceSlug } = body
        if (!requestId || !workspaceSlug) {
          return NextResponse.json(
            { error: 'requestId and workspaceSlug are required' },
            { status: 400 }
          )
        }
        const result = await approveJoinRequest({ requestId, workspaceSlug })
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('PUT /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workspace - Delete operations
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'removeMember': {
        const memberId = searchParams.get('memberId')
        const workspaceSlug = searchParams.get('workspaceSlug')
        if (!memberId || !workspaceSlug) {
          return NextResponse.json(
            { error: 'memberId and workspaceSlug are required' },
            { status: 400 }
          )
        }
        const result = await removeMemberFromWorkspace({
          memberId,
          workspaceSlug,
        })
        return NextResponse.json(result)
      }

      case 'cancelInvitation': {
        const inviteId = searchParams.get('inviteId')
        const workspaceSlug = searchParams.get('workspaceSlug')
        if (!inviteId || !workspaceSlug) {
          return NextResponse.json(
            { error: 'inviteId and workspaceSlug are required' },
            { status: 400 }
          )
        }
        const result = await cancelInvitation({ inviteId, workspaceSlug })
        return NextResponse.json(result)
      }

      case 'rejectJoinRequest': {
        const requestId = searchParams.get('requestId')
        const workspaceSlug = searchParams.get('workspaceSlug')
        if (!requestId || !workspaceSlug) {
          return NextResponse.json(
            { error: 'requestId and workspaceSlug are required' },
            { status: 400 }
          )
        }
        const result = await rejectJoinRequest({ requestId, workspaceSlug })
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('DELETE /api/workspace error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
