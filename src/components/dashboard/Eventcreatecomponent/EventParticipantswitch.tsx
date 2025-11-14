"use client"

import { useState } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EventParticipationProps {
  value: {
    type: "solo" | "team" | "solo+team"
    minTeamSize?: number
    maxTeamSize?: number
  }
  onChange: (data: {
    type: "solo" | "team" | "solo+team"
    minTeamSize?: number
    maxTeamSize?: number
  }) => void
}

// ✅ Simple Zod schema — only checks minTeamSize ≥ 2
const simpleParticipationSchema = z.object({
  type: z.enum(["solo", "team", "solo+team"]),
  minTeamSize: z
    .number()
    .min(2, "Minimum team size must be at least 2")
    .optional(),
  maxTeamSize: z.number().optional(),
})

export default function EventParticipation({ value, onChange }: EventParticipationProps) {
  const [error, setError] = useState("")

  // ✅ Handle validation
  const handleChange = (field: "type" | "minTeamSize" | "maxTeamSize", newValue: any) => {
    const updated = { ...value, [field]: newValue === "" ? undefined : newValue }
    onChange(updated)

    const parsed = simpleParticipationSchema.safeParse(updated)
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === "minTeamSize")
      setError(issue ? issue.message : "")
    } else {
      setError("")
    }
  }

  const showTeamSizeInputs = value.type === "team" || value.type === "solo+team"

  // ✅ Handle user input without forcing 0
  const handleNumberInput = (field: "minTeamSize" | "maxTeamSize", e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // If field is cleared, keep it empty (not 0)
    if (val === "") {
      handleChange(field, undefined)
    } else {
      const num = parseInt(val, 10)
      handleChange(field, isNaN(num) ? undefined : num)
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Participation Type</CardTitle>
        <CardDescription>Choose how participants can join your event</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Radio Buttons */}
          <div className="space-y-3">
            {["solo", "team", "solo+team"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted transition"
              >
                <input
                  type="radio"
                  name="participation"
                  value={option}
                  checked={value.type === option}
                  onChange={() => handleChange("type", option)}
                  className="w-5 h-5 cursor-pointer accent-primary"
                />
                <div className="flex-1">
                  <div className="font-semibold capitalize">{option}</div>
                  <div className="text-sm text-muted-foreground">
                    {option === "solo"
                      ? "Individual participation only"
                      : option === "team"
                      ? "Group participation only"
                      : "Both individual and group participation"}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Team Size Inputs */}
          {showTeamSizeInputs && (
            <div className="pt-4 border-t border-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-team">Minimum Team Size</Label>
                  <Input
                    id="min-team"
                    type="number"
                    placeholder="e.g., 2"
                    value={value.minTeamSize ?? ""}
                    onChange={(e) => handleNumberInput("minTeamSize", e)}
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <div>
                  <Label htmlFor="max-team">Maximum Team Size</Label>
                  <Input
                    id="max-team"
                    type="number"
                    placeholder="e.g., 10"
                    value={value.maxTeamSize ?? ""}
                    onChange={(e) => handleNumberInput("maxTeamSize", e)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
