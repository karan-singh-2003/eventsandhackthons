import type React from "react"

interface IconProps {
  className?: string
  width?: number
  height?: number
}

// Team Member Icon
export const TeamMemberIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={height}
    width={width}
    className={className}
  >
    <desc>Team Member Icon</desc>
    <g>
      <path
        d="M0.5 8 7 1.5 13.5 8"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m2.5 6 0 6.5h9V6"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

// Edit Event Icon
export const EditEventIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={height}
    width={width}
    className={className}
  >
    <desc>Edit Event Icon</desc>
    <path d="M12 20h9" strokeWidth={2} />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeWidth={2} />
  </svg>
)

// Active Log Icon
export const ActiveLogIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={height}
    width={width}
    className={className}
  >
    <desc>Active Log Icon</desc>
    <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0 -20 0" strokeWidth={2} />
    <path d="m12 6 0 6 4 2" strokeWidth={2} />
  </svg>
)
