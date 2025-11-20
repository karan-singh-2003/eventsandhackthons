import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { EventData } from './KPIData'
import { DashboardEventCard } from './DashboardEventCard'

interface EventsSectionProps {
  events: EventData[]
}

export function DashboardEventsSection({ events }: EventsSectionProps) {
  return (
    <div className="w-full lg:col-span-3 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">Latest Events</h2>
        <p className="text-xs text-muted-foreground mt-1">
          View and manage all your events
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <DashboardEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
