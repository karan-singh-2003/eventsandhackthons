"use client";

import useFetchallEventbyeventId from "@/hooks/usegeteventsallbyeventId";
import ActiveEventrecommond from "./ActiveEventrecommond";
import { useEffect } from "react";

export default function EventYouMayAlsoLike({ eventId }: any) {
  const {
    
    data,
    isPending,
    
  } = useFetchallEventbyeventId(eventId);

 
  if (isPending)
    return <p className="p-20 text-center">Loading events...</p>;

  
  const relatedEvents = data?.events || [];

  return (
    <div className="space-y-5 px-1 lg:px-2">
      <div>
        <h2 className="text-[24px] font-medium text-[#1a1a1a]">You May Also Like</h2>
        <p className="text-[14px] text-[#404040] text-medium">
          Events around you – register now
        </p>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6">
        {relatedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-3">No related events found.</p>
        ) : (
          relatedEvents.slice(0,3).map((event: any) => (
            <ActiveEventrecommond
              key={event.id}
              id={event.id}
              title={event.name}
              society={data?.workspace?.name}
              img={event.bannerUrl}
              eventUserStatus={event.userStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
