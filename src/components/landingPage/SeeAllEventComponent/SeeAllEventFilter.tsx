"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

interface FilterSidebarProps {
  selectedFilters: {
    date: string | null
    dateRange: boolean
  }
  onFiltersChange: (filters: any) => void
}

export default function SeeAllEventFilter({ selectedFilters, onFiltersChange }: FilterSidebarProps) {
  const [dateRange, setDateRange] = useState(false)
  const [isDateExpanded, setIsDateExpanded] = useState(true)

  const handleDateFilter = (date: string) => {
    onFiltersChange({
      ...selectedFilters,
      date: selectedFilters.date === date ? null : date,
    })
  }

  const handleDateRangeToggle = () => {
    setDateRange(!dateRange)
    onFiltersChange({
      ...selectedFilters,
      dateRange: !dateRange,
    })
  }

  return (
    <div className="sticky top-24 space-y-4">
      {/* Filters Card */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-md">
        <h2 className="text-lg font-semibold text-card-foreground mb-5">Filters</h2>

        {/* Date Section with Toggle */}
        <div className="space-y-4">
          <button
            onClick={() => setIsDateExpanded(!isDateExpanded)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-sm font-semibold text-card-foreground">Date</h3>
            <ChevronDown
              size={18}
              className={`text-muted-foreground transition-transform duration-300 group-hover:text-card-foreground ${
                isDateExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>

          {/* Date Filter Buttons - Collapsible */}
          {isDateExpanded && (
            <div className="space-y-2 animate-in fade-in duration-200">
              {/* Today Button */}
              <button
                onClick={() => handleDateFilter("today")}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilters.date === "today"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted border border-transparent hover:border-border"
                }`}
              >
                Today
              </button>

              {/* Tomorrow Button */}
              <button
                onClick={() => handleDateFilter("tomorrow")}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilters.date === "tomorrow"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted border border-transparent hover:border-border"
                }`}
              >
                Tomorrow
              </button>

              {/* This Weekend Button */}
              <button
                onClick={() => handleDateFilter("weekend")}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilters.date === "weekend"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted border border-transparent hover:border-border"
                }`}
              >
                This Weekend
              </button>
            </div>
          )}

          {/* Date Range Checkbox */}
          {isDateExpanded && (
            <div className="flex items-center gap-3 pt-2 animate-in fade-in duration-200">
              <Checkbox id="date-range" checked={dateRange} onCheckedChange={handleDateRangeToggle} />
              <label htmlFor="date-range" className="text-sm font-medium text-card-foreground cursor-pointer">
                Date Range
              </label>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(selectedFilters.date || dateRange) && (
          <button
            onClick={() => {
              onFiltersChange({ date: null, dateRange: false })
              setDateRange(false)
            }}
            className="text-xs text-primary hover:underline mt-4 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Browse My Carts Button */}
      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        size="lg"
      >
        Browse My Carts
      </Button>
    </div>
  )
}
