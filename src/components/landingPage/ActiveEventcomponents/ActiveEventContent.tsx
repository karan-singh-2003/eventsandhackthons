"use client"

import {  ThumbsUp } from "lucide-react"

import ActiveEventImage from "./ActiveEventImage"
import ActiveEventDescription from "./ActiveEventDescription"

import EventOrganizer from "./EventOrgainzersection"
import EventTermsCondition from "./EventTermCondition"
import EventYouMayAlsoLike from "./EventYouMayLike"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { getAuthData } from "@/lib/auth-client"

interface EventContentProps {
  event:any
  eventUserStatus?: any
}

export default function ActiveEventContent({
  event, eventUserStatus
}: EventContentProps) {


  const [isInterested, setIsInterested] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name?: string; universityId?: string } | null>(null)

  // ✅ Get logged-in user info
  useEffect(() => {
    try {
      const authData = getAuthData()
      setUserInfo(authData?.userInfo || null)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUserInfo(null)
    }
  }, [])

  // ✅ Handle interest button click
  const handleInterestClick = () => {
    if (!userInfo) {
      toast.info("✨ Please sign in to show your interest!", {
        description: "Login now to stay updated on event details 🎉",
        duration: 3500,
      })
      return
    }

    setIsInterested((prev:any) => !prev)
    toast.success(
      isInterested ? "You removed your interest 👋" : "Thanks for showing interest ❤️"
    )
  }


  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-1 space-y-4">
      {/* Event Image */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <ActiveEventImage eventimg={event.bannerUrl}/>
      </div>

      {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 lg:gap-2 justify-end items-center">
        {/* Interested Button */}
        <button
          onClick={handleInterestClick}
          className={`
            flex items-center justify-center gap-2
            w-full sm:w-auto
            px-2 py-2 
            rounded-lg border hover:cursor-pointer transition-all duration-300
            border-[#d1410c] text-[#d1410c] font-medium
            hover:bg-[#d1410c] hover:text-white
            text-sm md:text-base lg:text-[12px]
            shadow-sm hover:shadow-md
          `}
        >
          <ThumbsUp
            className={`w-4 h-4 ${isInterested ? "text-white" : "text-[#d1410c]"}`}
          />
          {isInterested ? "Interested!" : "I am Interested"}
        </button>
      </div>



      

      {/* Event Description Section */}
      <div className="bg-white p-1 lg:p-2">
        <ActiveEventDescription description={event.description} externalLink={event} />
      </div>

      {/* Event Organizer Section */}
      <div className="bg-white p-1 lg:p-2 ">
        <EventOrganizer />
      </div>

  <div className="bg-white p-1 lg:p-2 ">
         <EventTermsCondition />
        
       
       </div>
 
 <div className="bg-white p-1 lg:p-2 ">
        <EventYouMayAlsoLike eventId={event.id} />
       
        
       
      </div>
 
    </div>
  )
}
