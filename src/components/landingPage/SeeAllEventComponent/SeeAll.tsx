"use client"

import { useState } from "react"


import SeeAllEventheader from "./SeeAllEventheader"
import SeeAllEventFilter from "./SeeAllEventFilter"
import SeeAllEventGrid from "./SeeAllEventGrid"

export default function SeeAllEvent() {
  const [activeTab, setActiveTab] = useState("enrolled")
  const [selectedFilters, setSelectedFilters] = useState({
    date: null,
    dateRange: false,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Tabs */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SeeAllEventheader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Scrollable Event Cards */}
          <div className="lg:col-span-2">
            <SeeAllEventGrid activeTab={activeTab} />
          </div>

          {/* Right Side - Sticky Filter Sidebar */}
          <div className="lg:col-span-1">
            <SeeAllEventFilter selectedFilters={selectedFilters} onFiltersChange={setSelectedFilters} />
          </div>
        </div>
      </div>
    </div>
  )
}
