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
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header with Tabs */}
      <div className=" top-0 z-40  ">
        <div className="">
          <SeeAllEventheader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Side - Scrollable Event Cards */}
          <div className="lg:col-span-2 ">
        <h2 className="text-[24px]  uppercase  font-semibold text-[#333333] mb-5">Itian Club</h2>
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
