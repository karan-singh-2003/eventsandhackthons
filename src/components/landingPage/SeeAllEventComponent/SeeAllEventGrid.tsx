"use client"

import SeeAllEventCard from "./SeeAllEventCards"


interface EventGridProps {
  events:any
}

// Mock event data

export default function SeeAllEventGrid({ events }: EventGridProps) {
   const safeEvents = events || []

  return (
     <div className="grid lg:grid-cols-4 grid-cols-1 gap-6   overflow-y-auto pr-2 hide-scrollbar">
      {safeEvents.map((event:any) => (
        <SeeAllEventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
