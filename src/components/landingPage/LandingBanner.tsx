"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useGetLoadingbanner from "@/hooks/useGetLoadingbanner";
import { useRouter } from "next/navigation";

export function LandingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data = [], isError, isPending } = useGetLoadingbanner();

  const slides = data?.events || [];
const router = useRouter()

  // Auto Slide
  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  if (isPending) {
    return (
      <div className="w-full bg-[#f6f6f6] h-[250px] flex items-center justify-center">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    );
  }

  if (isError || slides.length === 0) {
    return (
      <div className="w-full bg-[#f6f6f6] h-[250px] flex items-center justify-center">
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#f6f6f6] py-6 lg:py-8">
      <div className="relative mx-auto px-4 md:px-8 lg:px-10 max-w-[1400px]">
        
        <div className="relative h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden">
          {slides?.map((event: any, index: number) => (
            <div
              key={event.id}
              onClick={()=>router.push(`/event/${event?.id}`)}
              className={`absolute inset-0 transition-all duration-700 ease-in-out
                ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                }`}
            >
              {/* Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden" >
                <img
                  src={event.bannerUrl || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-fill object-center rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              {/* Text */}
              <div className="relative h-full flex items-center px-6 md:px-10 lg:px-14">
                <div className="max-w-2xl">
                  <h1
                    className=" font-semibold absolute bottom-6 left-6 lg:bottom-17 md:left-10 text-white leading-tight"
                    style={{
                      fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
                    }}
                  >
                    {event.name}
                  </h1>

                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10">
  <Button
    size="sm"
    className="bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm"
  >
    View Event
  </Button>
</div>
 </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
