'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageLoader from '@/components/global/PageLoader'
import axios from 'axios'
import { getAuthData } from '@/lib/auth-client'
import WorkspaceDescription from '@/components/Onboarding/InviteMembers/WorksapceDescriptionAvatar'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/global/Spinner'
import { useQueryData } from '@/hooks/useQueryData'

export type InviteResponse = {
  valid: boolean
  message?: string
  redirectTo?: string
  invite?: {
    id: string
    linkPublic: boolean
    expiresAt: string
    isLink: boolean
    role: {
      id: string
      name: string
    }
    workspace: {
      id: string
      name: string
      slug: string
    }
  }
}

const InvitePageRedirect = () => {
  const params = useParams()
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(true)

  // 🍪 Check auth and set token on mount
  useEffect(() => {
    const fetchAuth = async () => {
      const t =
        localStorage.getItem('pending_invite_token') || (params.token as string)
      setToken(t)

      const { userInfo } = await getAuthData()
      if (!userInfo) {
        if (t) localStorage.setItem('pending_invite_token', t)
        window.location.href = '/sign-in'
        return
      }

      setRedirecting(false)
    }

    fetchAuth()
  }, [params.token])

  const { data: inviteResponse, isPending: validatingToken } =
    useQueryData<InviteResponse>(
      ['invite-validate', token],
      () =>
        axios.post('/api/invite/validate', { token }).then((res) => res.data),
      true
    )
  useEffect(() => {
    if (inviteResponse?.valid) {
      setRedirecting(false)
    }
    // Handle redirect if user is already a member
    if (inviteResponse?.redirectTo) {
      console.log(
        'User already a member, redirecting to:',
        inviteResponse.redirectTo
      )
      window.location.href = inviteResponse.redirectTo
    }
  }, [inviteResponse])
  console.log('Invite response:', inviteResponse)

  const handleAcceptInvite = async () => {
    if (!token) return

    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/invite/accept', { token })

      if (response.data.redirectTo) {
        // User was added directly to workspace
        window.location.href = response.data.redirectTo
      } else {
        // Join request was sent, show success message
        alert(response.data || 'Your join request has been sent!')
        // Optionally redirect to a different page or refresh
        window.location.reload()
      }
    } catch (error: unknown) {
      console.error('Error accepting invite:', error)
      const axiosError = error as { response?: { data?: string } }
      const errorMessage =
        axiosError?.response?.data ||
        'Failed to accept invite. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (redirecting || validatingToken) {
    return (
      <div className="h-screen flex items-center justify-center">
        <PageLoader title="Redirecting..." />
      </div>
    )
  }

  return (
    <div className="h-[300px] w-[350px] mx-auto mt-[50px] flex flex-col items-center justify-center">
      <WorkspaceDescription setIsPrivate={() => {}} />

      <h1 className="text-center font-medium text-[#696767] text-[15px] mb-4">
        {inviteResponse?.invite?.linkPublic
          ? 'Only selected members can access this workspace. Please request permission from the owner to join.'
          : 'Anyone can join this workspace and become a member instantly.'}
      </h1>

      {inviteResponse?.message ? (
        <p className="text-center text-green-700 font-medium text-sm mb-4">
          Successfully validated invite for{' '}
          <b>{inviteResponse.invite?.workspace.name}</b>
        </p>
      ) : inviteResponse?.valid && !inviteResponse?.redirectTo ? (
        <Button
          className="bg-[#246EFF] rounded-none"
          onClick={handleAcceptInvite}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner />
          ) : inviteResponse?.invite?.linkPublic ? (
            'Send Join Request'
          ) : (
            'Join Workspace'
          )}
        </Button>
      ) : null}
    </div>
  )
}

export default InvitePageRedirect
