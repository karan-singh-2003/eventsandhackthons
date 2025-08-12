// app/api/notifications/mark-read/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server' // adjust path to your actual auth util

export async function POST() {
  try {
    const authData = await getAuthData()
    const userId = authData?.userInfo?.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
