"use client"

import { useState } from "react"



import ActiveEventheader from "./ActiveEventheader"
import ActiveEventContent from "./ActiveEventContent"
import ActiveEventRegistrationCard from "./ActiveEventRegistrationCard"

export default function EventDetailsPage() {
  const [isInterested, setIsInterested] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
      <div className="min-h-screen bg-background">
      {/* <EventHeader /> */}

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
            <div className="lg:col-span-1">
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
