"use client"

import { useEffect, useState } from "react"

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Disable scroll while loader is visible
    document.body.style.overflow = "hidden"

    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 2500)

    // Complete loading after exit animation
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = "auto" // Re-enable scroll
      onLoadingComplete()
    }, 3500)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
      document.body.style.overflow = "auto" // Ensure scroll resets if component unmounts early
    }
  }, [onLoadingComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-all duration-1000 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo with animation */}
        <div
          className={`transition-all duration-700 ${
            isExiting ? "translate-y-[-20px] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <h1 className="text-7xl lg:text-8xl font-bold tracking-tight animate-pulse">events</h1>
        </div>

        {/* Loading indicator */}
        <div className={`flex gap-2 transition-all duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}>
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}
