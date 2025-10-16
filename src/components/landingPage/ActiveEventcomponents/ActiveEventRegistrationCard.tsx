"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface RegistrationCardProps {
  isInterested: boolean
  isFavorite: boolean
}

export default function ActiveEventRegistrationCard({ isInterested, isFavorite }: RegistrationCardProps) {
  const features = ["Free Entry", "Certificate of Participation", "Networking Opportunity", "Hands-on Workshop"]

  return (
    <Card className="border-2 border-primary shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl">Register Now</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Event Summary */}
        <div className="space-y-3 pb-4 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Event Date</p>
              <p className="font-semibold text-foreground">Sun 28 Sep 2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-semibold text-foreground">7:30 PM</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold text-foreground">MBA BLOCK, DBMS LAB</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button className="w-full h-12 text-base font-semibold" size="lg">
          Register Here
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-muted-foreground text-center">
          {isInterested ? "✓ You marked this as interested" : "Mark as interested to get updates"}
        </p>
      </CardContent>
    </Card>
  )
}
