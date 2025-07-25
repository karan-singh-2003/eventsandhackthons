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
 * Helper function to get a specific cookie (CLIENT-SIDE)
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

/**
 * Get authentication data from cookies (CLIENT-SIDE)
 * Use this in client components and hooks
 */
export function getAuthData(): AuthData {
  const authData: AuthData = {
    userInfo: null,
    sessionInfo: null,
  }

  // Get and parse user info cookie
  const userInfoCookie = getCookie('user_info')
  if (userInfoCookie) {
    try {
      authData.userInfo = JSON.parse(decodeURIComponent(userInfoCookie))
    } catch {
      console.error('Error parsing user_info cookie on client')
    }
  }

  // Get and parse session info cookie
  const sessionInfoCookie = getCookie('session_info')
  if (sessionInfoCookie) {
    try {
      authData.sessionInfo = JSON.parse(decodeURIComponent(sessionInfoCookie))
    } catch {
      console.error('Error parsing session_info cookie on client')
    }
  }

  return authData
}

/**
 * Get user info only (CLIENT-SIDE)
 */
export function getUserInfo(): UserInfo | null {
  const { userInfo } = getAuthData()
  return userInfo
}

/**
 * Get session info only (CLIENT-SIDE)
 */
export function getSessionInfo(): SessionInfo | null {
  const { sessionInfo } = getAuthData()
  return sessionInfo
}

/**
 * Check if user is authenticated (CLIENT-SIDE)
 */
export function isAuthenticated(): boolean {
  const { userInfo, sessionInfo } = getAuthData()
  return !!(userInfo && sessionInfo)
}

/**
 * Check if user is admin (CLIENT-SIDE)
 */
export function isAdmin(): boolean {
  const userInfo = getUserInfo()
  return userInfo?.isAdmin ?? false
}

/**
 * Check if session is expired (CLIENT-SIDE)
 */
export function isSessionExpired(): boolean {
  const sessionInfo = getSessionInfo()
  if (!sessionInfo) return true

  const expiresAt = new Date(sessionInfo.expiresAt)
  return new Date() > expiresAt
}
