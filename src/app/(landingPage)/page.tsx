"use client"

import { BannerCategory } from "@/components/landingPage/BannerCategory"
import EventSectionShow from "@/components/landingPage/eventcomponents/EventSectionShow"
import Footer from "@/components/landingPage/Footer landing page/Footer"
import { LandingBanner } from "@/components/landingPage/LandingBanner"
import { LoadingScreen } from "@/components/landingPage/LoadingScreenLandingpage"
import Navbar from "@/components/landingPage/Navbar"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null)

  useEffect(() => {
    // This code runs only on client
    const visited = localStorage.getItem("hasVisited")

    if (visited) {
      setIsFirstVisit(false)
      setIsLoading(false)
      setShowContent(true)
    } else {
      setIsFirstVisit(true)
      setIsLoading(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    localStorage.setItem("hasVisited", "true")
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  // ❗ Prevent rendering until we know firstVisit state
  if (isFirstVisit === null) {
    return null
  }

  return (
    <>
      {/* Show loader ONLY on first visit */}
      {isFirstVisit && isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

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
            <LandingBanner />
          </div>

          <div
            className={`transition-all duration-700 delay-500 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <BannerCategory />
          </div>

          <EventSectionShow />
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  )
}
