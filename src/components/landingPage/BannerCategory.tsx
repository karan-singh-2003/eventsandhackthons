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
    <section className="py-10 md:py-10 lg:py-10 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <a
                key={category.id}
                href={category.href}
                className="flex flex-col items-center group transition-all duration-300 hover:scale-105"
              >
                {/* Circle Icon */}
                <div className="flex items-center justify-center w-12 h-12 lg:w-30 lg:h-30 rounded-full border-2 border-border bg-background hover:border-[#fffff] hover:shadow-sm transition-all">
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-muted-foreground group-hover:text-[#2c2c2c] transition-colors" />
                </div>

                {/* Name below the circle */}
                <span className="mt-2 text-xs lg:text-sm font-medium text-center text-[#272727] group-hover:text-[#2c2c2c] transition-colors">
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
