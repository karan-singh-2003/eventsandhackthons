'use client'

import React from 'react'
import { RoleResponse } from './types'
import { RoleAvatar } from './RoleAvatar'
import { RoleActions } from './RoleActions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface RoleTableProps {
  roles: RoleResponse[]
  onDelete: (role: RoleResponse) => void
  onRoleClick?: (role: RoleResponse) => void
}

export function RoleTable({ roles, onRoleClick, onDelete }: RoleTableProps) {
  return (
    <div className="bg-white mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center p-9 bg-gray-50">
                No roles available. Please add a role.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow
                key={role.id}
                onClick={() => onRoleClick?.(role)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <RoleAvatar role={role} />
                    <div className="text-foreground text-[15px] font-medium">
                      {role.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RoleActions Roles={[role]} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
