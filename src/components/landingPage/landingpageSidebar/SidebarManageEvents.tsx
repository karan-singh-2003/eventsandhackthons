'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

interface ManageEventsConfig {
  show: boolean
  label: string
  redirectTo: string
  reason: string
}

interface SidebarManageEventsProps {
  isLoading: boolean
  config: ManageEventsConfig
  onClose: () => void
}

const SidebarManageEvents = ({
  isLoading,
  config,
  onClose,
}: SidebarManageEventsProps) => {
  const handleClick = () => {
    if (config.redirectTo) {
      window.location.href = config.redirectTo
      onClose()
    }
  }

  if (isLoading) {
    return <div className="w-full h-10 bg-gray-200 animate-pulse rounded-none"></div>
  }

  if (!config.show) return null

  return (
   <button
  onClick={handleClick}
  className="flex items-center gap-2 w-full justify-start text-left text-[14px] text-[#333333] px-4 py-1 hover:bg-gray-50"
>
  {/* SVG Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
    height={16}
    width={16}
  >
    <path
      d="M3.75 5.5v-4c0 -0.552285 0.44772 -1 1 -1h4.5c0.55228 0 1 0.447715 1 1v4c0 0.55228 -0.44772 1 -1 1h-4.5c-0.55228 0 -1 -0.44772 -1 -1Z"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M7 6.5v4"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M2 10.5v-1c0 -0.55228 0.44772 -1 1 -1h8c0.5523 0 1 0.44772 1 1v1"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M0.5 12.5v-1c0 -0.5523 0.447715 -1 1 -1h1c0.55228 0 1 0.4477 1 1v1c0 0.5523 -0.44772 1 -1 1h-1c-0.552285 0 -1 -0.4477 -1 -1Z"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M5.5 12.5v-1c0 -0.5523 0.44772 -1 1 -1h1c0.55228 0 1 0.4477 1 1v1c0 0.5523 -0.44772 1 -1 1h-1c-0.55228 0 -1 -0.4477 -1 -1Z"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M10.5 12.5v-1c0 -0.5523 0.4477 -1 1 -1h1c0.5523 0 1 0.4477 1 1v1c0 0.5523 -0.4477 1 -1 1h-1c-0.5523 0 -1 -0.4477 -1 -1Z"
      stroke="#333333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </svg>

  {/* Button Text */}
  {config.label || 'Manage Events'}
</button>

  )
}

export default SidebarManageEvents
