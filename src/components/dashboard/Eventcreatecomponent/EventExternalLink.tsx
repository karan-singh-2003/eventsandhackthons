"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2 } from "lucide-react"

interface ExternalLinksProps {
  linkTitle: any
  linkUrl: any
  onLinkTitleChange: (title: string) => void
  onLinkUrlChange: (url: string) => void
}

export default function EventExternalLinks({
  linkTitle,
  linkUrl,
  onLinkTitleChange,
  onLinkUrlChange,
}: ExternalLinksProps) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-foreground">External Links</CardTitle>
            <CardDescription>Add relevant links related to your event</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Link Title */}
        <div className="space-y-2">
          <Label htmlFor="link-title" className="text-foreground font-medium">
            Link Title
          </Label>
          <Input
            id="link-title"
            type="text"
            placeholder="e.g., Event Website, Registration Form"
            value={linkTitle}
            onChange={(e) => onLinkTitleChange(e.target.value)}
            className="border border-input bg-background text-foreground focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Link URL */}
        <div className="space-y-2">
          <Label htmlFor="link-url" className="text-foreground font-medium">
            Link URL
          </Label>
          <Input
            id="link-url"
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => onLinkUrlChange(e.target.value)}
            className="border border-input bg-background text-foreground focus:ring-2 focus:ring-primary"
          />
        </div>
      </CardContent>
    </Card>
  )
}
