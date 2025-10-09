"use client"

import { BannerCategory } from "@/components/landingPage/BannerCategory"
import { EventsSection } from "@/components/landingPage/eventcomponents/EventSection"
import EventSectionShow from "@/components/landingPage/eventcomponents/EventSectionShow"
import { LandingBanner } from "@/components/landingPage/LandingBanner"
import { LoadingScreen } from "@/components/landingPage/LoadingScreenLandingpage"
import Navbar from "@/components/landingPage/Navbar"
import { useState } from "react"
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

  
          <Navbar />
  
      <div
        className={`min-h-screen transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
       
        <main>
          <div
            className={`transition-all duration-700 delay-300 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <LandingBanner/>
          </div>
          <div
            className={`transition-all duration-700 delay-500 ${
              showContent ? "opacity-100 translate-y-0                                                                                                                                            " : "opacity-0 translate-y-8"
            }`}
          >                                                                               
            <BannerCategory />
          </div>

          <EventSectionShow/>
        </main>
      </div>
    </>
  )
}
