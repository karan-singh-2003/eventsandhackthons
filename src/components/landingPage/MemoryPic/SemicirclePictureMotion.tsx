"use client"

import * as React from "react"

type ImageItem = { src: string; alt: string }

export type SemiCircleCarouselProps = {
  images: ImageItem[]
  radius?: number // px
  cardSize?: number // px (cards are square)
  arcDegrees?: number // visible arc span in degrees (<= 180 for semicircle), default 160
  durationMs?: number // time to sweep one-way (clockwise), then ping-pong back
  direction?: "clockwise" | "counterclockwise"
  className?: string
  spacingFactor?: number // control gap between images
}

/**
 * SemiCircleCarousel
 * - Images move along a semicircle arc and tilt smoothly along the path.
 * - Natural upright rotation correction applied for realistic look.
 */
export function SemiCircleCarousel({
  images,
  radius = 260,
  cardSize = 96,
  arcDegrees = 160,
  durationMs = 12000,
  direction = "clockwise",
  className,
  spacingFactor = 1,
}: SemiCircleCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = React.useState(0)
  const reducedMotion = React.useRef(false)
  const dirSign = direction === "clockwise" ? 1 : -1

  // Handle reduced motion
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotion.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => (reducedMotion.current = e.matches)
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  // Continuous rotation
  React.useEffect(() => {
    if (reducedMotion.current) return

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const raw = (elapsed / durationMs) * dirSign
      const p = ((raw % 1) + 1) % 1
      setPhase(p)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, dirSign])

  // Geometry setup
  const arcRad = Math.min(Math.max(arcDegrees, 10), 180) * (Math.PI / 180)
  const centerAngle = Math.PI / 2
  const startAngle = centerAngle + arcRad / 2
  const endAngle = centerAngle - arcRad / 2
  const width = radius * 2
  const height = radius

  // Evenly spaced positions with spacingFactor
  const positions = React.useMemo(() => {
    if (!images.length) return []
    return images.map((_, i) => (i / images.length) * spacingFactor)
  }, [images.length, spacingFactor])

  const mapWithOffset = (base: number, offset: number) => {
    const v = base + offset
    return ((v % 1) + 1) % 1
  }

  return (
    <div
      ref={containerRef}
      aria-label="Semicircle image carousel"
      className={["relative mx-auto select-none", className].filter(Boolean).join(" ")}
      style={{
        width,
        height,
      }}
    >
      {/* Soft mask to fade bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "radial-gradient(120% 100% at 50% 100%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 50% 100%, black 60%, transparent 100%)",
        }}
      />

      {images.map((img, idx) => {
        const base = positions[idx]
        const v = mapWithOffset(base, phase)
        const theta = startAngle + (endAngle - startAngle) * v

        // Circle center
        const cx = radius
        const cy = radius
        const x = cx + radius * Math.cos(theta)
        const y = cy - radius * Math.sin(theta)

        const left = x - cardSize / 2
        const top = y - cardSize / 2

        const depth = Math.sin(theta)
        const scale = 0.9 + depth * 0.12

        // ✅ Corrected rotation along semicircle
        // Keeps image upright but subtly tilts along the curve.
        const rotationDeg = (90 - (theta * 180) / Math.PI) * 0.6

        // Fade at edges
        const fadeFrac = 0.12
        let edgeAlpha = 1
        if (v < fadeFrac) edgeAlpha = v / fadeFrac
        else if (v > 1 - fadeFrac) edgeAlpha = (1 - v) / fadeFrac
        const opacity = Math.max(0, Math.min(1, Math.pow(edgeAlpha, 0.9)))

        return (
          <div
            key={idx}
            className="absolute will-change-transform"
            style={{
              left,
              top,
              width: cardSize,
              height: cardSize,
              transform: `
                translateZ(0)
                scale(${scale})
                rotate(${rotationDeg}deg)
              `,
              transformOrigin: "center center",
              zIndex: 100 + Math.round(depth * 100),
              opacity,
            }}
          >
            <div
              className="h-full w-full rounded-xl bg-card shadow-xl overflow-hidden"
              style={{
                border: "1px solid var(--color-border)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                className="h-full w-full object-cover"
                draggable={false}
                style={{ display: "block" }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SemiCircleCarousel
