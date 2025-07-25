'use client'

import useMutationData from '@/hooks/useMutationData'
import useZodForm from './useZodForm'
import { createWorkspaceSchema } from '@/Schemas/WorkspaceSchema'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const useCreateWorkspace = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams?.get('onboarding') === 'true'

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['createWorkspace'],
    mutationFn: async (data: {
      workspacename: string
      workspaceslug: string
    }) => {
      console.log('Creating workspace with data:', data)

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

      // Use the slug from the request data (which is the generated slug)
      const workspaceSlug = data.workspaceslug
      const encodedSlug = encodeURIComponent(workspaceSlug)

      if (isOnboarding) {
        router.push(`/manage-role?slug=${encodedSlug}`)
      } else {
        router.push(`/${encodedSlug}`)
      }

      return result
    },
    onError: (error: Error) => {
      console.error('Error creating workspace:', error)
      setServerError(error.message)
    },
    onSuccess: () => {
      console.log('Workspace created successfully, redirecting...')
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
