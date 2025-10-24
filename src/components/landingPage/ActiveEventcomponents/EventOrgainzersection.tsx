import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function EventOrganizer() {
  return (

    <div className="space-y-3 lg:pb-3 pb-4">
      <h2 className="text-xl lg:text-[24px] font-medium text-[#1a1a1a]">Organised By</h2>

      <div className="flex bg-[#f9f9f9] items-center gap-4 lg:max-w-[47vh] max-w-[30vh] p-4 lg:p-3 rounded-lg  border border-border">
        <div className="w-12 lg:w-9 lg:h-9 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold text-[18px]">GN</span>
        </div>
                <Button variant="outline" size="sm" className="gap-2 p-2 cursor-pointer bg-transparent">
          <Mail className="w-4 h-4" />
          Contact Orgainzers
        </Button>
      </div>
    </div>
  )
}
