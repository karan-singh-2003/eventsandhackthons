'use client';

import { useState } from 'react';
import useMutationData from './useMutationData';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteWorkspaceProps {
  workspaceSlug: string;
}

export const useDeleteWorkspace = ({ workspaceSlug }: DeleteWorkspaceProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['deleteWorkspace', workspaceSlug],
    mutationFn: async () => {
      const response = await axios.post('/api/workspace/deleteworkspace', {
        workspaceSlug,
      });
      return response.data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Something went wrong';
      toast.error(`Error: ${errorMessage}`);
      setServerError(errorMessage);
    },
    onSuccess: () => {
      toast.success('Workspace deleted successfully ✅');
      // Invalidate the workspaces query to refresh list
      // You can optionally do this inside useMutationData as well
      // router.push fallback handled outside
      router.push('/');
    },
    queryKey: 'workspaces',
  });

  return {
    mutate,
    isPending,
    data,
    serverError,
  };
};
