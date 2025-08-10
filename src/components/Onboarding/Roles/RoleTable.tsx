'use client'

import React from 'react'
import { RoleResponse } from './types'
import { RoleItem } from './RoleItem'

interface RoleTableProps {
  roles: RoleResponse[]
  onDelete: (role: RoleResponse) => void
  onRoleClick?: (role: RoleResponse) => void
}

export function RoleTable({ roles, onRoleClick, onDelete }: RoleTableProps) {
  return (
    <div className="bg-white mt-6">
      {/* Table Header */}
      <div className="border-b bg-orange-50 flex items-center border-gray-300 mb-4">
        <div className="lg:text-base text-sm px-7 py-2 font-medium text-gray-900">
          Name
        </div>
      </div>

      <div>
        {roles.map((role) => (
          <RoleItem
            key={role.id}
            role={role}
            onRoleClick={onRoleClick}
            onDelete={onDelete}
          />
        ))}
      </div>
      {roles.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          No roles available. Please add a role.
        </div>
      )}
    </div>
  )
}
