import { NextResponse } from 'next/server'
import { getUserInfo } from '@/lib/auth-server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

//* type for membership with included workspace and role
type MembershipWithWorkspaceAndRole = {
  id: string
  userId: string
  workspaceId: string
  roleId: string
  joinedAt: Date
  workspace: {
    id: string
    name: string
    slug: string
    createdById: string
  }
  role: {
    id: string
    name: string
  }
}

export async function GET() {
  try {
    // Validate user from cookies using existing auth-server function
    const userInfo = await getUserInfo()
    if (!userInfo) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch user's workspace memberships from database
    const userMemberships = await prisma.member.findMany({
      where: { userId: userInfo.userId },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdById: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Determine the manage events configuration
    let manageEventsConfig = {
      show: false,
      redirectTo: '',
      reason: '',
    }

    if (userMemberships.length > 0) {
      // User has workspace memberships - redirect to first workspace slug
      const primaryMembership = userMemberships[0]
      manageEventsConfig = {
        show: true,
        redirectTo: `/workspace/${primaryMembership.workspace.slug}`,
        reason: 'has_workspace',
      }
    } else if (userInfo.isAdmin) {
      // Admin but no workspaces - redirect to create workspace
      manageEventsConfig = {
        show: true,
        redirectTo: '/onboarding/create-workspace',
        reason: 'admin_no_workspace',
      }
    } else {
      // Regular user with no workspaces - don't show
      manageEventsConfig = {
        show: false,
        redirectTo: '',
        reason: 'user_no_workspace',
      }
    }

    // Format workspaces for response
    const workspaces = userMemberships.map(
      (membership: MembershipWithWorkspaceAndRole) => ({
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        role: membership.role.name,
        isOwner: membership.workspace.createdById === userInfo.userId,
        joinedAt: membership.joinedAt,
      })
    )

    return NextResponse.json({
      success: true,
      manageEvents: manageEventsConfig,
      workspaces: workspaces,
      userRole: userInfo.isAdmin ? 'admin' : 'user',
    })
  } catch (error) {
    console.error('Error fetching manage events config:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
