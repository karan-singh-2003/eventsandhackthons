'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface EventInput {
  workspaceSlug: string;
  name: string;
  isOnline: boolean;
}

const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ workspaceSlug, name, isOnline }: EventInput) => {
      const response = await axios.post(`/api/event/create/${workspaceSlug}`, {
        name,
        isOnline,
      });
      return response.data; // ✅ expect { slug, ... }
    },
    onSuccess: (data, variables) => {
      toast.success('Event created successfully');

      // ✅ invalidate caches
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-status'] });

      setServerError(null);

      // ✅ redirect to event page
       window.location.href = `/workspace/${variables.workspaceSlug}/event/${data.name}`;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || 'Something went wrong';
      setServerError(message);
      toast.error(`Error: ${message}`);
    },
  });

  return {
    ...mutation,
    serverError,
  };
};

export default useCreateEvent;
