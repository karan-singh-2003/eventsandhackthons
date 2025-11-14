"use client";

import EventPhotoUpload from "@/components/dashboard/Eventcreatecomponent/EventPhotoUpload";
import EventTitle from "@/components/dashboard/Eventcreatecomponent/EventTitile";
import EventDateTime from "@/components/dashboard/Eventcreatecomponent/EventdatTime";
import EventLocation from "@/components/dashboard/Eventcreatecomponent/EventLocation";
import EventParticipation from "@/components/dashboard/Eventcreatecomponent/EventParticipantswitch";
import EventRegistrationDates from "@/components/dashboard/Eventcreatecomponent/EventRegistrationdate";
import EventExternalLinks from "@/components/dashboard/Eventcreatecomponent/EventExternalLink";
import Eventdescription from "@/components/dashboard/Eventcreatecomponent/EventDescription";

import CustomLeftResizableLayout from "./CustomresizableLayout";
import { useState } from "react";
import { useParams } from "next/navigation";
import { eventSchema } from "@/Schemas/eventschema";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Toast for success/error messages

export default function EventCreationPage() {
  const queryClient = useQueryClient();
  const { workspaceSlug } = useParams();
  const [eventData, setEventData] = useState({
    photo: null as any,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "17:00",
    location: "",
    participation: {
      type: "solo" as const,
      minTeamSize: undefined,
      maxTeamSize: undefined,
    },
    registrationStartDate: "",
    registrationEndDate: "",
    linkTitle: "",
    linkUrl: "",
  });

  const uploadBanner = async () => {
    if (!eventData.photo) return null;

    const form = new FormData();
    form.append("file", eventData.photo);

    const res = await fetch("/api/event/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.url; // Cloudinary URL
  };

  // ✅ useMutation setup
  const { mutate: createEvent, isPending } = useMutation({
    mutationFn: async () => {
      let bannerUrl = null;
      if (eventData.photo) {
        bannerUrl = await uploadBanner();
      }

      // Prepare payload
      const payload = {
        name: eventData.title,
        description: eventData.description,
        location: eventData.location,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        registrationStartDate: eventData.registrationStartDate,
        registrationEndDate: eventData.registrationEndDate,
        eventType:
          eventData.participation.type === "solo"
            ? "SOLO"
            : eventData.participation.type === "team"
            ? "TEAM"
            : "SOLO_AND_TEAM",
        minTeamSize: eventData.participation.minTeamSize,
        maxTeamSize: eventData.participation.maxTeamSize,
        bannerUrl,
        linkTitle: eventData.linkTitle,
        linkUrl: eventData.linkUrl,
      };

      // Validate with Zod
      const result = eventSchema.safeParse(payload);
      if (!result.success) {
        throw new Error(result.error.issues[0].message);
      }

      // Send to backend
      const res = await fetch(`/api/event/create/${workspaceSlug}`, {
        method: "POST",
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create event");
      }

      return await res.json();
    },

    // ✅ On success
    onSuccess: (data) => {
      toast.success(`🎉 Event "${data.event.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({queryKey:['notifications-status']})
      setEventData({
        photo: null,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "10:00",
        endTime: "17:00",
        location: "",
        participation: {
          type: "solo",
          minTeamSize: undefined,
          maxTeamSize: undefined,
        },
        registrationStartDate: "",
        registrationEndDate: "",
        linkTitle: "",
        linkUrl: "",
      });
    },

    // ✅ On error
    onError: (error: any) => {
       const message =
        error?.response?.data?.message || error?.message || 'Something went wrong';
      toast.error(`❌ ${message || "Something went wrong"}`);
    },
  });

  return (
    <CustomLeftResizableLayout title={eventData.title}>
      <div className="max-w-3xl mx-auto py-12">
        <div className="space-y-6">
          <EventPhotoUpload
            value={eventData.photo}
            onChange={(photo) => setEventData((p) => ({ ...p, photo }))}
          />

          <EventTitle
            value={eventData.title}
            onChange={(title) => setEventData((p) => ({ ...p, title }))}
          />

          <Eventdescription
            value={eventData.description}
            onChange={(description) => setEventData((p) => ({ ...p, description }))}
          />

          <EventDateTime
            data={eventData}
            onChange={(dt) => setEventData((p) => ({ ...p, ...dt }))}
          />

          <EventRegistrationDates
            data={eventData}
            onChange={(d) => setEventData((p) => ({ ...p, ...d }))}
          />

          <EventLocation
            value={eventData.location}
            onChange={(location) => setEventData((p) => ({ ...p, location }))}
          />

          <EventParticipation
            value={eventData.participation}
            onChange={(participation: any) =>
              setEventData((p) => ({ ...p, participation }))
            }
          />

          <EventExternalLinks
            linkTitle={eventData.linkTitle}
            linkUrl={eventData.linkUrl}
            onLinkTitleChange={(title) =>
              setEventData((prev: any) => ({ ...prev, linkTitle: title }))
            }
            onLinkUrlChange={(url) =>
              setEventData((prev: any) => ({ ...prev, linkUrl: url }))
            }
          />

          <button
            onClick={() => createEvent()}
            disabled={isPending}
            className="px-6 py-2 bg-transparent border border-[#d1410c] hover:cursor-pointer  hover:text-white text-[#d1410c] hover:bg-[#d1410c]  rounded-lg"
          >
            {isPending ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </CustomLeftResizableLayout>
  );
}
