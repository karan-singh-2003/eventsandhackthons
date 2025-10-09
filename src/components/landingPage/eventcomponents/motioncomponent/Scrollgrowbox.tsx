"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import React, { useRef } from "react"

export default function ScrollGrowBox() {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress for the div
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], 
    // "start end" → when top of div touches bottom of viewport
    // "end start" → when bottom of div touches top of viewport
  })

  // Animate height from 0% → 100%
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="relative h-[200vh] bg-gray-100 flex items-center justify-center">
      <div
        ref={ref}
        className="relative w-full h-screen flex items-center justify-center"
      >
        <motion.div
          style={{ height }}
          className="w-40 bg-blue-600 rounded-2xl shadow-xl origin-bottom"
        />
      </div>
    </div>
  )
}
