"use client"

import SeeAllEventCard from "./SeeAllEventCards"


interface EventGridProps {
  activeTab: string
}

// Mock event data
const mockEvents = [
  {
    id: 1,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-10-28",
    attendees: 150,
  },
  {
    id: 2,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-10-29",
    attendees: 120,
  },
  {
    id: 3,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-10-30",
    attendees: 180,
  },
  {
    id: 4,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-11-01",
    attendees: 200,
  },
  {
    id: 5,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-11-02",
    attendees: 160,
  },
  {
    id: 6,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-11-03",
    attendees: 140,
  },
  {
    id: 7,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-11-05",
    attendees: 190,
  },
  {
    id: 8,
    title: "Quiz Phonic",
    club: "Itian Club",
    image: "/quiz-phonic-event-poster.jpg",
    date: "2024-11-06",
    attendees: 170,
  },
]

export default function SeeAllEventGrid({ activeTab }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 hide-scrollbar">
      {mockEvents.map((event) => (
        <SeeAllEventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
