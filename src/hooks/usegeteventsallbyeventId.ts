'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

/**
 * Fetches all events for a given society slug
 * using TanStack Query (GET request version)
 */
const useFetchallEventbyeventId = (eventId: string) => {
  const query = useQuery({
    queryKey: ['SeeAllEventsByEventId', eventId], // ✅ Unique cache per society
    queryFn: async () => {
      if (!eventId) throw new Error('eventId is required')

      // ✅ Use GET instead of POST
      const response = await axios.get(`/api/event/geteventsallbyeventId?eventId=${eventId}`)

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch events')
      }

      return response.data
    },
    enabled: !!eventId, // ✅ Only run when slug is available
  staleTime: 1000 * 60 * 5,              // Data fresh for 5 minutes
    gcTime: 1000 * 60 * 10,                // Cache kept for 10 minutes
    refetchOnWindowFocus: false,           // Do not auto-refetch on tab focus
    refetchOnReconnect: true,              // Refetch when internet reconnects
    refetchOnMount: false,   
    
  })

  return query
}

export default useFetchallEventbyeventId
