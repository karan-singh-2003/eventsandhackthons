'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  return (
    <div className="space-y-6">
      {/* Search and Add Section */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
          <Input
            type="text"
            placeholder="Enter text to search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-2 py-2 border border-gray-300 rounded-none placeholder:text-[15px] focus:outline-none focus:border-gray-500"
          />
        </div>

        <Button
          onClick={onAddClick}
          className="ml-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium"
        >
          Add Role
        </Button>
      </div>
    </div>
  )
}
