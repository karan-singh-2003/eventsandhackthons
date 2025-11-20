'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const usegetEventCategoryParticipant = () => {
  const { workspaceSlug } = useParams();

  return useQuery({
    queryKey: ['eventparticpantcategory-data', workspaceSlug],   // IMPORTANT ✔
    queryFn: async () => {
      const response = await axios.get(
        `/api/workspace/dashboardhome/eventparticpantcategory/${workspaceSlug}`
      );

      return response.data; // KPI array
    },
    enabled: !!workspaceSlug, // Runs only after slug is ready

    staleTime: 1000 * 60 * 5,   // 5 minutes
    gcTime: 1000 * 60 * 10,     // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};

export default usegetEventCategoryParticipant;
