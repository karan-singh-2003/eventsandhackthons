import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import redis from '@/lib/redis'
import { logInSchema } from '@/Schemas/LogInSchema'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const result = logInSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { universityId, password } = result.data

    // Get user by university ID
    const user = await prisma.user.findUnique({
      where: { universityId, password },
    })
    // when hashing password this to be used
    //  const user = await prisma.user.findUnique({
    //   where: { universityId },
    // })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password--for hashing
    // const isPasswordValid = await bcrypt.compare(password, user.password)
    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: 'Invalid credentials' },
    //     { status: 401 }
    //   )
    // }

    // Get client info with better IP detection
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const remoteAddr = request.headers.get('x-forwarded-for')

    // Better IP detection logic
    let ipAddress = 'unknown'
    if (forwardedFor) {
      ipAddress = forwardedFor.split(',')[0].trim()
    } else if (realIp) {
      ipAddress = realIp
    } else if (remoteAddr) {
      ipAddress = remoteAddr.split(',')[0].trim()
    } else {
      // For local development, show a friendly message
      ipAddress =
        process.env.NODE_ENV === 'development' ? 'localhost (::1)' : 'unknown'
    }

    const userAgent = headersList.get('user-agent') || 'unknown'

    // Generate session
    const sessionToken = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create session in database
    const session = await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt,
      },
    })

    // Cache session in Redis (optional for performance)
    try {
      await redis.setex(
        `session:${sessionToken}`,
        7 * 24 * 60 * 60,
        JSON.stringify({
          userId: user.id,
          sessionId: session.id,
          universityId: user.universityId,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        })
      )
    } catch (redisError) {
      console.error('Redis caching failed:', redisError)
      // Continue without Redis - not critical
    }

    // Prepare user info for cookie
    const userInfo = {
      userId: user.id,
      universityId: user.universityId,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    // Prepare session info for cookie
    const sessionInfo = {
      sessionId: session.id,
      token: sessionToken,
      ipAddress,
      userAgent,
      expiresAt: expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userInfo,
      },
      { status: 200 }
    )

    // Set cookies
    response.cookies.set('user_info', JSON.stringify(userInfo), {
      httpOnly: false, // Allow client access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    response.cookies.set('session_info', JSON.stringify(sessionInfo), {
      httpOnly: false, // Allow client access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Also set secure session token (httpOnly)
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true, // Secure - server only
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
