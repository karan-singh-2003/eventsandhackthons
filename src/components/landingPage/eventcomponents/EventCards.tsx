"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export interface EventCardProps {
  eventId?: any
  eventName: string
  eventImage: string
  eventDate: string
  society: string
  description?: string
  eventSlug?: any 
  isEnrolled?: boolean
  isEnrolledTitle?: boolean   // ⭐ NEW PROP
  onClick?: () => void
}

export function EventCard({
  eventName,
  eventImage,
  eventDate,
  society,
  eventId,
  isEnrolled = false,
  isEnrolledTitle = false,   // ⭐ USE HERE
}: EventCardProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  // ⭐ NEW: Use this for the background logic
  const isSpecialStyle = isEnrolledTitle === true

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/event/${eventId}`)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg transition-all duration-500 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        "w-[250px] lg:w-[235px]",
        isSpecialStyle ? "bg-transparent" : "bg-card"
      )}
    >
      {/* Top Image */}
      <div className="relative h-[320px] lg:h-[350px] overflow-hidden rounded-t-lg">
        <img
          src={eventImage || "/placeholder.svg"}
          alt={eventName}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            "group-hover:scale-105"
          )}
        />
      </div>

      {/* Date Bar */}
      <div className="flex items-center bg-black p-2 rounded-b-lg gap-2 text-white">
        <Calendar className="size-4" />
        <span className="text-sm font-medium">{eventDate}</span>
      </div>

      {/* Event Details */}
      <div
        className={cn(
          "flex flex-col gap-2 py-4 transition-all",
          isSpecialStyle ? "bg-transparent text-white" : "bg-white text-[#222222]"
        )}
      >
        <p className="font-semibold text-[18px] line-clamp-2">{eventName}</p>
        <p className="text-[14px]">{society}</p>

        {isEnrolled && (
          <p
            className={cn(
              "font-sans text-[12px]",
              isSpecialStyle ? "text-green-300" : "text-green-600"
            )}
          >
            Enrolled
          </p>
        )}
      </div>
    </div>
  )
}
