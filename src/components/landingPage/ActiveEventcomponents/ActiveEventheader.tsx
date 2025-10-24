import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ActiveEventHeader() {
  return (
    <header className="bg-card w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Optional Back Button (commented out for now)
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6 text-gray-800" />
          </Button> 
          */}

          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#1a1a1a] tracking-tight">
            Ethical Hacking
          </h1>
        </div>

        {/* Right Section (Share Icon) */}
        <button
          aria-label="Share event"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-800"
          >
            <path
              stroke="currentColor"
              d="M15.567 16.946a4 4 0 1 1 6.867 4.107 4 4 0 0 1 -6.867 -4.107Zm0 0A24.001 24.001 0 0 0 9.06 13.77l-0.41 -0.129m6.917 -6.586a4 4 0 1 1 6.867 -4.107 4 4 0 0 1 -6.867 4.107Zm0 0A24 24 0 0 1 9.06 10.23l-0.41 0.129m0 0c0.225 0.5 0.35 1.055 0.35 1.64s-0.125 1.14 -0.35 1.64m0 -3.28a4 4 0 1 0 0 3.28"
              strokeWidth={1.5}
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
