import React, { useState } from 'react'
import { useQueryData } from '@/hooks/useQueryData'
import { RoleResponse } from '../Roles/types'
import { useWorkspaceSlug, useWorkspaceData } from '@/context/WorkspaceContext'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface ChooseRoleModalProps {
  handleSelectRole?: (role: RoleResponse | null) => void
  selectedRole?: RoleResponse | null
  currentRoleName?: string
  workspaceSlug?: string
}

const ChooseRoleModal = ({
  selectedRole,
  handleSelectRole,
  currentRoleName,
  workspaceSlug,
}: ChooseRoleModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {}
  )
  const [inChooseRole, setInChooseRole] = useState<string | null>(null)

  const workspaceSlugFromContext = useWorkspaceSlug()
  const workspace = useWorkspaceData()

  // Debug workspace context
  console.log('🎯 [ChooseRoleModal] Workspace context:', {
    workspaceSlugFromContext,
    workspace,
    providedSlug: workspaceSlug,
  })

  const workspaceslug =
    workspaceSlug || workspaceSlugFromContext || workspace?.slug || ''

  // Show warning if no workspace context
  if (!workspaceslug) {
    console.warn(
      '⚠️ [ChooseRoleModal] No workspace slug available for role fetching'
    )
  }

  const { data } = useQueryData<RoleResponse[]>(
    ['getAllRolesOfWorkspace', workspaceslug],
    async () => {
      if (!workspaceslug) {
        console.error(
          '❌ [ChooseRoleModal] Cannot fetch roles: No workspace slug'
        )
        return Promise.resolve([])
      }
      console.log(
        '🔍 [ChooseRoleModal] Fetching roles for workspace:',
        workspaceslug
      )
      const response = await fetch(
        `/api/roles?workspaceSlug=${workspaceslug}&action=getAll`
      )
      const result = await response.json()
      return result.data || []
    }
  )

  const roles = data || []

  const onRoleSelect = (role: RoleResponse) => {
    console.log('Selected role:', role)
    setInChooseRole(role.name)
    handleSelectRole?.(role)
    setIsOpen(false)
  }

  const toggleRole = (roleId: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }))
  }
  const triggerText = currentRoleName || selectedRole?.name || 'Choose Role'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="text-[15px]  text-start  text-muted-foreground cursor-pointer hover:text-gray-900">
          {triggerText}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg  rounded-none h-2/3 flex flex-col items-start">
        <DialogHeader className="w-full">
          <DialogTitle>Choose a Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-3  w-full flex-1 overflow-y-auto">
          {!workspaceslug && (
            <div className="text-center p-4 text-gray-500">
              <p>No workspace found. Please create a workspace first.</p>
            </div>
          )}
          {workspaceslug && roles.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              <p>No roles found for this workspace.</p>
              <p className="text-sm">
                Roles will be created automatically when you set up your
                workspace.
              </p>
            </div>
          )}
          {workspaceslug &&
            roles.length > 0 &&
            roles.map((role) => (
              <Collapsible
                key={role.id}
                open={expandedRoles[role.id]}
                onOpenChange={() => toggleRole(role.id)}
              >
                <div
                  className="border rounded-none p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onRoleSelect(role)}
                >
                  <div className="flex ">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-left">{role.name}</h3>
                        {(role.name === currentRoleName ||
                          inChooseRole === role.name) && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 text-left">
                        {role.permissions.length} permission
                        {role.permissions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <CollapsibleTrigger
                      asChild
                      onClick={(e) => {
                        e.stopPropagation() // Prevent role selection when clicking expand
                      }}
                      className="rounded-none"
                    >
                      <Button variant="ghost" size="sm" className="p-1">
                        {expandedRoles[role.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="mt-3">
                    <div className="border-t pt-3">
                      {role.permissions.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No permissions assigned to this role.
                        </p>
                      )}
                      {role.permissions.length > 0 && (
                        <>
                          <h4 className="text-sm font-medium mb-2 text-gray-700">
                            Permissions:
                          </h4>
                          <div className="space-y-1">
                            {role.permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="text-sm text-gray-700  px-2 py-1 rounded"
                              >
                                {permission.label}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChooseRoleModal
