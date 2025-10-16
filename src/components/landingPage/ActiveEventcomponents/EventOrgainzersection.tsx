import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function EventOrganizer() {
  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-xl font-bold text-foreground">Organised By</h3>

      <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold text-lg">GN</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">Guru Nanak Dev Engineering College</h4>
          <p className="text-sm text-muted-foreground">Department of Information Technology</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Mail className="w-4 h-4" />
          Contact
        </Button>
      </div>
    </div>
  )
}
