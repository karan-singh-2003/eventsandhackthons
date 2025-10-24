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
    <div className="flex flex-wrap gap-2 py-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
