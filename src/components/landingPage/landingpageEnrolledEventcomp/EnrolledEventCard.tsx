'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, MapPin, User, Users } from 'lucide-react'
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface EventCardProps {
  event: any
}

export function EnrolledEventCard({ event }: EventCardProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const queryClient = useQueryClient()

  // ----------- DATE LOGIC -----------
  const now = new Date();

  const regStart = new Date(event.registrationStartDate);
  const regEnd = new Date(event.registrationEndDate);
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);

  const isRegistrationNotStarted = now < regStart;
  const isRegistrationClosed = now > regEnd;
  const isEventStarted = now >= eventStart;
  const isEventEnded = now > eventEnd;

  const startDate = format(new Date(event.startDate), "dd MMM yyyy")
  const startTime = format(new Date(event.startDate), "hh:mm a")

  // ----------- CANCEL MUTATION -----------
 const cancelMutation = useMutation({
  mutationFn: async () => {
    const payload: any = { eventId: event.id };

    // TEAM → add teamId
    if (event.userStatus?.enrollmentType === "TEAM") {
      payload.teamId = event.userStatus.team?.id;
    }

    const res = await fetch("/api/event/teamcancelbyleader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to cancel enrollment");
    }

    return res.json();
  },

  onSuccess: () => {
    toast.success("Enrollment cancelled successfully");

    setOpenDialog(false);
    queryClient.invalidateQueries({ queryKey: ["user-enrolled-events"] });
  },

  onError: (err: any) => {
    toast.error(err.message || "Unable to cancel");
  },
});


  // ----------- CANCEL BUTTON LOGIC -----------
  const renderCancelButton = () => {
    // EVENT ENDED
    if (isEventEnded) {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="flex-1 text-gray-600 border-gray-400 min-w-40"
        >
          Event Closed
        </Button>
      );
    }

    // REGISTRATION NOT STARTED
    if (isRegistrationNotStarted) {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="flex-1 text-gray-600 border-gray-400 min-w-40"
        >
          Registration Not Started
        </Button>
      );
    }

    // REGISTRATION CLOSED
    if (isRegistrationClosed && !isEventStarted) {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="flex-1 text-gray-600 border-gray-400 min-w-40"
        >
          Registration Closed
        </Button>
      );
    }

    // EVENT STARTED + REG CLOSED
    if (isRegistrationClosed && isEventStarted) {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="flex-1 text-gray-600 border-gray-400 min-w-40"
        >
          Event Started – Registration Closed
        </Button>
      );
    }

    // REGISTRATION OPEN → allow cancel
    return (
      <Button
        onClick={() => setOpenDialog(true)}
        disabled={cancelMutation.isPending}
        variant="outline"
        size="sm"
        className="flex-1 text-red-700 min-w-40"
      >
        {cancelMutation.isPending ? "Cancelling..." : "Cancel Enrollment"}
      </Button>
    );
  };

  return (
    <>
      <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          
          {/* Event Image */}
          <div className="md:w-1/3 flex-shrink-0 h-full relative">
            <img
              src={event.bannerUrl || "/placeholder.svg"}
              alt={event.name}
              className="object-cover h-full w-full"
            />
          </div>

          {/* Event Details */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">

            <div>
              <h2 className="text-2xl lg:text-[22px] text-[#261b36] font-semibold mb-3 line-clamp-2">
                {event.name}
              </h2>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm lg:text-[12px] text-[#323232]">
                  <Calendar className="w-4 h-4" />
                  <span>{startDate} • {startTime}</span>
                </div>

                <div className="flex items-center gap-2 text-sm lg:text-[12px] text-[#323232]">
                  <MapPin className="w-4 h-4"/>
                  <span>{event.location}</span>
                </div>

                {/* Event Type */}
                <div className="flex items-center gap-2 text-sm lg:text-[12px] text-[#323232]">
                  <Users className="w-4 h-4"/>
                  {event.userStatus?.enrollmentType === "TEAM" && (
                    <span>Team Event</span>
                  )}
                  {event.userStatus?.enrollmentType === "SOLO" && (
                    <span>Solo Event</span>
                  )}
                </div>

                {/* SOLO / TEAM Members */}
                <div className="flex items-center gap-2 text-sm lg:text-[12px] text-[#323232]">
                  <User className="w-4 h-4"/>

                  {event.userStatus?.enrollmentType === "SOLO" && (
                    <span>Enrolled: {event.userStatus.soloUser?.name}</span>
                  )}

                  {event.userStatus?.enrollmentType === "TEAM" && (
                    <span>
                      Team: {event.userStatus.team.members.map((m: any) => m.name).join(", ")}
                    </span>
                  )}
                </div>

              </div>

              {/* ENROLLED BADGE */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 lg:px-2 py-1.5 lg:py-1 bg-green-100 text-green-800 rounded-full text-sm lg:text-[12px] font-medium">
                  <span>✓</span>
                  <span>Enrolled</span>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 flex-wrap">
              
              {/* View Details */}
              <Button
                onClick={() => window.location.href = `/event/${event.id}`}
                variant="outline"
                size="sm"
                className="flex-1 text-[#1e0a3c] min-w-40"
              >
                View Details
              </Button>

              {/* Dynamic Cancel Button */}
              {renderCancelButton()}

            </div>
          </div>
        </div>
      </Card>

      {/* CANCEL CONFIRMATION DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Cancel Enrollment?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Are you sure you want to cancel your enrollment? This action cannot be undone.
          </p>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="outline" className='hover:cursor-pointer' onClick={() => setOpenDialog(false)}>
              No
            </Button>
            <Button variant="destructive" className='hover:cursor-pointer' onClick={() => cancelMutation.mutate()}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
