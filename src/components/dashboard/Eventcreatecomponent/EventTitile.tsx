"use client"

import { useState } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ✅ Step 1: Define a small schema for this component
const titleSchema = z
  .string()
  .min(3, "Event title must be at least 5 characters long")
  .max(100, "Event title must not exceed 100 characters")

interface EventTitleProps {
  value: string
  onChange: (value: string) => void
}

export default function EventTitle({ value, onChange }: EventTitleProps) {
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // ✅ Validate using Zod
    const result = titleSchema.safeParse(newValue)
    if (!result.success) {
      setError(result.error.issues[0].message)
    } else {
      setError("")
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Event Title</CardTitle>
        <CardDescription>
          Be clear and descriptive with a title that tells people what your event is about
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Enter event title..."
          value={value}
          onChange={handleChange}
          className="text-base h-11"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
