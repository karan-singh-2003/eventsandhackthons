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
     
      className="w-full justify-start  text-left text-[14px] text-[#333333] px-8 py-1  hover:bg-gray-50"
      onClick={handleClick}
    >
      {config.label || 'Manage Events'}
    </button>
  )
}

export default SidebarManageEvents
