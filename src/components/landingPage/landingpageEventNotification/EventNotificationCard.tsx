import React from "react";

export default function EventNotificationCard({ notification, onRespond }: any) {
  return (
    <div className="w-full p-4 rounded-xl border shadow-sm bg-white flex flex-col gap-3">

      {/* Event + Team Info */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">
          Event: <strong>{notification.event?.name}</strong>
        </span>

        {notification.team?.name && (
          <span className="text-sm text-gray-500">
            Team: <strong>{notification.team.name}</strong>
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-gray-800 text-sm">{notification.message}</p>

      {/* Accept/Reject only if INVITESENT */}
      {notification.status === "INVITESENT" && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onRespond(notification.id, "ACCEPT")}
            className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            Accept
          </button>

          <button
            onClick={() => onRespond(notification.id, "REJECT")}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Reject
          </button>
        </div>
      )}

      {/* Status-based messages */}
      {notification.status === "ACCEPTED" && (
        <span className="text-green-600 font-semibold text-sm">
          ✔ You have accepted this invitation
        </span>
      )}

      {notification.status === "REJECTED" && (
        <span className="text-red-600 font-semibold text-sm">
          ✖ You have rejected this invitation
        </span>
      )}

      {notification.status === "CANCELLED" && (
        <span className="text-yellow-600 font-semibold text-sm">
          ⚠ This invitation has been cancelled
        </span>
      )}

      
    </div>
  );
}
