import useMutationData from '@/hooks/useMutationData'
import useZodForm from './useZodForm'
import { logInSchema } from '@/Schemas/LogInSchema'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useLogInUser = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { data, isPending, mutate } = useMutationData({
    mutationKey: ['loginUser'],
    mutationFn: async (data: { universityId: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred while logging in.')
      }

      return result
    },
    onSuccess: () => {
      console.log('Login successful')
      router.push('/')
    },
    onError: (error: Error) => {
      console.error('Error logging in:', error)
      setServerError(error.message)
    },
  })

  const { register, errors, onFormSubmit, watch, isValid } = useZodForm(
    logInSchema,
    mutate
  )
  useEffect(() => {
    const subscription = watch(() => {
      setServerError(null)
    })

    return () => subscription.unsubscribe()
  }, [watch])

  return {
    register,
    errors,
    isValid,
    watch,
    onFormSubmit,
    isPending,
    data,
    mutate,
    serverError,
  }
}
