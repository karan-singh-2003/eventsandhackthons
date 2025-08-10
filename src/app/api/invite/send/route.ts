import { getAuthData } from '@/lib/auth-server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendInviteEmail } from '@/actions/email'
import { RoleResponse } from '@/components/Onboarding/Roles/types'

interface InviteProps {
  emails: string[]
  role: RoleResponse
  workspaceSlug: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as InviteProps
    const { emails, role, workspaceSlug } = body
    console.log('Received invite request:', body)

    if (!emails?.length) {
      return NextResponse.json(
        { error: 'Emails array is required' },
        { status: 400 }
      )
    }

    if (!role?.id) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    if (!workspaceSlug) {
      return NextResponse.json(
        { error: 'Workspace slug is required' },
        { status: 400 }
      )
    }

    const { userInfo } = await getAuthData()
    const userId = userInfo?.userId

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    const uniqueEmails = [...new Set(emails)]

    const inviteResults = await Promise.all(
      uniqueEmails.map(async (email) => {
        const token = uuidv4()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        try {
          await prisma.invite.create({
            data: {
              token,
              roleId: role.id,
              email,
              workspaceId: workspace.id,
              invitedById: userId,
              linkPublic: false,
              isLink: false,
              expiresAt,
            },
          })

          const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${token}`

          await sendInviteEmail({
            to: email,
            inviteLink,
            workspaceName: workspace.name,
          })

          return { email, inviteLink, status: 'success' }
        } catch (error) {
          console.error(`❌ Failed to send invite to ${email}`, error)
          return { email, error: (error as Error).message, status: 'failed' }
        }
      })
    )

    return NextResponse.json(inviteResults, { status: 200 })
  } catch (error) {
    console.error('❌ Error in sending invites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
