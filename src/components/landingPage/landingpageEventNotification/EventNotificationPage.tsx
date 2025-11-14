import EventNotificationCard from "./EventNotificationCard";

export default function NotificationsPage({ notifications }:any) {
  
  const handleResponse = async (notificationId:any, action:any) => {
    const res = await fetch("/api/team/confirm", {
      method: "POST",
      body: JSON.stringify({ notificationId, action }),
    });

    const data = await res.json();
    if (data.success) {
      // Refresh page OR mutate query
      alert(`You ${action.toLowerCase()}ed the invitation`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 p-6">
      {notifications.map((n:any) => (
        <EventNotificationCard
          key={n.id}
          notification={n}
          onRespond={handleResponse}
        />
      ))}
    </div>
  );
}
