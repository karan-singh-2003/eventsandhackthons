
import { RegistrationTrendChart } from './/RegistrationTrendChart'

import {
  kpiData,
  participantsPerEvent,
  eventCategories,
  registrationTrend,
  latestEvents,
} from './KPIData'
import { KPISection } from './KeyPerformancesection'
import { ParticipantsChart } from './ParticipantsChartProps'
import { CategoryPieChart } from './CategoryPieChart'
import { DashboardEventsSection } from './DashboardEventsSection'

export function DashboardHomepage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-[52px] font-bold text-[#39364f] mb-2">Hey, there Himanshu</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back! Here's your event management overview.
          </p>
        </div>

        {/* KPI Cards */}
        <KPISection  />

        {/* Charts Section 
        
        */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            
            <ParticipantsChart />
          </div>
          <div>
            <CategoryPieChart  />
          </div>
        </div>

        {/* Registration Trend */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <RegistrationTrendChart data={registrationTrend} />
          </div>
       
        </div>

        {/* Events Grid */}
        <div className="grid gap-6">
          <DashboardEventsSection events={latestEvents} />
        </div>
      </div>
    </main>
  )
}
