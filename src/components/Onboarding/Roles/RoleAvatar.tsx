'use client'

import React from 'react'
import { RoleResponse } from './types'

interface RoleAvatarProps {
  role: RoleResponse
}

export function RoleAvatar({ role }: RoleAvatarProps) {
  // Generate initials from role name
  const initials =
    role.name
      ?.split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'

  return (
    <div className="relative">
      <div className="lg:w-10 lg:h-10 h-7 w-7 bg-black rounded-full flex items-center justify-center text-white lg:text-sm text-[11px] font-medium transition-all duration-200">
        {initials}
      </div>
    </div>
  )
}
