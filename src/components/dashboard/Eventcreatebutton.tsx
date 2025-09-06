"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EventCreateModal } from "@/components/dashboard/EventcreateModal";
import { useEventModalStore } from "@/store/modal-slice";
import { usePanelStore } from "@/store/modal-slice";
import { useRouter } from "next/navigation";

interface EventCreateButtonProps {
  workspaceSlug: any;
}

export const EventCreateButton: React.FC<EventCreateButtonProps> = ({ workspaceSlug }) => {
  const { openModal } = useEventModalStore();
  const { togglePanel } = usePanelStore();

  async function fetchLastActiveEvent(workspaceSlug: any) {
    const res = await fetch(`/api/event/${workspaceSlug}/lastActiveEvent`);
    if (!res.ok) throw new Error("Failed to fetch last active event");
    return res.json();
  }
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["lastActiveEvent", workspaceSlug],
    queryFn: () => fetchLastActiveEvent(workspaceSlug),
  });

  if (isLoading) {
    return (
      <button className="flex items-center justify-center rounded-2xl border border-transparent bg-gray-100 p-1 text-gray-400 animate-pulse">
        ...
      </button>
    );
  }

  const lastEvent = data?.lastActiveEvent;

  return (
    <>
      {!lastEvent ? (
        // If no event → show Create Button
        <button
          onClick={openModal}
          className="flex items-center justify-center rounded-2xl border border-transparent bg-[#f3f1f1] p-1 text-[#535353] hover:bg-[#e6e6e6] transition"
        >
          <Plus size={22} />
        </button>
      ) : (
        // If event exists → open panel with event data
        <button
  onClick={() => {togglePanel("event", lastEvent)
     router.push(`/workspace/${workspaceSlug}/event/${lastEvent.name}`); 
  }}
  className="flex items-center justify-center rounded-2xl border border-transparent bg-[#f3f1f1] w-8 h-8 text-[#535353] font-bold hover:bg-[#e6e6e6] transition"
>
  {lastEvent.name.charAt(0).toUpperCase()}
</button>


      )}

      {/* Modal */}
      <EventCreateModal workspaceSlug={workspaceSlug} />
    </>
  );
};
