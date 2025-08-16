'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface RenameInput {
  workspaceId: string;
  name?: string;
  slug?: string;
}

const useRenameWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const slugRef = useRef<any | undefined>(undefined); // Store the current slug for use in onSuccess

  const mutation = useMutation({
    mutationFn: async ({ workspaceId:id, name, slug }: RenameInput) => {
      slugRef.current = slug; // Save the slug before mutation starts

      const response = await axios.patch(
        `/api/workspace/updateworkspacesetting/${id}`,
        {
          ...(name ? { name } : {}),
          ...(slug ? { slug } : {}),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      if (slugRef.current) {
        router.push('/');
      }
      toast.success('Workspace updated');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({queryKey:['notifications-status']})
      setServerError(null);

      // If slug was provided, redirect to home
     
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

export default useRenameWorkspace;
