"use client"

import { useState, useEffect } from "react"
import ActiveEventheader from "./ActiveEventheader"
import StickyScrollHeader from "./StickyEventHeader"
import ActiveEventContent from "./ActiveEventContent"
import ActiveEventRegistrationCard from "./ActiveEventRegistrationCard"

export default function EventDetailsPage() {
  const [isInterested, setIsInterested] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Clear existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }

        // Set new timeout for 2 seconds
        const timeout = setTimeout(() => {
          setShowStickyHeader(true)
        }, 100)

        setScrollTimeout(timeout)
      } else {
        // Hide header when scrolled back to top
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }
        setShowStickyHeader(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [scrollTimeout])

  return (
    <div className="min-h-screen bg-background">
      {/* <ActiveEventheader /> */}

      <StickyScrollHeader eventName="Ethical Hacking Workshop" showHeader={showStickyHeader} />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left section - scrolls with page */}
            <div className="lg:col-span-2">
              <ActiveEventContent
                isInterested={isInterested}
                isFavorite={isFavorite}
                onInterestChange={setIsInterested}
                onFavoriteChange={setIsFavorite}
              />
            </div>

            {/* Right sticky section - stays fixed while page scrolls */}
            <div className="lg:col-span-1  ">
              <div className="sticky top-8 h-fit z-10">
                <ActiveEventRegistrationCard isInterested={isInterested} isFavorite={isFavorite} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
