// // hooks/useLastActiveWorkspace.ts
// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'

// export const useLastActiveWorkspace = () => {
//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ['lastActiveWorkspace'],
//     queryFn: async () => {
//       const res = await axios.get('/api/workspace/lastActiveWorkspace')
//       return res.data
//     },
//     refetchOnWindowFocus: false,
//   })

//   return {
//     workspace: data?.workspace,
//     isLoading,
//     isError,
//     refetch, // optional if you want to re-call manually
//   }
// }
