import { NextRequest, NextResponse } from 'next/server'
import { createNotification } from '@/actions/notifications'

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, workspaceId } = body

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      )
    }

    const result = await createNotification({
      userId,
      message,
      workspaceId,
    })

    return NextResponse.json({ status: 200, data: result })
  } catch (error) {
    console.error('POST /api/notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
