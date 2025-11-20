"use client"

import { useState } from "react"
import { Search, Calendar, ListIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventCalendar } from "./EventCalendar"
import { EventCreateButton } from "../Eventcreatebutton"
import { useParams, useRouter } from "next/navigation"
import { useEventModalStore, usePanelStore } from "@/store/modal-slice"
import { da } from "zod/v4/locales"
import useSeeAllEventsBySocietySlug from "@/hooks/useSealleventsbySocietySlug"


export function EventOrganizationDashboard() {
  const {workspaceSlug}= useParams();

const {data , isPending , isError} =  useSeeAllEventsBySocietySlug(workspaceSlug as string);
const exportToCSV = () => {
    // Convert to CSV string
    const headers = ["Event Title", "Event Slug", "Status"];
    const rows = data?.events.map((item:any) => [item.name, item.slug, item.status]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "Event_Data.csv";
    document.body.appendChild(link);
    link.click();
  };


  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["upcoming"])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const statuses = ["upcoming", "draft", "past", "all"]

  const handleStatusToggle = (status: string) => {
    setSelectedStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

const router = useRouter();
    const { togglePanel, setPanelRoute  } = usePanelStore();
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="lg:text-[44px] text-[24px]  font-bold text-[#1E0A3c] mb-8">Events</h1>

          {/* Tabs */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0">
              <TabsTrigger
                value="events"
                className="rounded-none border-b-2 border-transparent  data-[state=active]:bg-transparent px-0 pb-3 mr-8"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="rounded-none border-b-2 border-transparent  data-[state=active]:bg-transparent px-0 pb-3"
              >
                Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="mt-6 space-y-6">
              {/* Controls */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 flex-1">
                  {/* Search Bar */}
                  <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search events"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-border"
                    />
                  </div>

                  {/* List Button */}
                  <Button
                    className="bg-[#d1410c] hover:bg-primary/90 text-primary-foreground gap-2 hover:cursor-pointer w-full md:w-auto"
                    size="lg"
                  >
                    <ListIcon className="w-4 h-4" />
                    List
                  </Button>

                  {/* Calendar Button - Add click handler to toggle calendar */}
                  <Button
                    variant="outline"
                    className="border-border hidden hover:cursor-pointer bg-white hover:bg-muted gap-2 w-full md:w-auto"
                    size="lg"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <Calendar className="w-4 h-4" />
                    Calendar
                  </Button>
                </div>

                {/* Status Filter & Create Button */}
                <div className="flex gap-3 items-center w-full md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-border bg-white hover:bg-muted text-primary font-semibold gap-2 flex-1 md:flex-none"
                        size="lg"
                      >
                        Upcoming events
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {statuses.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={selectedStatus.includes(status)}
                          onCheckedChange={() => handleStatusToggle(status)}
                          className="capitalize cursor-pointer"
                        >
                          {status === "all" ? "All events" : `${status} events`}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Create Event Button */}
            

<Button
  className="bg-transparent hover:bg-[#d1410c] border border-[#d1410c] text-[#d1410c] hover:text-white gap-2 font-semibold flex-1 md:flex-none"
  size="lg"
  onClick={() => {
    const target = `/workspace/${workspaceSlug}/event/create`

    // ✅ tell store that panel belongs to this route
  

    // ✅ navigate
    router.push(target)
  }}
>
  <Plus className="w-4 h-4" />
  Create Event
</Button>


                </div>
              </div>

              {/* {isCalendarOpen && <EventCalendar />} */}
<div className="p-5 bg-white rounded-xl border shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg">College Events </h2>
    <button
      onClick={exportToCSV}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
    >
      Export CSV
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full border text-left">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-2">Event Title</th>
          <th className="p-2">Event Slug</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>

      <tbody>
        {/* 🔄 Loading State */}
        {isPending && (
          <tr>
            <td colSpan={3} className="p-4 text-center">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
            </td>
          </tr>
        )}

        {/* ❌ Error State */}
        {isError && (
          <tr>
            <td colSpan={3} className="p-4 text-center text-red-500">
              Failed to load event data.
            </td>
          </tr>
        )}

        {/* 🟡 No data */}
        {!isPending && !isError && data?.length === 0 && (
          <tr>
            <td colSpan={3} className="p-4 text-center text-muted-foreground">
              No participants found.
            </td>
          </tr>
        )}

        {/* ✅ Success State - Map Data */}
        {!isPending &&
          !isError &&
          data?.events.map((item: any, index: number) => (
            <tr key={index} className="border-b">
  <td className="p-2">{item.name}</td>
  <td className="p-2">{item.slug}</td>
  <td className="p-2">{item.status}</td>

  {/* 3 dots menu */}
  <td className="p-2 text-right">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          ⋮
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/workspace/${workspaceSlug}/event/${item.eventId}`)
          }
        >
          View Event
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/workspace/${workspaceSlug}/event/${item.eventId}/edit`)
          }
        >
          Update Event
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </td>
</tr>

          ))}
      </tbody>
    </table>
  </div>
</div>

              {/* List Section */}
              
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Collections coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
