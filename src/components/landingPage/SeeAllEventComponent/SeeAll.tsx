"use client"

import { useState } from "react"
import SeeAllEventheader from "./SeeAllEventheader"
import SeeAllEventFilter from "./SeeAllEventFilter"
import SeeAllEventGrid from "./SeeAllEventGrid"
import { useParams } from "next/navigation"
import { Loader } from "lucide-react"
import useSeeAllEventsBySocietySlug from "@/hooks/useSealleventsbySocietySlug"

export default function SeeAllEvent() {
  const [selectedFilters, setSelectedFilters] = useState({
    date: null,
    dateRange: false,
  })

  const { societySlug } = useParams()

  // ✅ Automatically fetches events via useQuery hook
  const {
    data,
    isLoading,
    isError,
    error,
  } = useSeeAllEventsBySocietySlug(societySlug as string)

  // ✅ Loader
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader className="h-8 w-8 animate-spin text-[#333333]" />
      </div>
    )
  }

  // ✅ Error message
  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error instanceof Error ? error.message : "Failed to load events"}
      </p>
    )
  }

  // ✅ Render
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header with Tabs */}
      <div className="top-0 z-40">
        <SeeAllEventheader />
      </div>

      {/* Main Content */}
      <div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Side - Scrollable Event Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-[24px] uppercase font-semibold text-[#333333] mb-5">
              {data?.society?.name || "Society Name"}
            </h2>
            <SeeAllEventGrid events={data?.events || []} />
          </div>

          {/* Right Side - Sticky Filter Sidebar */}
          <div className="lg:col-span-1">
            <SeeAllEventFilter
              selectedFilters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
