'use client'

import React from 'react'
import RolesComponent from '@/components/Onboarding/Roles/RolesComponent'
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout'
// import OnboardingActions from '@/components/Onboarding/OnboardingActions'
import {
  useWorkspaceNameSafe,
  useWorkspaceSlugSafe,
} from '@/context/WorkspaceContext'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const ManageRolePage = () => {
  const workspaceName = useWorkspaceNameSafe()
  const workspaceSlug = useWorkspaceSlugSafe()
  const router = useRouter()

  return (
    <OnboardingLayout
      title="Manage Roles"
      subtitle="Set up and manage user roles for your workspace. Define permissions and access levels for different team members."
      workspaceName={workspaceName}
      isLoading={false}
    >
      {workspaceSlug && (
        <p className="text-sm text-gray-500">Workspace: {workspaceSlug}</p>
      )}
      <RolesComponent />
      {/* <OnboardingActions actions={actions} layout="stacked" /> */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push(`/onboarding/invite-members`)}
      >
        Continue
      </Button>
    </OnboardingLayout>
  )
}

export default ManageRolePage
