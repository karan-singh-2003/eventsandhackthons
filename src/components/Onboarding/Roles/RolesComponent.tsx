import React from 'react'
import RoleManager from './RoleManager'
import { RoleResponse } from './types'

import { useQueryData } from '@/hooks/useQueryData'
import { useWorkspaceSlug } from '@/context/WorkspaceContext'
import PageLoader from '@/components/global/PageLoader'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const RolesComponent = () => {
  const workspaceSlug = useWorkspaceSlug()

  const router = useRouter()

  const { data } = useQueryData<RoleResponse[]>(
    ['getAllRolesOfWorkspace', workspaceSlug],
    async () => {
      const response = await fetch(
        `/api/roles?workspaceSlug=${workspaceSlug}&action=getAll`
      )
      const result = await response.json()
      return result.data || []
    }
  )

  // Show no workspace state
  if (!workspaceSlug) {
    console.log('❌ No workspace slug found')
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 font-medium mb-4 text-sm">
          No workspace selected. Redirecting to workspace creation...
        </div>
        <div className="text-sm text-gray-600 mb-4">
          You&apos;ll be redirected to create a workspace in 2 seconds.
        </div>
        <Button
          onClick={() =>
            router.push('/onboarding/create-workspace?onboarding=true')
          }
          className="mb-4"
        >
          Create Workspace Now
        </Button>
        <PageLoader title="Redirecting..." />
      </div>
    )
  }

  const roles = data || []
  console.log('✅ Rendering roles:', roles)

  return (
    <div>
      <RoleManager Roles={roles} />
    </div>
  )
}

export default RolesComponent
