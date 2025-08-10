import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Get the cookies instance
    const cookieStore = await cookies()

    // Clear authentication cookies
    // Based on your auth-client.ts, the main cookies are user_info and session_info
    const authCookiesToClear = [
      'user_info',
      'session_info',
      'auth-token',
      'refresh-token',
      'session-id',
      'user-session',
    ]

    // Clear each cookie (both httpOnly and regular cookies)
    authCookiesToClear.forEach((cookieName) => {
      // Clear httpOnly cookies
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })

      // Also clear non-httpOnly cookies (for client-side access)
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    })

    // If you're using a database session, you might want to invalidate it here
    // Example:
    // const sessionId = cookieStore.get('session-id')?.value
    // if (sessionId) {
    //   await db.session.delete({
    //     where: { id: sessionId }
    //   })
    // }

    // If you're using Redis for sessions
    // Example:
    // const sessionId = cookieStore.get('session-id')?.value
    // if (sessionId && redis) {
    //   await redis.del(`session:${sessionId}`)
    // }

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to logout',
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
