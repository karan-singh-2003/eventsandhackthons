"use client";

import { useState, useEffect } from "react";
import ActiveEventheader from "./ActiveEventheader";
import StickyScrollHeader from "./StickyEventHeader";
import ActiveEventContent from "./ActiveEventContent";
import ActiveEventRegistrationCard from "./ActiveEventRegistrationCard";
import useFetchEventDetails from "@/hooks/usegeteventbyeventId";
import { useParams } from "next/navigation";
import { Loader, Loader2 } from "lucide-react";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const { mutate: fetchEvent, data, isPending, serverError } = useFetchEventDetails();

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // ✅ Fetch data safely when eventId is available
  useEffect(() => {
    if (eventId) {
      fetchEvent({ eventId });
    }
  }, [eventId, fetchEvent]);

  // ✅ Scroll handler (independent of data)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        const timeout = setTimeout(() => setShowStickyHeader(true), 100);
        setScrollTimeout(timeout);
      } else {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        setShowStickyHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  // ✅ Conditional rendering — after all hooks are declared
 if (isPending) {
  return (
    <div className="flex  justify-center items-center min-h-[70vh]">
      <Loader className="h-8 w-8 animate-spin text-[#333333]" />
     
    </div>
  );
}
  if (serverError) return <p className="text-center text-red-500 mt-10">{serverError}</p>;

  const event = data?.event;
  const eventUserStatus = data?.userStatus;
const eventloggedInUser = data?.loggedInUser;
  // ✅ Handle missing or null data
  if (!event) {
    return <p className="text-center mt-10 text-gray-500">No event found.</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <StickyScrollHeader eventName={event.name} showHeader={showStickyHeader} />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left section */}
            <div className="lg:col-span-2">
              <ActiveEventContent event={event} eventUserStatus={eventUserStatus}  />
            </div>

            {/* Right sticky section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 h-fit z-10">
                <ActiveEventRegistrationCard event={event} eventUserStatus={eventUserStatus} eventloggedInUser= {eventloggedInUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
