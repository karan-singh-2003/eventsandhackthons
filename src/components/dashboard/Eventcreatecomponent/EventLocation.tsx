"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface EventLocationProps {
  value: string
  onChange: (value: string) => void
}

export default function EventLocation({ value, onChange }: EventLocationProps) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-xl">Location</CardTitle>
        <CardDescription>Where will your event take place?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-3 top-3.5 text-muted-foreground">
            <MapPin size={20} />
          </div>
          <Input
            placeholder="Enter location or venue name..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
      </CardContent>
    </Card>
  )
}
