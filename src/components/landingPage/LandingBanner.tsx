'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/cybersecurity-hacking-workshop-poster-dark-theme.jpg",
    title: "THIS FALL MAKE",
    highlight: "IT A MOMENT",
    cta: "Get Tickets Now",
  },
  {
    id: 2,
    image: "/tech-conference-modern-stage-lighting-audience.jpg",
    title: "EXPERIENCE THE",
    highlight: "FUTURE OF TECH",
    cta: "Register Today",
  },
]

export function LandingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  return (
    <div className="relative w-full overflow-hidden bg-[#f6f6f6] py-8 lg:py-6">
      <div className="relative max-w-[1390px] mx-auto px-4 lg:px-6 h-[390px]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center ml-6">
              <div className="max-w-3xl">
                {/* Responsive Heading */}
                <h1
                  className="mb-4 font-bold text-white leading-tight"
                  style={{
                    fontSize: 'clamp(1.5rem, 5vw, 4rem)'
                  }}
                >
                  {slide.title}
                  <br />
                  <span className="text-accent" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
                    {slide.highlight}
                  </span>
                </h1>

                {/* Responsive Button */}
                <Button
                  size="lg"
                  className="mt-6 md:mt-8 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg rounded-full"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
