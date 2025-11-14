"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegistrationDatesProps {
  data: {
    registrationStartDate: string
    registrationEndDate: string
  }
  onChange: (data: { registrationStartDate: string; registrationEndDate: string }) => void
}

// ✅ Zod Schema (validates both date order & emptiness)
const registrationDatesSchema = z
  .object({
    registrationStartDate: z.string().nonempty("Start date is required"),
    registrationEndDate: z.string().nonempty("End date is required"),
  })
  .refine(
    (data) => {
      if (!data.registrationStartDate || !data.registrationEndDate) return true
      const start = new Date(data.registrationStartDate)
      const end = new Date(data.registrationEndDate)
      return start <= end
    },
    {
      message: "Start date cannot be after end date",
      path: ["registrationStartDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.registrationStartDate || !data.registrationEndDate) return true
      const start = new Date(data.registrationStartDate)
      const end = new Date(data.registrationEndDate)
      return end >= start
    },
    {
      message: "End date cannot be before start date",
      path: ["registrationEndDate"],
    }
  )

export default function EventRegistrationDates({ data, onChange }: RegistrationDatesProps) {
  const [error, setError] = useState({ start: "", end: "" })

  // ✅ Validate dates immediately when either changes
  const validateDates = (updatedData: typeof data) => {
    const parsed = registrationDatesSchema.safeParse(updatedData)
    if (!parsed.success) {
      const startError =
        parsed.error.issues.find((i) => i.path[0] === "registrationStartDate")?.message || ""
      const endError =
        parsed.error.issues.find((i) => i.path[0] === "registrationEndDate")?.message || ""
      setError({ start: startError, end: endError })
    } else {
      setError({ start: "", end: "" })
    }
  }

  // ✅ Trigger validation when user updates a date
  const handleDateChange = (field: "registrationStartDate" | "registrationEndDate", value: string) => {
    const updated = { ...data, [field]: value }
    onChange(updated)
    validateDates(updated) // live validation
  }

  // ✅ Run validation initially if values exist
  useEffect(() => {
    if (data.registrationStartDate || data.registrationEndDate) {
      validateDates(data)
    }
  }, [data])

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Registration Dates</CardTitle>
        <CardDescription>
          Set when registration opens and closes for your event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Registration Start Date */}
          <div className="space-y-2">
            <Label htmlFor="reg-start-date" className="text-foreground font-medium">
              Registration Start Date
            </Label>
            <Input
              id="reg-start-date"
              type="date"
              value={data.registrationStartDate}
              onChange={(e) => handleDateChange("registrationStartDate", e.target.value)}
              className="border border-input bg-background text-foreground focus:ring-2 focus:ring-primary"
            />
            {error.start && <p className="text-red-500 text-sm mt-1">{error.start}</p>}
          </div>

          {/* Registration End Date */}
          <div className="space-y-2">
            <Label htmlFor="reg-end-date" className="text-foreground font-medium">
              Registration End Date
            </Label>
            <Input
              id="reg-end-date"
              type="date"
              value={data.registrationEndDate}
              onChange={(e) => handleDateChange("registrationEndDate", e.target.value)}
              className="border border-input bg-background text-foreground focus:ring-2 focus:ring-primary"
            />
            {error.end && <p className="text-red-500 text-sm mt-1">{error.end}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
