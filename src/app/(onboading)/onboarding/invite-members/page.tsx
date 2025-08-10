'use client'

import React from 'react'
import InviteMembers from '@/components/Onboarding/InviteMembers'
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout'
// import OnboardingActions from '@/components/Onboarding/OnboardingActions'
import { useWorkspaceName } from '@/context/WorkspaceContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const InvitePage = () => {
  const workspaceName = useWorkspaceName()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSkip = async () => {
    setLoading(true)
    try {
      // Navigate to manage roles page
      router.push('/onboarding/manage-role')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Navigate to manage roles page to complete setup
      router.push('/onboarding/manage-role')
    } finally {
      setLoading(false)
    }
  }

  const actions = [
    {
      label: 'Skip for now',
      onClick: handleSkip,
      variant: 'outline' as const,
      loading,
    },
    {
      label: 'Complete Setup',
      onClick: handleComplete,
      variant: 'secondary' as const,
      loading,
    },
  ]

  return (
    <OnboardingLayout
      title="Invite Members to your Workspace"
      subtitle="Add teammates to get things done together. You can always update permissions later"
      workspaceName={workspaceName}
      isLoading={false}
      loadingTitle="Loading workspace..."
    >
      <InviteMembers />
      {/* <OnboardingActions actions={actions} layout="inline" /> */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push('/onboarding/manage-role')}
      >
        Continue
      </Button>
    </OnboardingLayout>
  )
}

export default InvitePage
