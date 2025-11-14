"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useTeamEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post("/api/event/enrollment/teamenrollment", payload);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data.message || "Team registration failed");
        return;
      }

      toast.success("Team registered successfully! 🎉");

      // Refresh event details everywhere
      queryClient.invalidateQueries({ queryKey: ["events"] });

    ;
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Team registration failed"
      );
    },
  });
}
