'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartData } from './KPIData'
import usegetEventCategoryParticipant from '@/hooks/usegetEventCategoryParticipant'


const COLORS = [
  '#8B5CF6', // purple
  '#7C3AED', // deeper purple
  '#1E1B4B', // navy
  '#312E81', // dark purple
]

export function CategoryPieChart() {
 const {data, isPending, isError} = usegetEventCategoryParticipant()

      if (isPending) {
    return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      
        <div  className="animate-pulse h-24 bg-gray-200 rounded-xl" />

    </div>;
  }
  if (isError) {
    return <p className="text-red-500">Failed to load  data</p>;
  }

  if (!data || data.length === 0) {
    return <p>No category event participant data found.</p>;
  }
      
  return (
    <Card className="border border-border/40">
      <CardHeader>
        <CardTitle className="text-base font-semibold">This Year Event Category Particpant</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index:any) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'var(--color-foreground)' }}
              formatter={(value) => value}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
