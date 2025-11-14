"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface EventTagsProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export default function EventTags({ value, onChange }: EventTagsProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Event Tags</CardTitle>
        <CardDescription>Add tags to help people discover your event. Press Enter to add a tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Add tags (e.g., conference, networking, tech)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-11 text-base"
          />

          {/* Tags Display */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="hover:text-primary/70 transition"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
