"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EventCard, type EventCardProps } from "./EventCards"

export interface EventsSectionProps {
  title: string
  aboutTitle?: string
  events: EventCardProps[]
  onSeeAll?: () => void
  className?: string
}

export function EventsSection({
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

  // ✅ Apply gradient bg if title is "Upcoming Events"
  const isUpcoming = title.toLowerCase() === "upcoming events"

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full py-12 px-0 transition-all duration-500",
        isUpcoming
          ? "bg-gradient-to-r from-[#1f2335] via-[#262b41] to-[#2b3148] text-white"
          : "bg-white text-black",
        className
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto px-[4px] md:px-[20px]">
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between mb-2 transition-all duration-500 delay-100",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}
        >
          <div>
            <h3
              className={cn(
                "text-[24px] md:text-[26px] font-bold",
                isUpcoming ? "text-white" : "text-[#333333]"
              )}
            >
              {title}
            </h3>
            {aboutTitle && (
              <p
                className={cn(
                  "text-[14px] mt-1",
                  isUpcoming ? "text-gray-300" : "text-gray-600"
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
                "group/btn gap-1 flex text-[14px] cursor-pointer",
                isUpcoming ? "text-white" : "text-[#d1410c]"
              )}
            >
              See All
              <ChevronRight
                className={cn(
                  "size-4",
                  isUpcoming ? "text-white" : "text-[#d1410c]"
                )}
              />
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-[6px] lg:gap-[12px]"
          style={{ justifyContent: "center" }}
        >
          {events.map((event, index) => (
            <div
              key={index}
              style={{
                transitionDelay: `${index * 80}ms`,
              }}
            >
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
