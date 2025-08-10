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
  const allSelected = permissions.every((p) =>
    selectedPermissions.includes(p.id)
  )

  return (
    <div className="rounded-lg">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
        onClick={onToggleExpanded}
      >
        <div>
          <h3 className="font-bold text-gray-900 text-[20px]">{title}</h3>
          <p className="text-base text-gray-600 mt-1">
            {permissions.length} permissions available
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 mt-4 pl-4 pt-4 space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id={`select-all-${title.toLowerCase().replace(' ', '-')}`}
              checked={allSelected}
              onCheckedChange={onSelectAll}
            />
            <label
              htmlFor={`select-all-${title.toLowerCase().replace(' ', '-')}`}
              className="text-[15px] font-medium text-gray-700"
            >
              Select all
            </label>
          </div>

          {/* Individual Permissions */}
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-3">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => onTogglePermission(permission.id)}
                />
                <label
                  htmlFor={permission.id}
                  className="text-[15px] text-gray-700"
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
}: AddRoleModalProps) {
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({})

  // Fetch permissions from database
  const { data: dbPermissions = [] } = useQueryData<PermissionResponse[]>(
    ['permissions'],
    async () => {
      const response = await fetch('/api/permissions?action=getAll')
      const result = await response.json()
      return result.data || []
    }
  )

  console.log('RoleModal dbPermissions:', dbPermissions)

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
      const permissionIds = editingRole.permissions?.map((rp) => rp.id) || []
      setSelectedPermissions(permissionIds)
    } else {
      setRoleName('')
      setSelectedPermissions([])
    }
  }, [editingRole, isOpen])

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
    if (roleName.trim()) {
      onSubmit({
        name: roleName.trim(),
        permissions: selectedPermissions,
      })
      setRoleName('')
      setSelectedPermissions([])
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
    const allPermissionIds = categoryPermissions.map((p) => p.id)
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
      <DialogContent className="!max-w-none w-screen h-screen p-0 m-0 rounded-none flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 ">
          <h1 className="text-base font-semibold max-w-[200px] mx-auto text-gray-900">
            {editingRole ? 'Edit role' : 'Create role'}
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Role Info */}
            <div className="space-y-2 mt-2">
              <h2 className="text-[30px] font-bold text-gray-900">
                Role information
              </h2>
              <div className="space-y-2">
                <Input
                  id="roleName"
                  type="text"
                  placeholder="Enter a role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full h-12 rounded-none"
                  required
                />
                <div className="text-right text-xs text-gray-500">
                  {roleName.length}/50
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-6">
              <h2 className="text-[30px] font-bold text-gray-900">
                Permissions
              </h2>
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
          <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-x-3 lg:space-y-0 lg:justify-end">
            <Button
              type="button"
              className="w-full lg:w-[200px] h-11"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700 text-white w-full lg:w-[200px] h-11"
            >
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
