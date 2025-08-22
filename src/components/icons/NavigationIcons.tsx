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


export const NotificationIcon: React.FC<IconProps> = ({
  className,
  width = 14,
  height = 14,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    width={width}
    height={height}
    className={className}
  >
    <desc>Notification Bell Icon</desc>
    <g>
      <path
        d="M6 13.25h2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5.75c0-1.0609-.4214-2.0783-1.1716-2.8284C9.0783 2.1714 8.0609 1.75 7 1.75s-2.0783.4214-2.8284 1.1716C3.4214 3.6717 3 4.6891 3 5.75v3.5c0 .3978-.158.7794-.4393 1.0607S1.8978 10.75 1.5 10.75h11c-.3978 0-.7794-.158-1.0607-.4393S11 9.6478 11 9.25v-3.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 5.62c.0005-.9519.2275-1.8899.6622-2.7367C1.5969 2.0365 2.2269 1.3053 3 .75"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.62c-.0005-.9519-.2275-1.8899-.6622-2.7367S11.7731 1.3053 11 .75"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const MembersIcon: React.FC<IconProps> = ({
  className,
  width = 14,
  height = 14,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    width={width}
    height={height}
    className={className}
  >
    <desc>Members Icon</desc>
    <g>
      <path
        d="M5 6.5c1.3807 0 2.5-1.1193 2.5-2.5S6.3807 1.5 5 1.5 2.5 2.6193 2.5 4s1.1193 2.5 2.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 13.5h9v-.5421c-.008-.7622-.209-1.51-.584-2.1734a4.12 4.12 0 0 0-3.712-2.2849c-.068 0-.136.0017-.204.005-.761.0361-1.501.2645-2.15.664a4.12 4.12 0 0 0-1.562 1.6204C0.709 11.4479.508 12.1957.5 12.9579V13.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6.5c1.381 0 2.5-1.1193 2.5-2.5S10.381 1.5 9 1.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 13.5h2v-.5422c-.008-.7622-.209-1.51-.584-2.1734a4.12 4.12 0 0 0-1.562-1.6205 4.12 4.12 0 0 0-1.354-.5545"
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

export const CalendarIcon: React.FC<IconProps> = ({ className, width = 16, height = 16 }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    className={className}
  >
    <desc>Calendar Streamline Icon: https://streamlinehq.com</desc>
    <path
      d="M13 2.6666666666666665h-2V1.6666666666666665c0 -0.18407999999999997 -0.14926666666666666 -0.3333333333333333 -0.3333333333333333 -0.3333333333333333s-0.3333333333333333 0.14925333333333332 -0.3333333333333333 0.3333333333333333V2.6666666666666665h-4.666666666666666V1.6666666666666665c0 -0.18407999999999997 -0.14925333333333332 -0.3333333333333333 -0.3333333333333333 -0.3333333333333333 -0.18407999999999997 0 -0.3333333333333333 0.14925333333333332 -0.3333333333333333 0.3333333333333333V2.6666666666666665H2.999673333333333c-0.9200866666666667 0.0009733333333333332 -1.6656866666666668 0.7465799999999999 -1.6666666666666665 1.6666666666666665v8.666666666666666c0.00098 0.9200666666666667 0.7465799999999999 1.6656666666666666 1.6666666666666665 1.6666666666666665H13c0.9201333333333334 -0.0008666666666666666 1.6658 -0.7465333333333333 1.6666666666666665 -1.6666666666666665v-8.666666666666666c-0.0008666666666666666 -0.9201266666666666 -0.7465333333333333 -1.6658133333333334 -1.6666666666666665 -1.6666666666666665ZM14 13c-0.0006 0.5520666666666666 -0.44793333333333335 0.9994000000000001 -1 1H2.999673333333333c-0.55204 -0.0006 -0.9993866666666666 -0.44793333333333335 -1 -1V7.333333333333333H14v5.666666666666666Zm0 -6.333333333333333H1.9996733333333332V4.333333333333333c0.0006133333333333334 -0.55204 0.44795999999999997 -0.9993866666666666 1 -1H5v1c0 -0.00015999999999999999 0 0.00012 0 0 0.00012 0.18396 0.14933333333333332 0.33345333333333327 0.3333333333333333 0.3333333333333333 -0.00015999999999999999 0 0.00012 0 0 0 0.18396 -0.00012 0.33345333333333327 -0.14933333333333332 0.3333333333333333 -0.3333333333333333V3.333333333333333h4.666666666666666v1c0 -0.00015999999999999999 0 0.00012 0 0 0.00013333333333333334 0.18396 0.14933333333333332 0.33345333333333327 0.3333333333333333 0.3333333333333333 -0.00013333333333333334 0 0.00013333333333333334 0 0 0 0.1839333333333333 -0.00012 0.33346666666666663 -0.14933333333333332 0.3333333333333333 -0.3333333333333333V3.333333333333333h2c0.5520666666666666 0.0006133333333333334 0.9994000000000001 0.44795999999999997 1 1V6.666666666666666Z"
      fill="currentColor"
      strokeWidth={0.6667}
    />
  </svg>
)
