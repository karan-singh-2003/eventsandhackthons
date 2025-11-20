import { useQuery } from "@tanstack/react-query";

export function useEnrolledEvents() {
  return useQuery({
    queryKey: ["user-enrolled-events"],
    queryFn: async () => {
      const res = await fetch("/api/event/getenrolledevents");

      if (!res.ok) {
        throw new Error("Failed to fetch enrolled events");
      }

      return res.json();
    },

     staleTime: 1000 * 60 * 5,              // Data fresh for 5 minutes
    gcTime: 1000 * 60 * 10,                // Cache kept for 10 minutes
    refetchOnWindowFocus: false,           // Do not auto-refetch on tab focus
    refetchOnReconnect: true,              // Refetch when internet reconnects
    refetchOnMount: false, 
  });
}
