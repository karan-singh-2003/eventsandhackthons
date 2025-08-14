'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWorkspaceSlugSafe } from '@/context/WorkspaceContext'

import { RoleHeader } from './RoleHeader'
import { RoleTable } from './RoleTable'
import { RoleResponse } from './types'
import { RoleModal } from './AddRoleModal'
import { getAuthData } from '@/lib/auth-client'

interface RoleManagerProps {
  Roles: RoleResponse[]
}

const RoleManager = ({ Roles }: RoleManagerProps) => {
  const workspaceSlug = useWorkspaceSlugSafe()

  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Get current user ID from auth
  useEffect(() => {
    const authData = getAuthData()
    if (authData.userInfo?.userId) {
      setCurrentUserId(authData.userInfo.userId)
    }
  }, [])

  const onSearchChange = (value: string) => {
    setSearchText(value)
  }

  // Filter roles based on search text
  const filteredRoles = useMemo(() => {
    if (!searchText.trim()) {
      return Roles
    }

    return Roles.filter((role) =>
      role.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [Roles, searchText])

  const handleAddRole = () => {
    setEditingRole(null) // Ensure we're in create mode
    setIsModalOpen(true)
  }

  const handleCreateRole = async (roleData: {
    name: string
    permissions: string[]
  }) => {
    if (!currentUserId) {
      console.error('User ID is required for audit tracking')
      return
    }

    try {
      console.log('🔄 Starting role operation...', {
        isEditing: !!editingRole,
        roleName: roleData.name,
      })

      if (editingRole) {
        // Update existing role
        const response = await fetch('/api/roles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingRole.id,
            name: roleData.name,
            permissions: roleData.permissions,
            userId: currentUserId,
          }),
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update role')
        }
        console.log('✅ Role updated successfully:', roleData.name)
      } else {
        // Create new role
        const response = await fetch('/api/roles/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: roleData.name,
            permissions: roleData.permissions,
            workspaceSlug: workspaceSlug || 'default-workspace',
          }),
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create role')
        }
        console.log('✅ Role created successfully:', roleData.name)
      }

      // Invalidate and refetch roles after creation/update
      await queryClient.invalidateQueries({
        queryKey: ['getAllRolesOfWorkspace', workspaceSlug],
      })

      // Also refetch immediately to ensure UI is updated
      await queryClient.refetchQueries({
        queryKey: ['getAllRolesOfWorkspace', workspaceSlug],
      })

      console.log('🔄 Roles cache invalidated and refetched')
    } catch (error) {
      console.error('Error saving role:', error)
    } finally {
      setIsModalOpen(false)
      setEditingRole(null)
    }
  }

  const handleRoleClick = (role: RoleResponse) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingRole(null)
  }
  const handleRoleDelete = async (role: RoleResponse) => {
    try {
      console.log('🗑️ Deleting role:', role.name)

      // Call the delete API
      const response = await fetch(`/api/roles?roleId=${role.id}`, {
        method: 'DELETE',
      })
      const res = await response.json()

      console.log('🗑️ Role delete response:', res)
      if (res.status !== 200) {
        throw new Error(res.error || 'Failed to delete role')
      }

      if (res.status === 200) {
        // Invalidate and refetch roles after deletion
        await queryClient.invalidateQueries({
          queryKey: ['getAllRolesOfWorkspace', workspaceSlug],
        })

        // Also refetch immediately to ensure UI is updated
        await queryClient.refetchQueries({
          queryKey: ['getAllRolesOfWorkspace', workspaceSlug],
        })

        console.log('✅ Role deleted and cache refreshed:', role.name)
      } else {
        console.error('❌ Failed to delete role:', role.name)
      }
    } catch (error) {
      console.error('❌ Error deleting role:', error)
    }
  }

  return (
    <div>
      <RoleHeader
        onSearchChange={onSearchChange}
        searchText={searchText}
        onAddClick={handleAddRole}
      />

      <RoleTable
        roles={filteredRoles}
        onRoleClick={handleRoleClick}
        onDelete={handleRoleDelete}
      />

      <RoleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateRole}
        editingRole={editingRole}
        rolePermissions={(() => {
          type MixedPermission = {
            id?: string
            permissionId?: string
            permission?: { id: string }
          }
          const source = (editingRole?.permissions ||
            []) as unknown as MixedPermission[]
          return source
            .map((p) => p.permission?.id ?? p.permissionId ?? p.id)
            .filter((id): id is string => Boolean(id))
        })()}
      />
    </div>
  )
}

export default RoleManager
