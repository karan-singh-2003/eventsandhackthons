import React, { useState, useEffect } from 'react'
import { RoleResponse } from './types'
import { RoleAvatar } from './RoleAvatar'
import { RoleActions } from './RoleActions'

import { Skeleton } from '@/components/ui/skeleton'

interface RoleItemProps {
  role: RoleResponse
  onDelete: (role: RoleResponse) => void
  onRoleClick?: (role: RoleResponse) => void
  isLoading?: boolean
}

export function RoleItem({
  role,
  onDelete,
  onRoleClick,
  isLoading,
}: RoleItemProps) {
  const [internalLoading, setInternalLoading] = useState(true)

  useEffect(() => {
    // Set loading to false after component mounts
    const timer = setTimeout(() => {
      setInternalLoading(false)
    }, 500) // 500ms delay to show skeleton briefly

    return () => clearTimeout(timer)
  }, [role])

  // Use external isLoading prop or internal loading state
  const shouldShowLoading = isLoading || internalLoading

  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-between py-1.5 w-full">
        <div className="flex items-center space-x-3 flex-1">
          {/* Avatar Skeleton */}
          <Skeleton className="w-11 h-11 rounded-full" />

          {/* Name Skeleton */}
          <Skeleton className="h-4 w-24 rounded-none" />
        </div>
      </div>
    )
  }

  const handleRoleClick = () => {
    if (onRoleClick) {
      onRoleClick(role)
    }
  }

  console.log('RoleItem rendered:', role)
  return (
    <div className="flex  items-center">
      <div
        className="flex items-center justify-between py-2.5 mr-1 p-2 group w-full hover:bg-gray-50 rounded-none transition-colors cursor-pointer"
        onClick={handleRoleClick}
      >
        <div className="flex items-center space-x-3 relative ">
          <RoleAvatar role={role} />

          {/* Role Name */}
          <span className="text-sm font-medium text-gray-900 transition-all duration-200 ">
            {role.name}
          </span>
        </div>
      </div>
      <div
        className="flex-shrink-0 ml-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <RoleActions Roles={[role]} onDelete={onDelete} />
      </div>
    </div>
  )
}
