"use client"

import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StickyScrollHeaderProps {
  eventName: string
  showHeader: boolean
}

export default function StickyScrollHeader({
  eventName,
  showHeader,
}: StickyScrollHeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 border-b border-border bg-card/95 backdrop-blur-sm z-40 transition-all duration-300 ${
        showHeader
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3  lg:px-3 py-3 lg:py-3">
        {/* Left: Event Name */}
        <div className="flex items-center gap-3">
          

          <h1 className="text-base  md:text-xl lg:text-[24px] font-semibold text-[#1a1a1a] truncate">
            {eventName}
          </h1>
        </div>

        {/* Right: Share Button with Tooltip */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Share event"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a1a]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
