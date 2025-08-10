'use server'
import { cookies } from 'next/headers'

export interface UserInfo {
  userId: string
  universityId: string
  name: string
  email: string
  isAdmin: boolean
}

export interface SessionInfo {
  sessionId: string
  token: string
  ipAddress: string
  userAgent: string
  expiresAt: string
  createdAt: string
}

export interface AuthData {
  userInfo: UserInfo | null
  sessionInfo: SessionInfo | null
}

/**
 * Get authentication data from cookies (SERVER-SIDE)
 * Use this in server components, API routes, and server actions
 */
export async function getAuthData(): Promise<AuthData> {
  const cookieStore = await cookies()

  const authData: AuthData = {
    userInfo: null,
    sessionInfo: null,
  }

  // Get and parse user info cookie
  const userInfoCookie = cookieStore.get('user_info')
  if (userInfoCookie?.value) {
    try {
      authData.userInfo = JSON.parse(decodeURIComponent(userInfoCookie.value))
    } catch {
      console.error('Error parsing user_info cookie on server')
    }
  }

  // Get and parse session info cookie
  const sessionInfoCookie = cookieStore.get('session_info')
  if (sessionInfoCookie?.value) {
    try {
      authData.sessionInfo = JSON.parse(
        decodeURIComponent(sessionInfoCookie.value)
      )
    } catch {
      console.error('Error parsing session_info cookie on server')
    }
  }

  return authData
}

/**
 * Get user info only (SERVER-SIDE)
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  const { userInfo } = await getAuthData()
  return userInfo
}

/**
 * Get session info only (SERVER-SIDE)
 */
export async function getSessionInfo(): Promise<SessionInfo | null> {
  const { sessionInfo } = await getAuthData()
  return sessionInfo
}

/**
 * Check if user is authenticated (SERVER-SIDE)
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userInfo, sessionInfo } = await getAuthData()
  return !!(userInfo && sessionInfo)
}

/**
 * Check if user is admin (SERVER-SIDE)
 */
export async function isAdmin(): Promise<boolean> {
  const userInfo = await getUserInfo()
  return userInfo?.isAdmin ?? false
}
