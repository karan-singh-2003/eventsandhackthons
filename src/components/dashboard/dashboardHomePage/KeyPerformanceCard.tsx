'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
}

export function KeyPerformanceCard({ label, value, change, icon }: KPICardProps) {
  const isPositive = change >= 0

  return (
    <Card className="relative overflow-hidden border border-border/40 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div className="p-2.5 bg-muted rounded-lg text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
          )}
          <span
            className={`text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
