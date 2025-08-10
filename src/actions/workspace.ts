'use server'
import { prisma } from '@/lib/prisma'
// import { createNotification } from '@/actions/user'
export const getInviteWorkspace = async (token: string) => {
  try {
    console.log('Fetching workspace for invite token:', token)
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    if (!invite || !invite.workspace) {
      return { status: 404, data: 'Workspace not found for this invite token' }
    }

    return {
      status: 200,
      data: {
        workspace: invite.workspace,
        approvalRequired: invite.linkPublic,
      },
    }
  } catch (error) {
    console.error('Error fetching workspace from invite token:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const findAllJoinRequests = async ({
  workspaceId,
}: {
  workspaceId: string
}) => {
  try {
    const requests = await prisma.joinRequest.findMany({
      where: { workspaceId },
      include: {
        user: true,
        role: {
          select: {
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    return {
      status: 200,
      data: requests,
    }
  } catch (error) {
    console.error('Error fetching join requests:', error)
    return {
      status: 500,
      data: 'Internal server error',
    }
  }
}

export type WorkspaceMember = {
  id: string
  roleId: string
  role: {
    name: string
    createdAt: Date
    updatedAt: Date
  }
  user: {
    name: string | null
    email: string | null
  }
  userId: string
  workspaceId: string
  joinedAt: Date
}

export type WorkspaceMemberResponse = {
  status: number
  data: WorkspaceMember[] | string
}

// actions/workspace.ts
export const getWorkspaceMembers = async (workspaceSlug: string) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                universityId: true,
                lastActiveAt: true,
              },
            },
            role: {
              select: { name: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        invites: {
          where: { isLink: false, status: 'PENDING' },
          select: {
            id: true,
            email: true,
            name: true,
            universityId: true,
            createdAt: true,
            role: {
              select: {
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!workspace) {
      return { status: 404, data: { members: [], invites: [] } }
    }

    return {
      status: 200,
      data: {
        members: workspace.members,
        invites: workspace.invites,
      },
    }
  } catch (error) {
    console.error('Error fetching workspace members:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

// Update member role
export const updateMemberRole = async ({
  memberId,
  roleId,
  workspaceSlug,
}: {
  memberId: string
  roleId: string
  workspaceSlug: string
}) => {
  try {
    // First verify the workspace exists and get workspace ID
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    // Verify the role exists in this workspace
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        workspaceId: workspace.id,
      },
    })

    if (!role) {
      return { status: 404, data: 'Role not found in this workspace' }
    }

    // Update the member's role
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: { roleId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      status: 200,
      data: updatedMember,
    }
  } catch (error) {
    console.error('Error updating member role:', error)
    return { status: 500, data: 'Failed to update member role' }
  }
}

// Remove member from workspace
export const removeMemberFromWorkspace = async ({
  memberId,
  workspaceSlug,
}: {
  memberId: string
  workspaceSlug: string
}) => {
  try {
    // First verify the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    // Get member info before deletion for validation
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        workspaceId: workspace.id,
      },
      include: {
        role: true,
        user: true,
      },
    })

    if (!member) {
      return { status: 404, data: 'Member not found' }
    }

    // Prevent removing the owner
    if (member.role.name.toUpperCase() === 'OWNER') {
      return { status: 403, data: 'Cannot remove workspace owner' }
    }

    // Remove the member
    await prisma.member.delete({
      where: { id: memberId },
    })

    return {
      status: 200,
      data: 'Member removed successfully',
    }
  } catch (error) {
    console.error('Error removing member:', error)
    return { status: 500, data: 'Failed to remove member' }
  }
}

// Cancel invitation
export const cancelInvitation = async ({
  inviteId,
  workspaceSlug,
}: {
  inviteId: string
  workspaceSlug: string
}) => {
  try {
    // First verify the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    // Verify the invitation exists and belongs to this workspace
    const invite = await prisma.invite.findFirst({
      where: {
        id: inviteId,
        workspaceId: workspace.id,
        status: 'PENDING',
      },
    })

    if (!invite) {
      return { status: 404, data: 'Invitation not found or already processed' }
    }

    // Delete the invitation
    await prisma.invite.delete({
      where: { id: inviteId },
    })

    return {
      status: 200,
      data: 'Invitation canceled successfully',
    }
  } catch (error) {
    console.error('Error canceling invitation:', error)
    return { status: 500, data: 'Failed to cancel invitation' }
  }
}

// Approve join request
export const approveJoinRequest = async ({
  requestId,
  workspaceSlug,
}: {
  requestId: string
  workspaceSlug: string
}) => {
  try {
    // First verify the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
        workspaceId: workspace.id,
      },
      include: {
        user: true,
        role: true,
      },
    })

    if (!joinRequest) {
      return { status: 404, data: 'Join request not found' }
    }

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Create member
      await tx.member.create({
        data: {
          userId: joinRequest.userId,
          workspaceId: workspace.id,
          roleId: joinRequest.roleId,
        },
      })

      // Delete join request
      await tx.joinRequest.delete({
        where: { id: requestId },
      })
    })

    return {
      status: 200,
      data: 'Join request approved successfully',
    }
  } catch (error) {
    console.error('Error approving join request:', error)
    return { status: 500, data: 'Failed to approve join request' }
  }
}

// Reject join request
export const rejectJoinRequest = async ({
  requestId,
  workspaceSlug,
}: {
  requestId: string
  workspaceSlug: string
}) => {
  try {
    // First verify the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    // Verify the join request exists
    const joinRequest = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
        workspaceId: workspace.id,
      },
    })

    if (!joinRequest) {
      return { status: 404, data: 'Join request not found' }
    }

    // Delete the join request
    await prisma.joinRequest.delete({
      where: { id: requestId },
    })

    return {
      status: 200,
      data: 'Join request rejected successfully',
    }
  } catch (error) {
    console.error('Error rejecting join request:', error)
    return { status: 500, data: 'Failed to reject join request' }
  }
}
