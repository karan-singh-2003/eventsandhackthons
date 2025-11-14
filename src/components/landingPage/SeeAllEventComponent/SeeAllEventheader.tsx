"use client"


const tabs = [
  { id: "enrolled", label: "Enrolled" },
  { id: "latest", label: "Latest Events" },
  { id: "technical", label: "Technical Events" },
  { id: "hackathon", label: "Hackathon Event" },
  { id: "workshop", label: "Workshop Events" },
  { id: "archive", label: "Events Archive" },
]

export default function SeeAllEventheader() {
  return (
    <div className="flex flex-wrap px-8 w-full gap-7 py-1 overflow-x-auto border border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={` py-2  font-medium text-sm lg:text-[14px]  cursor-pointer transition-all`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
