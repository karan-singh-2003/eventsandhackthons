'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
// import { InviteWorkspaceResponse, Member } from '@/types'
import { useParams } from 'next/navigation'
import { getBgColor, getTextColor } from '@/utils/generatecolor'
export type Member = {
  id: string
  userId: string
  workspaceId?: string
  joinedAt?: string | Date
  role?: string
  user: User
}
export type User = {
  id: string
  name: string
  email: string
  companySize?: string | number | null

  currentPlan?: string
  emailVerified?: boolean
  createdAt: string | Date
  firstName?: string | null
  lastName?: string | null

  provider?: string | null
  updatedAt: string | Date
  worktype?: string
  lastActiveWorkspaceId?: string | null
}
export type InviteWorkspaceResponse = {
  status: number
  invite: WorkspaceData | string
}
export type WorkspaceData = {
  approvalRequired: boolean
  workspace: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    createdAt: string | Date
    members: Member[]
    allowAutoJoin: boolean
    createdById?: string
  }
}
interface WorkspaceDescriptionProps {
  isPrivate?: boolean
  setIsPrivate?: (isPrivate: boolean) => void
}

const getInitials = (name: string): string => {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
  return letters.slice(0, 2) || 'U'
}

const WorkspaceDescription: React.FC<WorkspaceDescriptionProps> = ({
  setIsPrivate,
}) => {
  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [members, setMembers] = useState<Member[]>([])
  const params = useParams() as { token?: string | string[] }

  // Show up to 3 avatars overlapped, then +N
  const visibleMembers = members.slice(0, 3)
  const remainingCount = Math.max(0, members.length - visibleMembers.length)
  console.log('remainingCount:', remainingCount)
  useEffect(() => {
    let token: string | null | string[] = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('pending_invite_token')
    }
    const paramToken = params?.token
    if (!token && paramToken) token = paramToken
    if (Array.isArray(token)) token = token[0]
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchWorkspaceName = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/workspace?action=getInviteWorkspace&token=${token}`
        )
        const res: InviteWorkspaceResponse = await response.json()
        if (res.status === 200 && typeof res.invite !== 'string') {
          setWorkspaceName(res.invite.workspace.name)
          setMembers(res.invite.workspace.members)
          if (setIsPrivate) setIsPrivate(res.invite.approvalRequired)
        } else if (typeof res.invite === 'string') {
          setWorkspaceName(res.invite)
        } else {
          setWorkspaceName('Error loading workspace')
        }
      } catch {
        setWorkspaceName('Error fetching workspace')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaceName()
  }, [setIsPrivate, params?.token])

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center bg-white md:px-8 md:py-12 lg:max-w-2xl xl:max-w-3xl">
      <div className="flex flex-col items-center justify-center gap-y-2 w-full">
        {isLoading ? (
          <Skeleton className="h-6 w-48" />
        ) : (
          <h1 className="font-bold lg:text-4xl md:text-2xl text-center text-gray-800">
            Join {workspaceName}
          </h1>
        )}
      </div>

      {/* Members (overlapping avatar group) */}
      <div className="w-full mt-6">
        {isLoading ? (
          <div className="flex items-center">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className={idx === 0 ? '' : '-ml-3'}>
                <Skeleton className="h-8 w-8 rounded-full ring-2 ring-white" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex items-center ${
              remainingCount === 0 ? 'justify-center' : ''
            }`}
          >
            {visibleMembers.map((member, idx) => {
              const displayName =
                member.user?.name || member.user?.email || 'User'
              return (
                <div key={member.id} className={idx === 0 ? '' : '-ml-3'}>
                  <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                    <AvatarFallback
                      style={{
                        backgroundColor: getBgColor(displayName),
                        color: getTextColor(displayName),
                      }}
                      className="text-[17px] font-semibold"
                    >
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )
            })}
            {remainingCount > 0 && (
              <div className="-ml-3">
                <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="bg-black text-white text-[10px] font-semibold">
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkspaceDescription
