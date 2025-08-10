import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendInviteEmail } from '@/actions/email'

// POST /api/email - Send email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'sendEmail': {
        const { to, subject, text } = body
        if (!to || !subject || !text) {
          return NextResponse.json(
            { error: 'to, subject, and text are required' },
            { status: 400 }
          )
        }

        const result = await sendEmail({ to, subject, text })
        return NextResponse.json({ status: 200, data: result })
      }

      case 'sendInviteEmail': {
        const { to, inviteLink, workspaceName } = body
        if (!to || !inviteLink || !workspaceName) {
          return NextResponse.json(
            { error: 'to, inviteLink, and workspaceName are required' },
            { status: 400 }
          )
        }

        const result = await sendInviteEmail({ to, inviteLink, workspaceName })
        return NextResponse.json({ status: 200, data: result })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('POST /api/email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
