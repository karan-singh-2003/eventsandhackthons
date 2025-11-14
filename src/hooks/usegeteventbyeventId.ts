'use client'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

interface EventFetchInput {
  eventId: any
}

const useFetchEventDetails = () => {
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const mutation = useMutation({
    // ✅ Fetch event details using eventId
    mutationFn: async ({ eventId }: any) => {
      const response = await axios.post('/api/event/getactiveEventbyEventId', { eventId })
      return response.data
    },

    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || 'Failed to fetch event details')
        return
      }

    //   toast.success(`Event: ${data.event.name} loaded ✅`)
      // Optional: store or refetch queries if event data impacts others
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setServerError(null)
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while fetching event details'
      setServerError(message)
      toast.error(`❌ ${message}`)
    },
  })

  return {
    ...mutation,
    serverError,
  }
}

export default useFetchEventDetails
