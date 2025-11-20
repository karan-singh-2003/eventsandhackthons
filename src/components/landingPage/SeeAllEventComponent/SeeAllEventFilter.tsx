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
      <div className="bg-card  border border-border p-4 shadow-sm">
        <h2 className="text-lg lg:text-[20px] text-[#333333] font-medium mb-5">Filters</h2>

        {/* Date Section with Toggle */}
        <div className="space-y-4">
          <button
            onClick={() => setIsDateExpanded(!isDateExpanded)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-sm lg:text-[15px]  font-medium text-[#333333]">Date</h3>
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
         <div className="flex   gap-2">

              <button
                onClick={() => handleDateFilter("today")}
                className={`w-[65px] px-2 py-2  text-[14px] cursor-pointer font-medium transition-all duration-200 ${
                  selectedFilters.date === "today"
                  ? "bg-[#d1410c] text-white "
                  : "bg-white  text-[#d1410c] hover:bg-muted border  "
                  }`}
                  >
                Today
              </button>

              {/* Tomorrow Button */}
              <button
                onClick={() => handleDateFilter("tomorrow")}
                className={`w-[85px] px-2 py-2  text-[14px] cursor-pointer font-medium transition-all duration-200 ${
                  selectedFilters.date === "tomorrow"
                  ? "bg-[#d1410c] text-white "
                  : "bg-white  text-[#d1410c] border hover:bg-muted  "
                  }`}
                  >
                Tomorrow
              </button>

                </div>

              {/* This Weekend Button */}
              <button
                onClick={() => handleDateFilter("weekend")}
                className={`w-[158px] px-1 py-2  text-[14px] font-medium transition-all duration-200 ${
                  selectedFilters.date === "weekend"
                    ? "bg-[#d1410c] text-white"
                    : "bg-white text-[#d1410c]  border  hover:border-border"
                }`}
              >
                This Weekend
              </button>
            </div>
          )}

          {/* Date Range Checkbox */}
          {isDateExpanded && (
            <div className="flex items-center gap-3 pt-2 animate-in fade-in duration-200">
              <Checkbox id="date-range" checked={dateRange} onCheckedChange={handleDateRangeToggle} className="size-3.5 border-[#d1410c]" />
              <label htmlFor="date-range" className="text-sm lg:text-[14px] font-medium text-[#d1410c] cursor-pointer">
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
            className="text-xs text-[#666666] hover:underline mt-4 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Browse My Carts Button */}
      <button
        className="w-full bg-transparent border border-[#d1410c] text-[#d1410c]  font-medium py-2 lg:py-2 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
        onClick={() => window.location.href = '/event/enrolledevents'}
        
      >
        Browse My Carts
      </button>
    </div>
  )
}
