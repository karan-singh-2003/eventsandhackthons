"use client";

import { useEnrolledEvents } from "@/hooks/useenrolledevents";
import { EnrolledEventCard } from "./EnrolledEventCard";

export function EnrolledEventsList() {
  const { data, isPending, error } = useEnrolledEvents();

  if (isPending)
    return <p className="text-sm text-gray-600">Loading your events...</p>;

  if (error)
    return <p className="text-red-500 text-sm">Failed to load events.</p>;

  const events = data?.events ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-[25px] text-[#1e0a3c] font-bold mb-2">
          My Events
        </h1>
        <p className="text-[#6f7287] text-sm lg:text-[13px]">
          Manage your event enrollments and browse upcoming events
        </p>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-[#6f7287] text-sm">You have not enrolled in any events yet.</p>
        ) : (
          events.map((event: any) => (
            <EnrolledEventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
