"use client";

import EventNotificationCard from "@/components/landingPage/landingpageEventNotification/EventNotificationCard";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on load
  const fetchNotifications = async () => {
    const res = await fetch("/api/event/notification/recieve");
    const data = await res.json();

    if (data.success) {
      setNotifications(data.notifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Accept / Reject handler
  const handleResponse = async (notificationId:any, action:any) => {
    const res = await fetch("/api/event/notification/teamconfirmation", {
      method: "POST",
      body: JSON.stringify({ notificationId, action }),
    });

    const result = await res.json();

    if (result.success) {
      // Refresh notifications
      fetchNotifications();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-4 p-6 flex flex-col gap-4 pb-24">

      <h1 className="text-xl lg:text-[32px] font-semibold text-[#1a1a1a] mb-2">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-yellow-800 font-medium flex gap-x-3 items-center bg-yellow-50 p-3 text-[11px] lg:text-sm">
      <CircleAlert />
      <div>
        
        <h3>No notifications available at the moment.</h3>
      </div>
    </div>

      ) : (
        notifications.map((notification:any) => (
          <EventNotificationCard
            key={notification.id}
            notification={notification}
            onRespond={handleResponse}
          />
        ))
      )}
    </div>
  );
}
