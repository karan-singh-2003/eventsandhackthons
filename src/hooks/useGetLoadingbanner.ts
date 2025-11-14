'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

/**
 * Fetches all events for a given society slug
 * using TanStack Query (GET request version)
 */
const useGetLoadingbanner = () => {
  const query = useQuery({
    queryKey: ['loadingbanner'], // ✅ Unique cache per society
     queryFn: async () => {
   // ✅ Use GET instead of POST
      const response = await axios.get('api/event/latestevent')

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch events')
      }

      return response.data
    },
     // ✅ Only run when slug is available
     staleTime: 1000 * 60 * 5,        // ✅ 5 minutes = fresh period
       // ✅ Keep in memory for 10 minutes
  refetchOnWindowFocus: false,     // 🚫 Won’t refetch when switching tabs
  refetchOnReconnect: true,        // ✅ Safe — refetch if network goes down & back
  refetchOnMount: true,
    
  })

  return query
}

export default useGetLoadingbanner