"use client"

import Image from "next/image"

interface EventCardProps {
  event: {
    id: number
    title: string
    club: string
    image: string
    date: string
    attendees: number
  }
}

export default function SeeAllEventCard({ event }: EventCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden  transition-all duration-300">
      
      {/* Event Image */}
      <div className="relative h-56 w-full bg-muted overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Event content */}
      <div className="px-1 py-4  space-y-1">
        <h3 className="font-medium text-[#1a1a1a] text-[18px]  line-clamp-1 tracking-tight">
          {event.title}
        </h3>
        <p className="text-[14px] text-[#666666] line-clamp-1">
          {event.club}
        </p>
      </div>
    </div>
  )
}
