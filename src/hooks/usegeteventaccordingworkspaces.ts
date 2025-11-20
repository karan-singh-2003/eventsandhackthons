import { useQuery } from "@tanstack/react-query";

export function usegeteventaccordingworkspaces() {
  const {
    data = { data: [] },
    isPending,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/event/eventsaccordingworkspace", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch public events");
      }

      return res.json();
    },

    // -----------------------
    // 🔥 TanStack Query Options
    // -----------------------

    staleTime: 1000 * 60 * 5,              // Data fresh for 5 minutes
    gcTime: 1000 * 60 * 10,                // Cache kept for 10 minutes
    refetchOnWindowFocus: false,           // Do not auto-refetch on tab focus
    refetchOnReconnect: true,              // Refetch when internet reconnects
    refetchOnMount: false,                 // Do NOT refetch on component mount
  });

  return {
    workspaces: data.data ?? [],
    isPending,
    isFetching,
    error,
  };
}
