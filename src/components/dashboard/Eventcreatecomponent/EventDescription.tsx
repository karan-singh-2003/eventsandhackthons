"use client"

import { useState } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface EventDescriptionProps {
  value: string
  onChange: (value: string) => void
}

// ✅ Step 1: Define schema for event description
const descriptionSchema = z
  .string()
  .min(5, "Event description must be at least 10 characters long")
  .max(300, "Event description must not exceed 300 characters")

export default function EventDescription({ value, onChange }: EventDescriptionProps) {
  const [error, setError] = useState("")

  // ✅ Step 2: Handle changes and validate
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    const result = descriptionSchema.safeParse(newValue)
    if (!result.success) {
      setError(result.error.issues[0].message)
    } else {
      setError("")
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Event Description</CardTitle>
        <CardDescription>
          Be clear and descriptive with a description that tells people what your event is about
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Enter event description..."
          value={value}
          onChange={handleChange}
          className="text-base h-11"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
