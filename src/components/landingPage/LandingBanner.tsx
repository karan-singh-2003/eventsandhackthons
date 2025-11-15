"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetLatestbanner from "@/hooks/useGetLoadingbanner";

export function LandingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data = [], isError, isPending } = useGetLatestbanner();

  const slides = data?.events || [];
const router = useRouter()

  // Auto Slide
  useEffect(() => {
    if (!slides.length) return ;

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
             {/* Text */}
<div className="relative h-full flex items-end px-6 md:px-10 lg:px-14 pb-10">
  <div className="max-w-xl space-y-1.5">

    {/* Event Name */}
    <h1
      className="text-white font-bold leading-tight drop-shadow-md"
      style={{
        fontSize: "clamp(1.4rem, 4vw, 2.8rem)", // responsive
      }}
    >
      {event.name}
    </h1>

    {/* Event Description */}
    <p
      className="text-white/80 text-sm md:text-base font-normal line-clamp-2 drop-shadow-sm"
      style={{
        maxWidth: "500px",
      }}
    >
      {event.description}
    </p>

    {/* View Event Button */}
    <button
      onClick={() => router.push(`/event/${event.id}`)}
      className="mt-3 bg-accent hover:cursor-pointer hover:bg-accent/90 text-[#1a1a1a] px-3 lg:px-5 py-1.5 lg:py-2 rounded-sm text-xs lg:text-sm font-medium transition"
    >
      View Event
    </button>

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
