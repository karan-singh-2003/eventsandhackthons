"use client"

import {  ThumbsUp } from "lucide-react"

import ActiveEventImage from "./ActiveEventImage"
import ActiveEventDescription from "./ActiveEventDescription"

import EventOrganizer from "./EventOrgainzersection"
import EventTermsCondition from "./EventTermCondition"
import EventYouMayAlsoLike from "./EventYouMayLike"

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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-1 space-y-4">
      {/* Event Image */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <ActiveEventImage />
      </div>

      {/* Action Buttons */}
     <div className="flex flex-col sm:flex-row gap-3 lg:gap-2 justify-end items-center">
  {/* Interested Button */}
  <button
    onClick={() => onInterestChange(!isInterested)}
    className={`
      flex items-center justify-center gap-2
      w-full sm:w-auto
      px-2 py-2 
      rounded-lg border transition-all duration-300
      border-[#d1410c] text-[#d1410c] font-medium
      hover:bg-[#d1410c] hover:text-white
      text-sm md:text-base lg:text-[12px]
      shadow-sm hover:shadow-md
    `}
  >
    <ThumbsUp className="w-4 h-4" />
    {isInterested ? "you & 12k are  interested." : "I am Interested"}
  </button>

  {/* Favorite (Heart) Button */}
  
</div>


      

      {/* Event Description Section */}
      <div className="bg-white p-1 lg:p-2">
        <ActiveEventDescription />
      </div>

      {/* Event Organizer Section */}
      <div className="bg-white p-1 lg:p-2 ">
        <EventOrganizer />
      </div>

  <div className="bg-white p-1 lg:p-2 ">
         <EventTermsCondition />
        
       
       </div>
 
 <div className="bg-white p-1 lg:p-2 ">
        <EventYouMayAlsoLike/>
       
        
       
      </div>
 
    </div>
  )
}
