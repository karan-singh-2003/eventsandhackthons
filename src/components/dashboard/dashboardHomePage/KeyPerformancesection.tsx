'use client'

import useGetKeyperformanceDataDasboard from '@/hooks/usegetkeyperformancedata'
import { KeyPerformanceCard } from './KeyPerformanceCard'
import { KPIData } from './KPIData'


export function KPISection() {
    const {data, isPending, isError}= useGetKeyperformanceDataDasboard()
     if (isPending) {
    return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-xl" />
      ))}
    </div>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load KPI data</p>;
  }

  if (!data || data.length === 0) {
    return <p>No KPI data found.</p>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi:any, index:any) => (
        <KeyPerformanceCard
          key={index}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
        />
      ))}
    </div>
  )
}
