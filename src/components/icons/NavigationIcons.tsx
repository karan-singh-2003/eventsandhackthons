import type React from "react"

interface IconProps {
  className?: string
  width?: number
  height?: number
}

export const HomeIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={height}
    width={width}
    className={className}
  >
    <desc>Home 4 Streamline Icon: https://streamlinehq.com</desc>
    <g id="home-4--home-house-roof-shelter">
      <path
        id="Vector"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.5 8 7 1.5 13.5 8"
        strokeWidth={1}
      />
      <path
        id="Vector_2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.5 6 0 6.5h9V6"
        strokeWidth={1}
      />
    </g>
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 25 25"
    height={height}
    width={width}
    className={className}
  >
    <g clipPath="url(#clip0_160_111)">
      <path
        d="M12.125 18.375C14.2467 18.375 16.2816 17.5321 17.7819 16.0319C19.2821 14.5316 20.125 12.4967 20.125 10.375C20.125 8.25327 19.2821 6.21844 17.7819 4.71815C16.2816 3.21785 14.2467 2.375 12.125 2.375C10.0033 2.375 7.96844 3.21785 6.46815 4.71815C4.96785 6.21844 4.125 8.25327 4.125 10.375C4.125 12.4967 4.96785 14.5316 6.46815 16.0319C7.96844 17.5321 10.0033 18.375 12.125 18.375Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.125 12.375C12.6554 12.375 13.1641 12.1643 13.5392 11.7892C13.9143 11.4141 14.125 10.9054 14.125 10.375C14.125 9.84457 13.9143 9.33586 13.5392 8.96079C13.1641 8.58571 12.6554 8.375 12.125 8.375C11.5946 8.375 11.0859 8.58571 10.7108 8.96079C10.3357 9.33586 10.125 9.84457 10.125 10.375C10.125 10.9054 10.3357 11.4141 10.7108 11.7892C11.0859 12.1643 11.5946 12.375 12.125 12.375Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.125 0.375V2.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.125 20.375V18.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.125 19.035L16.125 17.305"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.125 8.645L7.125 1.715"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.7851 15.375L19.0551 14.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.46497 5.375L5.19497 6.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.125 10.375H22.125"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.125 10.375H4.125"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.7851 5.375L19.0551 6.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.46497 15.375L5.19497 14.375"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.125 1.715L16.125 3.445"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.125 12.105L7.125 19.035"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_160_111">
        <rect width="24" height="24" fill="white" transform="translate(0.125 0.375)" />
      </clipPath>
    </defs>
  </svg>
)

export const NotificationIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={height}
    width={width}
    className={className}
  >
    <desc>Notification Bell Icon</desc>
    <g>
      <path
        d="M10.5 4.5C10.5 3.57174 10.1313 2.6815 9.47487 2.02513C8.8185 1.36875 7.92826 1 7 1C6.07174 1 5.1815 1.36875 4.52513 2.02513C3.86875 2.6815 3.5 3.57174 3.5 4.5C3.5 8.5 2 9.5 2 9.5H12C12 9.5 10.5 8.5 10.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.18506 11.5C8.03228 11.8031 7.79808 12.0547 7.50798 12.2295C7.21788 12.4044 6.88299 12.4965 6.54256 12.4965C6.20213 12.4965 5.86724 12.4044 5.57714 12.2295C5.28704 12.0547 5.05284 11.8031 4.90006 11.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const MembersIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={height}
    width={width}
    className={className}
  >
    <desc>Members Icon</desc>
    <g>
      <path
        d="M9.5 3.5C9.5 4.88071 8.38071 6 7 6C5.61929 6 4.5 4.88071 4.5 3.5C4.5 2.11929 5.61929 1 7 1C8.38071 1 9.5 2.11929 9.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 13V11.5C2 10.1193 3.11929 9 4.5 9H9.5C10.8807 9 12 10.1193 12 11.5V13"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const SearchIcon: React.FC<IconProps> = ({ className, width = 14, height = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={height}
    width={width}
    className={className}
  >
    <desc>Search Icon</desc>
    <g>
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 13-3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)
