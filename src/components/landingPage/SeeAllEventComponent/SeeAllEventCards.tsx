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
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
      {/* Event Image - Larger Focus */}
      <div className="relative h-64 w-full bg-muted overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Event Info - Minimal and Clean */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-card-foreground line-clamp-1">{event.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{event.club}</p>

        {/* Event Meta - Compact */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span>{event.attendees} attending</span>
        </div>
      </div>
    </div>
  )
}
