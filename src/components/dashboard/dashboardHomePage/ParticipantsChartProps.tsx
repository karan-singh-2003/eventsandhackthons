'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import usegetparticipantperevent from '@/hooks/usegetparticipantperevent'


export function ParticipantsChart() {
    const {data, isPending, isError} = usegetparticipantperevent() 
   if (isPending) {
    return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      
        <div  className="animate-pulse h-24 bg-gray-200 rounded-xl" />

    </div>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load KPI data</p>;
  }

  if (!data || data.length === 0) {
    return <p>No KPI data found.</p>;
  }
    return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Inquiries Events This Year</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="w-full overflow-x-auto">
  <div className="min-w-[800px] md:min-w-[1200px] lg:min-w-[1600px]">
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
        />
        <YAxis tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'var(--color-foreground)' }}
        />
        <Bar dataKey="ApprovedParticipants" fill='#8B5CF6' radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      </CardContent>
    </Card>
  )
}
