"use client"

import React, { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface AboutMotionScrollProps {
  text?: string
  textSize?: string // Tailwind size class like 'text-6xl'
  textColor?: string // Tailwind color class like 'text-black'
}

export default function AboutMotionScroll({
  text = "Memories",
  textSize = "text-6xl",
  textColor = "text-black",
}: AboutMotionScrollProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
    rootMargin: "0px 0px -10% 0px",
  })

  const chars = text.split("")

  useEffect(() => {
    if (inView) controls.start("visible")
    else controls.start("hidden")
  }, [inView, controls])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const item = (distance: number) => ({
    hidden: {
      y: -160,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    visible: {
      y: 0,
      transition: {
        delay: distance * 0.05,
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  })

  const centerIndex = Math.floor(chars.length / 2)

  return (
    <section className="h-[20vh] flex items-center justify-center ">
      <div
        ref={ref}
        className="overflow-hidden h-[4em] flex items-center justify-center"
      >
        <motion.h1
          variants={container}
          initial="hidden"
          animate={controls}
          className={`${textSize} ${textColor}  tracking-tight flex leading-none`}
        >
          {chars.map((char, i) => {
            const distance:any = Math.abs(i - centerIndex)
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
