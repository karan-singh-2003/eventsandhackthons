'use client'

import React from 'react'
import RolesComponent from '@/components/Onboarding/Roles/RolesComponent'
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout'
// import OnboardingActions from '@/components/Onboarding/OnboardingActions'
import { useWorkspaceName, useWorkspaceSlug } from '@/context/WorkspaceContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ManageRolePage = () => {
  const workspaceName = useWorkspaceName()
  const workspaceSlug = useWorkspaceSlug()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    setLoading(true)
    try {
      // Complete onboarding and redirect to dashboard or main app
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const actions = [
    {
      label: 'Continue',
      onClick: handleContinue,
      variant: 'secondary' as const,
      loading,
    },
  ]

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
    </OnboardingLayout>
  )
}

export default ManageRolePage
