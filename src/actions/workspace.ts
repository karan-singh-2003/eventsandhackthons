// import {
//   approveJoinRequest,
//   findAllJoinRequests,
//   getWorkspaceBySlugWithMembers,
//   rejectJoinRequest,
//   removeMemberFromWorkspace,
//   updateMemberRole,
// } from '@/actions/workspace'

import { prisma } from "@/lib/prisma"
import { MemberWithUser } from "@/types"
import { createNotification } from "./user"


export async function getWorkspaceBySlugWithMembers(
  slug: string
){
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              universityId: true,
              
            },
          },
        },
      },
    },
  })

  if (!workspace) throw new Error('Workspace not found')
  return workspace.members
}


export const removeMemberFromWorkspace = async ({
  userId,
  workspaceId,
}: {
  userId: string
  workspaceId: string
}) => {
  try {
    await prisma.member.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error removing member:', error)
    return { success: false, message: 'Failed to remove member' }
  }
}

export const updateMemberRole = async ({
  userId,
  workspaceId,
  role,
}: {
  userId: string
  workspaceId: string
  role: any
}) => {
  try {
    await prisma.member.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    })
    console.log(
      `Member role updated: ${userId} to ${role} in workspace ${workspaceId}`
    )
    // Optionally, you can create a notification for the user
    await createNotification({
      userId,
      message: `Your role has been updated to ${role} in the workspace.`,
      workspaceId,
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating member role:', error)
    return { success: false, message: 'Failed to update role' }
  }
}
