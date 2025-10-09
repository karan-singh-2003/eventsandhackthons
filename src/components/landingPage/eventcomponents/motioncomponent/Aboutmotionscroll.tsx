"use client"

import React, { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function AboutMotionTextFallFromTop() {
  const controls = useAnimation()

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
    rootMargin: "0px 0px -10% 0px",
  })

  const text = "Memories"
  const chars = text.split("")

  useEffect(() => {
    if (inView) controls.start("visible")
    else controls.start("hidden")
  }, [inView, controls])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  // 👇 Reversed: starts from above (negative Y)
  const item = (distance: number) => ({
    hidden: {
      y: -160, // move above when hidden
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    visible: {
      y: 0, // falls down into place
      transition: {
        delay: distance * 0.05,
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  })

  const centerIndex = Math.floor(chars.length / 2)

  return (
    <section className="h-[100vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Overflow mask box */}
      <div
        ref={ref}
        className="overflow-hidden h-[4em] flex items-center justify-center"
      >
        <motion.h1
          variants={container}
          initial="hidden"
          animate={controls}
          className="text-6xl md:text-8xl font-bold text-black tracking-tight flex leading-none"
        >
          {chars.map((char, i) => {
            const distance = Math.abs(i - centerIndex)
            return (
              <motion.span
                key={i}
                variants={item(distance)}
                className="inline-block mx-[2px]"
              >
                {char}
              </motion.span>
            )
          })}
        </motion.h1>
      </div>
    </section>
  )
}
