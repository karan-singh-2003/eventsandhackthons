"use client"

interface EventTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "enrolled", label: "Enrolled" },
  { id: "latest", label: "Latest Events" },
  { id: "technical", label: "Technical Events" },
  { id: "hackathon", label: "Hackathon Event" },
  { id: "workshop", label: "Workshop Events" },
  { id: "archive", label: "Events Archive" },
]

export default function SeeAllEventheader({ activeTab, onTabChange }: EventTabsProps) {
  return (
    <div className="flex flex-wrap px-8 w-full gap-7 py-1 overflow-x-auto border border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={` py-2  font-medium text-sm lg:text-[14px]  cursor-pointer transition-all ${
            activeTab === tab.id
              ? "bg-transparent "
              : "bg-transparent text-[#333333] hover:text"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
