import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import redis from '@/lib/redis'

export async function POST() {
  try {
    const cookieStore = cookies()

    const sessionToken = cookieStore.get('session_token')?.value || null

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token not found' }, { status: 401 })
    }

    // Delete session from Prisma DB
    await prisma.session.deleteMany({
      where: {
        token: sessionToken,
      },
    })

    // Delete from Redis (if used)
    try {
      await redis.del(`session:${sessionToken}`)
    } catch (err) {
      console.error('Redis session deletion failed:', err)
    }

    // Prepare response and clear cookies
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )

    const cookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    }

    // Clear all related cookies
    response.cookies.set('session_token', '', {
      ...cookieOptions,
      httpOnly: true,
      maxAge: 0,
    })

    response.cookies.set('user_info', '', {
      ...cookieOptions,
      httpOnly: false,
      maxAge: 0,
    })

    response.cookies.set('session_info', '', {
      ...cookieOptions,
      httpOnly: false,
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Logout API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
