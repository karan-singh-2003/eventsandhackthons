'use server'

import { prisma } from '@/lib/prisma'
import { getUserInfo } from '@/lib/auth-server'

export async function getWorkspaceBySlug({
  workspaceSlug,
}: {
  workspaceSlug: string
}) {
  // Get user info from cookies
  const user = await getUserInfo()

  if (!user?.userId) {
    return { error: 'Unauthorized - No user info', status: 401 }
  }

  if (!workspaceSlug) {
    return { error: 'Missing workspace slug', status: 400 }
  }

  // Get the workspace by slug
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  })

  if (!workspace) {
    return { error: 'Workspace not found', status: 404 }
  }

  // Check if the user is a member of that workspace
  const member = await prisma.member.findFirst({
    where: {
      userId: user.userId,
      workspaceId: workspace.id,
    },
  })

  if (!member) {
    return {
      error: 'You are not a member of this workspace',
      status: 403,
    }
  }

  return { workspace }
}
