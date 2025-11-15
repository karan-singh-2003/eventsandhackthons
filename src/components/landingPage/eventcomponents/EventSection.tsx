"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { EventCard, type EventCardProps } from "./EventCards"

export interface EventsSectionProps {
  title: string
  aboutTitle?: string
  events: EventCardProps[]
  onSeeAll?: () => void
  className?: string
  isloading?: boolean
}

export function EventsSection({
  isloading,
  title,
  aboutTitle,
  events,
  onSeeAll,
  className,
}: EventsSectionProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const sectionRef = React.useRef<HTMLDivElement>(null)

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

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ⭐ CHANGED: was "isUpcoming"
  const isEnrolledTitle = title.toLowerCase() === "enrolled events"

  // ❌ Empty Events
  if (!events || events.length === 0 && isEnrolledTitle ) {
    return (
      <div className="py-10 text-center text-gray-500 font-medium">
        No events available right now.{title} because you not enrolled in any event
      </div>
    )
  }

 if (!events || events.length === 0  ) {
    return null
  }

  // ⏳ Loading state
  if (isloading) {
    return (
      <div className="py-10 text-center text-gray-500 font-medium">
        Loading events...
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full min-h-[100vh] py-8 sm:py-10 lg:py-8 transition-all duration-500",
        isEnrolledTitle
          ? "bg-gradient-to-r from-[#1f2335] via-[#262b41] to-[#2b3148] text-white"
          : "text-black",
        className
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-3 transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}
        >
          <div className="flex flex-col gap-1">
            <h3
              className={cn(
                "text-2xl lg:text-2xl font-bold",
                isEnrolledTitle ? "text-white" : "text-[#333333]"
              )}
            >
              {title}
            </h3>

            {aboutTitle && (
              <p
                className={cn(
                  "text-sm lg:text-[14px] py-1 leading-snug",
                  isEnrolledTitle ? "text-gray-300" : "text-gray-600"
                )}
              >
                {aboutTitle}
              </p>
            )}
          </div>

          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className={cn(
                "group/btn lg:mt-0 mt-3 flex items-center text-sm lg:text-[14px] font-medium transition-all",
                isEnrolledTitle
                  ? "text-white hover:text-gray-300 cursor-pointer"
                  : "text-[#d1410c] hover:text-[#a63609] cursor-pointer"
              )}
            >
              See All
              <ChevronRight
                className={cn(
                  "size-4 lg:size-4 transition-transform group-hover/btn:translate-x-1 cursor-pointer",
                  isEnrolledTitle ? "text-white" : "text-[#d1410c]"
                )}
              />
            </button>
          )}
        </div>

        {/* Cards */}
        <div
          className={cn(
            "grid gap-3 md:gap-5 lg:gap-6",
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
            "transition-all duration-500"
          )}
        >
          {events.slice(0, 5).map((event, index) => (
            <div
              key={index}
              className="transition-transform duration-500"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* ⭐ FIXED: proper syntax */}
              <EventCard {...event} isEnrolledTitle={isEnrolledTitle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
