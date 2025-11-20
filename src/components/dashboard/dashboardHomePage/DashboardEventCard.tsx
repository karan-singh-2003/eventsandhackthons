'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EventData } from './KPIData'
import { Calendar, Users, ArrowRight } from 'lucide-react'

interface EventCardProps {
  event: EventData
}

const categoryColors = {
  Tech: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  Cultural: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  Sports: 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
  Academic: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
}

const statusColors = {
  Upcoming: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  Ongoing: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  Completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
}

export function DashboardEventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="border border-border/40 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-foreground line-clamp-2">
              {event.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{event.society}</p>
          </div>
          <Badge className={`${categoryColors[event.category]} border`} variant="outline">
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{event.participants} participants</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Badge className={`${statusColors[event.status]} border text-xs`} variant="outline">
            {event.status}
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary hover:bg-primary/5">
            View <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
