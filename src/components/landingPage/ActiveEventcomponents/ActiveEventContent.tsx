"use client"

import { Heart, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"

import ActiveEventImage from "./ActiveEventImage"
import ActiveEventDescription from "./ActiveEventDescription"
import ActiveEventbelowsection from "./ActiveEventbelowsection"
import EventOrganizer from "./EventOrgainzersection"

interface EventContentProps {
  isInterested: boolean
  isFavorite: boolean
  onInterestChange: (value: boolean) => void
  onFavoriteChange: (value: boolean) => void
}

export default function ActiveEventContent({
  isInterested,
  isFavorite,
  onInterestChange,
  onFavoriteChange,
}: EventContentProps) {
  return (
    <div className="space-y-8">
      {/* Event Image */}
      <ActiveEventImage/>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant={isInterested ? "default" : "outline"}
          className="flex-1 gap-2"
          onClick={() => onInterestChange(!isInterested)}
        >
          <ThumbsUp className="w-4 h-4" />
          {isInterested ? "Interested" : "I am Interested"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onFavoriteChange(!isFavorite)}
          className={isFavorite ? "bg-red-50 border-red-200" : ""}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      {/* Event Details */}
      <ActiveEventbelowsection />

      {/* Event Description */}
      <ActiveEventDescription />

      {/* Event Organizer */}
      <EventOrganizer />
    </div>
  )
}
