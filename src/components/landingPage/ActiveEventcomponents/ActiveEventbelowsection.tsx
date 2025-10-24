import { Calendar, Clock, MapPin, Users, AlertCircle } from "lucide-react"

export default function ActiveEventbelowsection() {
  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: "Sun 28 Sep 2025",
    },
    {
      icon: Clock,
      label: "Time",
      value: "7:30 pm",
    },
    {
      icon: Clock,
      label: "Duration",
      value: "4 hours",
    },
    {
      icon: Users,
      label: "Attendees",
      value: "Solo/Team: All are applicable",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: "MBA BLOCK, DBMS LAB",
    },
    {
      icon: AlertCircle,
      label: "Note",
      value: "Coding are thing too for Ethical Hacking",
    },
  ]

  return (
    <div className="space-y-4">
      {/* <h2 className="text-2xl font-bold text-foreground">Ethical Hacking Workshop</h2> */}

      <div className="grid gap-4">
        {details.map((detail, index) => {
          const Icon = detail.icon
          return (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 mt-1">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">{detail.label}</p>
                <p className="text-foreground">{detail.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
