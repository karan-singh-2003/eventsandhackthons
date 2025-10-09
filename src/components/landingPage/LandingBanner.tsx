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
    <div className="relative w-full overflow-hidden bg-[#f6f6f6] py-6 lg:py-8">
      <div className="relative mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
        {/* Smaller responsive height */}
        <div className="relative h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden">
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
              {/* Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              {/* Text */}
              <div className="relative h-full flex items-center px-6 md:px-10 lg:px-14">
                <div className="max-w-2xl">
                  <h1
                    className="mb-3 font-bold text-white leading-tight"
                    style={{
                      fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                    }}
                  >
                    {slide.title}
                    <br />
                    <span
                      className="text-accent"
                      style={{
                        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                      }}
                    >
                      {slide.highlight}
                    </span>
                  </h1>

                  <Button
                    size="sm"
                    className="mt-4 md:mt-5 bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm"
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
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
