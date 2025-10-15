"use client"

import Aboutmotionscroll from "../eventcomponents/motioncomponent/Aboutmotionscroll"
import SemiCircleCarousel from "./SemicirclePictureMotion"

export default function MemoryPic() {
  const demoImages = [
    { src: "/family-outdoors.jpg", alt: "Couple portrait" },
    { src: "/family-outdoors.jpg", alt: "Couple portrait" },
    { src: "/dog-with-owner.jpg", alt: "Dog with owner" },
    { src: "/dog-with-owner.jpg", alt: "Dog with owner" },
    { src: "/family-outdoors.jpg", alt: "Couple portrait" },
    { src: "/dog-with-owner.jpg", alt: "Dog with owner" },
    { src: "/dog-with-owner.jpg", alt: "Dog with owner" },
  ]

  return (
    <main className="flex flex-col items-center justify-center  bg-gradient-to-b from-gray-50 to-gray-100 text-center min-h-[80vh] px-4 sm:px-6 lg:px-10 py-12 sm:py-16  lg:py-24">
      
      {/* Animated heading */}
      <div className="mb-6  lg:mb-17">
        <Aboutmotionscroll
          textSize="text-4xl  font-medium lg:text-[60px]"
          textColor="text-[#111111]"
        />
      </div>

      {/* Carousel section */}
      <section className="w-full max-w-6xl mx-auto mb-10  lg:mb-10">
        <SemiCircleCarousel
          images={demoImages}
          radius={370}
          cardSize={110}
          arcDegrees={160}
          durationMs={35000}
         spacingFactor={1.4}    
          direction="clockwise"
        />
      </section>

      {/* Description text */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-28 text-balance max-w-5xl mx-auto">
        <p className="text-base sm:text-lg  lg:text-[18px] text-[#454545] font-medium leading-relaxed">
          Every picture tells a story. Join our <span className="text-[#d1410c] font-semibold mr-0.5">college society</span> 
          and create yours at the next unforgettable event.
        </p>
      </section>
    </main>
  )
}
