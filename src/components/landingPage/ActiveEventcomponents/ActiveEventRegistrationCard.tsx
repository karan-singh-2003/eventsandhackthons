"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTeamDialogStore } from "@/store/modal-slice"
import TeamRegistrationDialog from "./enrollment/TeamRegistrationDialog"


interface RegistrationCardProps {
  event: {
    id: string
    name: string
    location: string
    startDate: string
    endDate: string
    eventType: string
    workspace: { name: string }
    interestedCount: number
    minTeamSize: number
    maxTeamSize: number
    registrationEndDate: any
    registrationStartDate: any
  }
  eventUserStatus?: any
  eventloggedInUser?: any
}

export default function ActiveEventRegistrationCard({ event, eventUserStatus }: RegistrationCardProps) {

  const queryClient = useQueryClient()

  // -----------------------------
  // EVENT DATE RANGE (DISPLAY ONLY)
  // -----------------------------
  const eventStart = new Date(event.startDate)
  const eventEnd = new Date(event.endDate)

  const durationHours = Math.round(
    (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60)
  )

  // -----------------------------
  // REGISTRATION DATE RANGE (LOGIC)
  // -----------------------------
  const now = new Date()
  const regStart = new Date(event.registrationStartDate)
  console.log("Registration Start Date:", regStart);
  const regEnd = new Date(event.registrationEndDate)

  const isRegistrationNotStarted = now < regStart
  const isRegistrationClosed = now > regEnd
  const isRegistrationOpen = now >= regStart && now <= regEnd
const isEventEnded = now > new Date(event.endDate)
  const isAlreadyEnrolled = eventUserStatus?.isEnrolled

  // -----------------------------
  // STYLES (NO CHANGE)
  // -----------------------------
  const disabledClasses =
    "w-full h-10 sm:h-11 lg:h-12 text-[16px] sm:text-[17px] lg:text-[18px] text-white rounded-xl cursor-not-allowed font-medium bg-[#d1410c] border-[#d1410c] border"

  const activeClasses =
    "w-full h-10 sm:h-11 lg:h-12 text-[16px] sm:text-[17px] lg:text-[18px] text-[#d1410c] rounded-xl cursor-pointer font-medium bg-transparent border-[#d1410c] border hover:bg-[#d1410c] hover:text-white transition-all"

  // -----------------------------
  // TEAM DIALOG
  // -----------------------------
  const openTeamDialog = () => {
    useTeamDialogStore.getState().openDialog(
      event.id,
      event.minTeamSize,
      event.maxTeamSize
    )
  }

  // -----------------------------
  // SOLO ENROLL MUTATION
  // -----------------------------
  const soloEnrollMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch("/api/event/enrollment/soloenrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Enrollment failed")
      return data
    },

    onSuccess: () => {
      toast.success("🎉 Solo enrollment successful!")
      queryClient.invalidateQueries({ queryKey: ["events"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces", event.id] })
      queryClient.invalidateQueries({
        queryKey: ["SeeAllEventsBySocietySlug", event.id],
        
      }
    
    )
    window.location.reload()
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to enroll")
    },
  })

  const handleEnroll = () => {
    soloEnrollMutation.mutate(event.id)
  }

  // -----------------------------
  // BUTTON RENDER LOGIC
  // -----------------------------
  const renderEnrollmentButtons = () => {

  // 0️⃣ EVENT ENDED → Always show Event Closed
  if (isEventEnded) {
    return (
      <button className={disabledClasses} disabled>
        Event Closed
      </button>
    );
  }
   if (isAlreadyEnrolled) {
      return (
        <button className={disabledClasses} disabled>
          Already Enrolled
        </button>
      );
    }

  // 1️⃣ REGISTRATION NOT STARTED
  if (isRegistrationNotStarted) {
    return (
      <button className={disabledClasses} disabled>
        Registration Not Started 
      </button>
    );
  }

  // 2️⃣ REGISTRATION CLOSED (but event still running)
  if (isRegistrationClosed) {
    return (
      <button className={disabledClasses} disabled>
        Registration Closed
      </button>
    );
  }

  // 3️⃣ REGISTRATION OPEN →
  // show Already Enrolled OR allow enrollment
  if (isRegistrationOpen) {

    // Already enrolled → show only this
   

    // ⭐ SOLO EVENT
    if (event.eventType === "SOLO") {
      return (
        <button
          className={activeClasses}
          onClick={handleEnroll}
          disabled={soloEnrollMutation.isPending}
        >
          {soloEnrollMutation.isPending ? "Enrolling..." : "Enroll Solo"}
        </button>
      );
    }

    // ⭐ TEAM EVENT
    if (event.eventType === "TEAM") {
      return (
        <button className={activeClasses} onClick={openTeamDialog}>
          Register as Team
        </button>
      );
    }

    // ⭐ BOTH OPTIONS
    if (event.eventType === "SOLO_AND_TEAM") {
      return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            className={activeClasses}
            onClick={handleEnroll}
            disabled={soloEnrollMutation.isPending}
          >
            {soloEnrollMutation.isPending ? "Enrolling..." : "Enroll Solo"}
          </button>
          <button className={activeClasses} onClick={openTeamDialog}>
            Register as Team
          </button>
        </div>
      );
    }
  }

  return null;
};


  // -----------------------------
  // EVENT DETAILS ARRAY
  // -----------------------------
  const details = [
    {
      icon: Calendar,
      value: `${format(eventStart, "EEE dd MMM yyyy")} -- ${format(
        eventEnd,
        "EEE dd MMM yyyy"
      )}`,
    },
    {
      icon: Clock,
      value: `${format(eventStart, "hh:mm a")} to ${format(
        eventEnd,
        "hh:mm a"
      )}`,
    },
    { icon: Clock, value: `${durationHours} hours total` },
    { icon: Users, value: `Type: ${event.eventType || "N/A"}` },
    { icon: MapPin, value: event.location },
  ]

  // -----------------------------
  // RETURN UI (NO CSS CHANGES)
  // -----------------------------
  return (
    <Card className="shadow-sm w-full max-w-[450px] lg:max-w-[480px] mx-auto transition-all duration-300">
      <CardContent className="pt-6 space-y-6">

        {/* Event Summary */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:gap-4">
            {details.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div key={index} className="flex gap-3 sm:gap-4 items-start mt-1">
                  <div className="flex-shrink-0">
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-[#464646]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#282727] text-[13px] lg:text-[14px] leading-snug">
                      {detail.value}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Workspace */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="flex-shrink-0 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height={15}
                  width={15}
                  className="h-5 w-5"
                >
                  <path d="m2.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m1.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m0.504 23.433 23 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m0.504 21.433 23 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m1.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m9.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m9.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m5.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m10.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m13.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m17.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m17.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m18.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m21.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path
                    d="M1.65 8.538a0.5 0.5 0 0 0 0.307 0.895h20.1a0.5 0.5 0 0 0 0.309 -0.894L12.343 0.674a0.5 0 0 0 -0.616 0Z"
                    fill="none"
                    stroke="#464646"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] lg:text-[14px] text-[#282727] ">
                  {event?.workspace?.name || "Organizer info not available"}
                </p>
              </div>
            </div>

            <Separator className="bg-[#d0d0d0]" />
          </div>

          {/* Booking Info */}
          <div className="flex items-center gap-2 bg-[#fff9eb] p-2 sm:p-3 rounded-md">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#464646]" />
            <p className="text-[#282727] text-[12px] sm:text-[13px] leading-tight">
              {`Bookings are open for ${event?.name}`}
            </p>
          </div>
        </div>

        {/* Enrollment Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {renderEnrollmentButtons()}
        </div>

        <TeamRegistrationDialog />
      </CardContent>
    </Card>
  )
}
