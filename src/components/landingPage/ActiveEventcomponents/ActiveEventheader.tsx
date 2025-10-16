import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ActiveEventheader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Event Details</h1>
      </div>
    </header>
  )
}
