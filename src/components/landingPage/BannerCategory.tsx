'use client'

import { Calendar, Zap, Code, Trophy, Wrench, Archive } from "lucide-react"

const categories = [
  { id: 1, name: "Enrolled", icon: Calendar, href: "/enrolled" },
  { id: 3, name: "Latest Event", icon: Zap, href: "/latest" },
  { id: 4, name: "Technical Events", icon: Code, href: "/technical" },
  { id: 5, name: "Hackathon Events", icon: Trophy, href: "/hackathons" },
  { id: 6, name: "Workshop Events", icon: Wrench, href: "/workshops" },
  { id: 7, name: "Event Archives", icon: Archive, href: "/archives" },
]

export function BannerCategory() {
  return (
    <section className="py-10 md:py-12 lg:py-14 bg-background ">
      <div className="max-w-[1250px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Responsive grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <a
                key={category.id}
                href={category.href}
                className="flex flex-col items-center group transition-all duration-300 hover:scale-105"
              >
                {/* Bigger circle - smaller icon */}
                <div
                  className="
                    flex items-center justify-center
                    w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-24 lg:h-24
                    rounded-full border border-border
                     hover:border-gray-400
                    transition-all duration-300
                  "
                >
                  <Icon
                    className="
                      h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-7 lg:w-7
                      text-[#5f5f5f]
                      group-hover:text-[#1f1f1f]
                      transition-colors
                    "
                  />
                </div>

                {/* Label below the icon */}
                <span
                  className="
                    mt-3 text-[10px] sm:text-xs md:text-sm lg:text-[15px]
                    font-medium text-center
                    text-[#3c3c3c]
                    group-hover:text-[#1f1f1f]
                    transition-colors
                  "
                >
                  {category.name}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
