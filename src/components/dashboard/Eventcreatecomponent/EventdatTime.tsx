"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ✅ Props stay same
interface EventDateTimeProps {
  data: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
  }
  onChange: (data: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
  }) => void
}

// ✅ Zod Schema for validation
const eventDateTimeSchema = z
  .object({
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    startTime: z.string().nonempty("Start time is required"),
    endTime: z.string().nonempty("End time is required"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    },
    {
      message: "Start date cannot be after end date",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return end >= start
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // ✅ Validate time only if same day
      if (data.startDate === data.endDate) {
        const [startHour, startMin] = data.startTime.split(":").map(Number)
        const [endHour, endMin] = data.endTime.split(":").map(Number)
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        return endMinutes > startMinutes
      }
      return true
    },
    {
      message: "End time must be after start time for the same day",
      path: ["endTime"],
    }
  )

export default function EventDateTime({ data, onChange }: EventDateTimeProps) {
  const [error, setError] = useState({
    startDate: "",
    endDate: "",
    endTime: "",
  })

  // ✅ Validate whenever data changes
  const validateDateTime = (updatedData: typeof data) => {
    const parsed = eventDateTimeSchema.safeParse(updatedData)
    if (!parsed.success) {
      const startError =
        parsed.error.issues.find((i) => i.path[0] === "startDate")?.message || ""
      const endError =
        parsed.error.issues.find((i) => i.path[0] === "endDate")?.message || ""
      const timeError =
        parsed.error.issues.find((i) => i.path[0] === "endTime")?.message || ""
      setError({ startDate: startError, endDate: endError, endTime: timeError })
    } else {
      setError({ startDate: "", endDate: "", endTime: "" })
    }
  }

  const handleChange = (field: keyof typeof data, value: string) => {
    const updated = { ...data, [field]: value }
    onChange(updated)
    validateDateTime(updated)
  }

  // ✅ Validate when data changes externally (initial render)
  useEffect(() => {
    if (data.startDate || data.endDate || data.startTime || data.endTime) {
      validateDateTime(data)
    }
  }, [data])

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Date and Time</CardTitle>
        <CardDescription>Set when your event starts and ends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date *
            </label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="h-11"
            />
            {error.startDate && (
              <p className="text-red-500 text-sm mt-1">{error.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              End Date *
            </label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="h-11"
            />
            {error.endDate && (
              <p className="text-red-500 text-sm mt-1">{error.endDate}</p>
            )}
          </div>

          {/* Time Grid */}
          <div className=" hidden grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time
              </label>
              <Input
                type="time"
                value={data.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time
              </label>
              <Input
                type="time"
                value={data.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="h-11"
              />
              {error.endTime && (
                <p className="text-red-500 text-sm mt-1">{error.endTime}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
