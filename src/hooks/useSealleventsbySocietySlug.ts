'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

/**
 * Fetches all events for a given society slug
 * using TanStack Query (GET request version)
 */
const useSeeAllEventsBySocietySlug = (societySlug: string) => {
  const query = useQuery({
    queryKey: ['SeeAllEventsBySocietySlug', societySlug], // ✅ Unique cache per society
    queryFn: async () => {
      if (!societySlug) throw new Error('societySlug is required')

      // ✅ Use GET instead of POST
      const response = await axios.get(`/api/event/getSeeAlleventbysocietySlug?societySlug=${societySlug}`)

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch events')
      }

      return response.data
    },
    enabled: !!societySlug, // ✅ Only run when slug is available
     staleTime: 1000 * 60 * 5,        // ✅ 5 minutes = fresh period
       // ✅ Keep in memory for 10 minutes
  refetchOnWindowFocus: false,     // 🚫 Won’t refetch when switching tabs
  refetchOnReconnect: true,        // ✅ Safe — refetch if network goes down & back
  refetchOnMount: true,
    
  })

  return query
}

export default useSeeAllEventsBySocietySlug
