"use client";

import EventNotificationCard from "@/components/landingPage/landingpageEventNotification/EventNotificationCard";
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

      <h1 className="text-xl font-semibold mb-2">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600 text-sm">No notifications found.</p>
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
