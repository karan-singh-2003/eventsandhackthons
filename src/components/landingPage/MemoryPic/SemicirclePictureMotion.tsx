"use client"

import * as React from "react"

type ImageItem = { src: string; alt: string }

export type SemiCircleCarouselProps = {
  images: ImageItem[]
  radius?: number
  cardSize?: number
  arcDegrees?: number
  durationMs?: number
  direction?: "clockwise" | "counterclockwise"
  className?: string
  spacingFactor?: number
  centerImage?: ImageItem
}

/**
 * SemiCircleCarousel
 * - Smooth rotating semicircle
 * - Responsive center brand image with professional shine animation
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
  centerImage,
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

  // Geometry
  const arcRad = Math.min(Math.max(arcDegrees, 10), 180) * (Math.PI / 180)
  const centerAngle = Math.PI / 2
  const startAngle = centerAngle + arcRad / 2
  const endAngle = centerAngle - arcRad / 2
  const width = radius * 2
  const height = radius

  // Evenly spaced positions
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
      className={[
        "relative mx-auto flex justify-center items-end select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        height,
      }}
    >
      {/* Soft fade mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "radial-gradient(120% 100% at 50% 100%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 100% at 50% 100%, black 60%, transparent 100%)",
        }}
      />

      {/* 🌟 Center Brand Image with Shine Animation */}
      {centerImage && (
        <div
          className="absolute flex items-center justify-center rounded-full overflow-hidden shadow-2xl bg-white"
          style={{
            width: `${cardSize * 1.5}px`,
            height: `${cardSize * 1.5}px`,
            left: "50%",
            bottom: `${radius * 0.1}px`,
            transform: "translateX(-50%)",
            zIndex: 200,
            border: "2px solid rgba(255,255,255,0.3)",
            position: "absolute",
          }}
        >
          {/* Brand image */}
          <img
            src={centerImage.src}
            alt={centerImage.alt}
            className="h-full w-full object-cover rounded-full"
            draggable={false}
            style={{
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* ✨ Shine overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
            style={{
              background:
                "linear-gradient(130deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
              transform: "translateX(-100%)",
              animation: "shineSweep 3s linear infinite",
              zIndex: 2,
            }}
          />
        </div>
      )}

      {/* 🔄 Rotating Arc Images */}
      {images.map((img, idx) => {
        const base = positions[idx]
        const v = mapWithOffset(base, phase)
        const theta = startAngle + (endAngle - startAngle) * v

        const cx = radius
        const cy = radius
        const x = cx + radius * Math.cos(theta)
        const y = cy - radius * Math.sin(theta)

        const left = x - cardSize / 2
        const top = y - cardSize / 2

        const depth = Math.sin(theta)
        const scale = 0.9 + depth * 0.12

        // Rotate upright along path
        const rotationDeg = (90 - (theta * 180) / Math.PI) * 0.9

        // Fade edges
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
              className="h-full w-full rounded-xl overflow-hidden bg-white shadow-xl"
              style={{
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        )
      })}

      {/* 🪞 Keyframes for shine */}
      <style jsx>{`
        @keyframes shineSweep {
          0% {
            transform: translateX(-120%) rotate(0deg);
          }
          50% {
            transform: translateX(120%) rotate(0deg);
          }
          100% {
            transform: translateX(120%) rotate(0deg);
          }
        }
      `}</style>
    </div>
  )
}

export default SemiCircleCarousel
