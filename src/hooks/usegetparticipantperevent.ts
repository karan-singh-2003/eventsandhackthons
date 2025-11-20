'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const usegetparticipantperevent = () => {
  const { workspaceSlug } = useParams();

  return useQuery({
    queryKey: ['participantper-event-data', workspaceSlug],   // IMPORTANT ✔
    queryFn: async () => {
      const response = await axios.get(
        `/api/workspace/dashboardhome/participantevent/${workspaceSlug}`
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

export default usegetparticipantperevent;
