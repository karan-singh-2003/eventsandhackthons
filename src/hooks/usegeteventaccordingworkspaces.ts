import { useQueryData } from "@/hooks/useQueryData";

export function usegeteventaccordingworkspaces() {
  const {
    data: workspaces = { data: [] },
    isPending,
    isFetching,
    error,
  } = useQueryData(
    ["events"], // ✅ unique cache key
    async () => {
      const res = await fetch("/api/event/eventsaccordingworkspace", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
         // ✅ avoid stale data (optional)
      });

      if (!res.ok) {
        throw new Error("Failed to fetch public events");
      }

      return res.json();
    },
    true // ✅ means: enabled by default (based on your hook logic)
  );

  return {
    workspaces: workspaces.data ?? [],
    isPending,
    isFetching,
    error,
  };
}
