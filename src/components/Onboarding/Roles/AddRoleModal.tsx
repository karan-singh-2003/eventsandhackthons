'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { PermissionResponse, RoleResponse } from './types'
import { useQueryData } from '@/hooks/useQueryData'

interface AddRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roleData: { name: string; permissions: string[] }) => void
  editingRole?: RoleResponse | null
  rolePermissions?: string[]
}

interface PermissionSectionProps {
  title: string
  permissions: PermissionResponse[]
  isExpanded: boolean
  onToggleExpanded: () => void
  selectedPermissions: string[]
  onTogglePermission: (permissionId: string) => void
  onSelectAll: () => void
}

const PermissionSection = ({
  title,
  permissions,
  isExpanded,
  onToggleExpanded,
  selectedPermissions,
  onTogglePermission,
  onSelectAll,
}: PermissionSectionProps) => {
  // all selected based on current controlled selection
  const allSelected = permissions.every((p) =>
    selectedPermissions.includes(String(p.id))
  )

  return (
    <div className="rounded-lg">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 lg:p-2 p-1 rounded"
        onClick={onToggleExpanded}
      >
        <div>
          <h3 className="font-bold text-gray-900 text-[14px] lg:text-[20px]">{title}</h3>
          <p className="lg:text-base text-[11.5px] text-gray-600 mt-1">
            {permissions.length} permissions available
          </p>
        </div>
        <ChevronDown
          className={`lg:w-5 lg:h-5 h-4 w-4 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 mt-4 pl-4 lg:pt-3  pt-4 lg:space-y-4 space-y-3">
          {/* Select All */}
          <div className="flex items-center lg:space-x-3 space-x-2">
            <Checkbox
              id={`select-all-${title.toLowerCase().replace(' ', '-')}`}
              checked={allSelected}
              onCheckedChange={onSelectAll}
              className='lg:w-5 lg:h-5 w-4 h-4'
            />
            <label
              htmlFor={`select-all-${title.toLowerCase().replace(' ', '-')}`}
              className="lg:text-[15px] text-[11.5px] font-medium text-gray-700"
            >
              Select all
            </label>
          </div>

          {/* Individual Permissions */}
          <div className="space-y-2 lg:space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2 lg:space-x-3 ">
                <Checkbox
                  id={String(permission.id)}
                  checked={selectedPermissions.includes(String(permission.id))}
                  className='lg:w-5 lg:h-5 w-4 h-4'
                  onCheckedChange={() =>
                    onTogglePermission(String(permission.id))
                  }
                />
                <label
                  htmlFor={String(permission.id)}
                  className="lg:text-[15px] text-[11.5px] text-gray-700"
                >
                  {permission.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function RoleModal({
  isOpen,
  onClose,
  onSubmit,
  editingRole,
  rolePermissions,
}: AddRoleModalProps) {
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({})
  const [error, setError] = useState<string>('')

  // Fetch permissions from database
  const { data: dbPermissions = [] } = useQueryData<PermissionResponse[]>(
    ['permissions'],
    async () => {
      const response = await fetch('/api/permissions?action=getAll')
      const result = await response.json()
      return result.data || []
    }
  )

  const permissionsByCategory = useMemo(() => {
    const grouped: { [categoryName: string]: PermissionResponse[] } = {}
    dbPermissions.forEach((permission) => {
      const categoryName = permission.category?.name || 'Other'
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(permission)
    })
    return grouped
  }, [dbPermissions])

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.name)
      // Normalize permission IDs: handle both direct Permission[] and RolePermission[] with nested permission
      type MixedPermission = {
        id?: string
        permissionId?: string
        permission?: { id: string }
      }
      const permissionIds = (editingRole.permissions || [])
        .map(
          (rp: MixedPermission) =>
            rp?.permission?.id ?? rp?.permissionId ?? rp?.id
        )
        .filter((id): id is string => Boolean(id))

      setSelectedPermissions(permissionIds)
      setError('')
    } else {
      setRoleName('')
      setSelectedPermissions([])
      setError('')
    }
  }, [editingRole, isOpen])

  // Also seed from rolePermissions prop when provided (e.g., clicked role)
  useEffect(() => {
    if (isOpen && rolePermissions && rolePermissions.length > 0) {
      // Only set if we haven't already populated selection (avoid clobbering user changes)
      if (selectedPermissions.length === 0) {
        setSelectedPermissions(Array.from(new Set(rolePermissions.map(String))))
      }
    }
  }, [isOpen, rolePermissions, selectedPermissions.length])

  useEffect(() => {
    if (dbPermissions.length > 0) {
      const initialExpanded: { [key: string]: boolean } = {}
      Object.keys(permissionsByCategory).forEach((categoryName, index) => {
        initialExpanded[categoryName] = index === 0
      })
      setExpandedSections(initialExpanded)
    }
  }, [permissionsByCategory, dbPermissions.length])

  const permissionSections = useMemo(() => {
    return Object.entries(permissionsByCategory).map(
      ([categoryName, permissions]) => ({
        id: categoryName.toLowerCase().replace(' ', '_'),
        title: categoryName,
        permissions,
      })
    )
  }, [permissionsByCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      setError('Role name is required')
      return
    }
    if (!editingRole && selectedPermissions.length === 0) {
      setError('Select at least one permission to create a role')
      return
    }
    if (roleName.trim()) {
      onSubmit({
        name: roleName.trim(),
        permissions: selectedPermissions,
      })
      setRoleName('')
      setSelectedPermissions([])
      setError('')
      onClose()
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleSelectAll = (categoryName: string) => {
    const categoryPermissions = permissionsByCategory[categoryName] || []
    const allPermissionIds = categoryPermissions.map((p) => String(p.id))
    const allSelected = allPermissionIds.every((id) =>
      selectedPermissions.includes(id)
    )

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !allPermissionIds.includes(p))
      )
    } else {
      setSelectedPermissions((prev) => [
        ...prev.filter((p) => !allPermissionIds.includes(p)),
        ...allPermissionIds,
      ])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
    <DialogContent className="!max-w-none w-screen h-[100dvh] p-0 m-0 rounded-none flex flex-col">

        {/* Header */}
       <div className="flex items-center justify-between px-4 py-2 lg:px-6 lg:py-4">
  <h1 className="lg:text-base text-[11.5px] font-semibold max-w-[200px] mx-auto text-gray-900">
    {editingRole ? 'Edit role' : 'Create role'}
  </h1>
</div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto lg:space-y-8 space-y-1">
            {/* Role Info */}
            <div className="lg:space-y-4 space-y-1 mt-1">
  <h2 className="lg:text-[30px] text-[15px] font-bold text-gray-900">
    Role information
  </h2>
  <div className="space-y-1 lg:space-y-2">
    <Input
      id="roleName"
      type="text"
      placeholder="Enter a role name"
      value={roleName}
      onChange={(e) => setRoleName(e.target.value)}
      className="w-full lg:h-14 h-[26px] lg:text-sm text-[11.5px] rounded-none placeholder:text-[11px] lg:placeholder:text-base"
      required
    />
    <div className="text-right lg:text-xs text-[11px] text-gray-500">
      {roleName.length}/50
    </div>
  </div>
</div>

            {/* Permissions */}
            <div className="lg:space-y-6 space-y-3">
              <h2 className="lg:text-[30px] text-[15px] font-bold text-gray-900">
                Permissions
              </h2>
              {error && (
                <div className="text-red-600 lg:text-[15px] text-[11px] font-medium">
                  {error}
                </div>
              )}
              {permissionSections.map((section) => (
                <PermissionSection
                  key={section.id}
                  title={section.title}
                  permissions={section.permissions}
                  isExpanded={expandedSections[section.title]}
                  onToggleExpanded={() => toggleSection(section.title)}
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={togglePermission}
                  onSelectAll={() => handleSelectAll(section.title)}
                />
               ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-x-3 lg:space-y-0 lg:justify-end lg:mb-0 mb-2 ">
            <Button
              type="button"
              className="w-full lg:w-[200px] lg:h-11 h-[28px] lg:text-base text-[11.5px] "
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700 text-white lg:h-11 h-[28px] lg:text-base text-[11.5px]  w-full lg:w-[200px] "
            >
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
