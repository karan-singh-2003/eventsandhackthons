import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventTermsCondition() {
  return (
    <div className=" space-y-2 ">
      <Button
        variant="ghost"
        className=" max-w-full lg:max-w-sm justify-between  cursor-pointer hover:bg-transparent hover:text-primary"
      >
        <h2 className="text-[24px] font-medium text-[#1a1a1a]">Terms & Condition</h2>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
