'use client'

import useMutationData from '@/hooks/useMutationData'
import useZodForm from './useZodForm'
import { createWorkspaceSchema } from '@/schemas/WorkspaceSchema'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '@/context/WorkspaceContext'

const useCreateWorkspace = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()
  const { setWorkspace } = useWorkspace()

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['createWorkspace'],
    mutationFn: async (data: {
      workspacename: string
      workspaceslug: string
    }) => {
      console.log('🏢 [useCreateWorkspace] Creating workspace with data:', data)

      const response = await fetch('/api/workspace/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Throw the specific error message from the API
        throw new Error(
          result.error || 'An error occurred while creating workspace.'
        )
      }

      console.log('✅ [useCreateWorkspace] API response structure:', result)

      // Extract workspace data from response
      const workspaceData = {
        id:
          result.workspace?.id ||
          result.data?.id ||
          result.id ||
          crypto.randomUUID(),
        name: result.workspace?.name || data.workspacename,
        slug: result.workspace?.slug || data.workspaceslug,
        description:
          result.workspace?.description ||
          result.data?.description ||
          undefined,
      }

      console.log(
        '💾 [useCreateWorkspace] Saving workspace to context:',
        workspaceData
      )

      // Save workspace to context
      setWorkspace(workspaceData)

      // Navigate to next step in onboarding
      console.log('🔄 [useCreateWorkspace] Navigating to invite members...')

      // Navigate to invite members step
      router.push('/onboarding/manage-role')

      return result
    },
    onError: (error: Error) => {
      console.error('❌ [useCreateWorkspace] Error creating workspace:', error)
      setServerError(error.message)
    },
    onSuccess: () => {
      console.log('✅ [useCreateWorkspace] Workspace created successfully!')
    },
    queryKey: 'workspaces',
  })

  const { register, errors, onFormSubmit, isValid, watch, setValue } =
    useZodForm(createWorkspaceSchema, mutate)

  return {
    register,
    errors,
    onFormSubmit,
    isValid,
    isPending,
    setValue,
    data,
    watch,
    serverError,
  }
}

export default useCreateWorkspace
