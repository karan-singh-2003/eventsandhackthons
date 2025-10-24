import ActiveEventrecommond from "./ActiveEventrecommond"


const relatedEvents = [
  {
    id: "1",
    title: "Quiz Phonic",
    organizer: "Itian Club",
    image: "/quiz-phonic-event.jpg",
  },
  {
    id: "2",
    title: "Ek Chattur Naari",
    organizer: "Itian Club",
    image: "/chattur-naari-event.jpg",
  },
  {
    id: "3",
    title: "Ek Chattur Naari",
    organizer: "Itian Club",
    image: "/chattur-naari-event-2.jpg",
  }
]

export default function EventYouMayAlsoLike() {
  return (
    <div className=" space-y-5 px-1 lg:px-2">
      <div>
        <h2 className="text-[24px] font-medium text-[#1a1a1a] ">You May Also Like</h2>
        <p className="text-[14px] text-[#404040] text-medium">Event Around you register now</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-1">
        {relatedEvents.map((event) => (
          <ActiveEventrecommond key={event.id} id={event.id} title={event.title} organizer={event.organizer} image={event.image} />
        ))}
      </div>
    </div>
  )
}
