'use client'

import React from 'react'
import InviteMembers from '@/components/Onboarding/InviteMembers'
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout'
// import OnboardingActions from '@/components/Onboarding/OnboardingActions'
import { useWorkspaceName, useWorkspaceSlug } from '@/context/WorkspaceContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const InvitePage = () => {
  const workspaceName = useWorkspaceName()
  const router = useRouter()

  const workspaceSlug = useWorkspaceSlug()
  console.log('Workspace slug:', workspaceSlug)

  return (
    <OnboardingLayout
      title="Invite Members to your Workspace"
      subtitle="Add teammates to get things done together. You can always update permissions later"
      workspaceName={workspaceName}
      isLoading={false}
      loadingTitle="Loading workspace"
    >
      <InviteMembers />
      {/* <OnboardingActions actions={actions} layout="inline" /> */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push(`/workspace/${workspaceSlug}`)}
      >
        Continue
      </Button>
    </OnboardingLayout>
  )
}

export default InvitePage
