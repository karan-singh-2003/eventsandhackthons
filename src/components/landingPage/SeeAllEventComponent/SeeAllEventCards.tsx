"use client"

import { Calendar } from "lucide-react";
import Image from "next/image"

interface EventCardProps {
  event:any
}

export default function SeeAllEventCard({ event }: EventCardProps) {
    const isEnrolled = event?.userStatus?.isEnrolled || false;
     const startDate = event?.startDate
    ? new Date(event.startDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No Date"
  return (
    <div className="group relative rounded-xl mb-1 lg:mb-6 overflow-hidden  transition-all duration-300"
    onClick={() => window.location.href = `/event/${event.id}`}
    >
      
      {/* Event Image */}
      <div className="relative h-76 w-full bg-muted overflow-hidden">
        <img
          src={event.bannerUrl || "/placeholder.svg"}
          alt={event.name || "Event Banner"}
       
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
      </div>

 <div className="flex items-center bg-black p-2 rounded-b-lg gap-2 text-white">
            <Calendar className="size-4" />
            <span className="text-sm font-medium">{startDate}</span>
          </div>

      {/* Event content */}
      <div className="px-1 py-4  space-y-1">
        <h3 className="font-medium text-[#1a1a1a] text-[18px]  line-clamp-1 tracking-tight">
          {event.name || "Event Name"}
        </h3>
        <p className="text-[12px] text-[#666666] line-clamp-1">
          {event.workspace.name || "Workspace Name"}
        </p>
        {isEnrolled && (
       <p className="text-[11px] text-green-600 line-clamp-1">
         Enrolled
       </p>
        
        
        )}
      </div>
    </div>
  )
}
