import {
  useQuery,
  type QueryKey,
  type QueryFunction,
  type Enabled,
} from '@tanstack/react-query'

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled: Enabled = true
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime: 1000 * 60 * 5,     // ✅ 5 minutes: data is "fresh" for this time
     // ✅ 10 minutes: unused cache remains for this time
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return { data, isPending, isFetched, refetch, isFetching }
}
