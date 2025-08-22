'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'

interface RoleHeaderProps {
  searchText: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
}

export function RoleHeader({
  searchText,
  onSearchChange,
  onAddClick,
}: RoleHeaderProps) {
   const { workspaceSlug } = useParams()
  const { can, isPending: permsPending } = usePermissions(
    workspaceSlug as string
  )
  const canAddRole = can(
    `${process.env.NEXT_PUBLIC_ADD_ROLE_PERMISSION_ID}`
  )
  return (
    <div className="space-y-6">
      {/* Search and Add Section */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 lg:w-4 lg:h-4 h-3 w-3" />
          <Input
            type="text"
            placeholder="Enter text to search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-2 py-2 border border-gray-300 rounded-none lg:placeholder:text-[15px] placeholder:text-[11.5px] lg:text-sm text-xs lg:h-full h-[28px]   focus:outline-none focus:border-gray-500"
          />
        </div>

        <Button
          onClick={onAddClick}
          className="ml-4 bg-orange-600 hover:bg-orange-700 text-white lg:px-6 px-4 py-2 rounded-full lg:text-sm text-[11.5px] lg:h-full h-[28px] font-medium"
          disabled={!canAddRole || permsPending}
        >
          Add Role
        </Button>
      </div>
    </div>
  )
}
