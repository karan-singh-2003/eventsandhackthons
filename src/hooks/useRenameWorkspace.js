'use client';

import { useState } from 'react';
import useMutationData from './useMutationData';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const useRenameWorkspace = ({ workspaceSlug }) => {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['RenameWorkspace'],
    mutationFn: async ({ name }) => {
      const response = await axios.post('/api/workspace/updateworkspace', {
        name,
        workspaceSlug,
      });
      return response.data;
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      toast.error(`Error: ${errorMessage}`);
    },
   
    queryKey: 'workspaces',
    onSuccess: async () => {
  toast.success('Workspace renamed successfully!')
 
  
    router.push(`/`)
  },
  
  });

  return {
    mutate,
    isPending,
    data,
    serverError,
  };
};

export default useRenameWorkspace;
