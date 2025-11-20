"use client";

import React, { useEffect, useState } from "react";
import { EventsSection } from "./EventSection";
import MemoryPic from "../MemoryPic/MemoryPic";
import { useRouter } from "next/navigation";
import { usegeteventaccordingworkspaces } from "@/hooks/usegeteventaccordingworkspaces";
import useGetLatestbanner from "@/hooks/useGetLoadingbanner";
import { getAuthData } from "@/lib/auth-client"; // your auth utility

function EventSectionShow() {
  const router = useRouter();

  // 🔐 USER AUTH STATE
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    universityId?: string;
  } | null>(null);

  useEffect(() => {
    const auth = getAuthData();
    setUserInfo(auth?.userInfo || null);
  }, []);

  // 🔥 Latest Events API
  const { data = [], isPending: latestPending, error: latestEventError } =
    useGetLatestbanner();

  const latestEvents = data?.events || [];

  // 🔥 Workspace + Events API
  const {
    workspaces,
    isPending,
    isFetching,
    error: workspaceError,
  } = usegeteventaccordingworkspaces();

  // 🔄 LOADING + ERROR HANDLING
  if (latestPending || isPending || isFetching)
    return <p>Loading events...</p>;

  if (latestEventError)
    return <p>Error loading events: {latestEventError.message}</p>;

  if (workspaceError)
    return <p>Error loading events: {workspaceError.message}</p>;

  // =====================================================================================
  // 🎯 BUILD ENROLLED EVENT LIST (ONLY IF USER LOGGED IN)
  // =====================================================================================

  let enrolledEvents: any[] = [];

  if (userInfo) {
    enrolledEvents = workspaces
      .flatMap((workspace: any) =>
        workspace.events
          .filter((event: any) => event.userStatus?.isEnrolled)
          .map((event: any) => ({
            eventId: event.id,
            eventName: event.name,
            eventSlug: event.slug,
            eventImage: event.bannerUrl,
            eventDate: new Date(event.startDate).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            society: workspace.name,
            isEnrolled: true,
          }))
      );
  }

  // =====================================================================================

  return (
    <div>
      {/* ⭐ Latest Events */}
      <EventsSection
        title="Latest Events"
        aboutTitle="Stay updated with the freshest events happening around you!"
        events={latestEvents.map((event: any) => ({
          eventId: event.id,
          eventName: event.name,
          eventSlug: event.slug,
          eventImage: event.bannerUrl,
          isloading: latestPending,
          eventDate: new Date(event.startDate).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          society: event.workspace?.name || "Unknown Society",
        }))}
        onSeeAll={() => router.push("/latestevents")}
      />

      {/* ⭐ Enrolled Events (ONLY IF LOGGED IN) */}
      {userInfo && (
        <EventsSection
          title="Enrolled Events"
          aboutTitle="These are the events you’re officially part of — stay prepared and make the most of the experience!"
          events={enrolledEvents}
          onSeeAll={() => router.push(`/event/enrolledevents`)}
        />
      )}

      {/* ⭐ Workspace wise events */}
      {workspaces.map((workspace: any) => (
        <EventsSection
          key={workspace.id}
          title={workspace.name}
          events={workspace.events.map((event: any) => ({
            eventId: event.id,
            eventName: event.name,
            eventSlug: event.slug,
            isloading: isPending || isFetching,
            eventImage:
              event.bannerUrl ||
              "https://cdn.pixabay.com/photo/2024/01/22/tech-conference.jpg",
            eventDate: new Date(event.startDate).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            society: workspace.name,
            isEnrolled: event.userStatus?.isEnrolled,
          }))}
          onSeeAll={() => router.push(`/events/${workspace.slug}`)}
        />
      ))}

      <MemoryPic />
    </div>
  );
}

export default EventSectionShow;
