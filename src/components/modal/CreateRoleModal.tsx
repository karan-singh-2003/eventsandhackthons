"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useModalStore } from "@/store/modal-slice"

export function CreateRoleModal() {
  const {
    isCreateRoleOpen,
    closeCreateRole,
    newRoleName,
    newRolePermissions,
    setNewRoleName,
    togglePermission,
    toggleSelectAll,
    resetNewRole,
  } = useModalStore()

  const [expandedGroups, setExpandedGroups] = useState<string[]>(["event-creation"])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleClose = () => {
    closeCreateRole()
    resetNewRole()
  }

  const handleCreate = () => {
    // Handle role creation logic here
    console.log("Creating role:", { name: newRoleName, permissions: newRolePermissions })
    handleClose()
  }

  return (
    <Dialog open={isCreateRoleOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Role information</h3>
            <div className="space-y-2">
              <Label htmlFor="role-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="role-name"
                placeholder="Enter a role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                maxLength={50}
                className="border-red-200 focus:border-red-300"
              />
              <div className="flex justify-between text-xs">
                <span className="text-red-600">Role name is required</span>
                <span className="text-gray-500">{newRoleName.length}/50</span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Permissions</h3>

            {newRolePermissions.map((group) => {
              const allChecked = group.permissions.every((p) => p.checked)
              const someChecked = group.permissions.some((p) => p.checked)
              const isExpanded = expandedGroups.includes(group.id)

              return (
                <Collapsible key={group.id} open={isExpanded} onOpenChange={() => toggleGroup(group.id)}>
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-900">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.description}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3 border-t">
                        <div className="flex items-center space-x-2 pt-3">
                          <Checkbox
                            id={`select-all-${group.id}`}
                            checked={allChecked}
                            ref={(el:any) => {
                              if (el) el.indeterminate = someChecked && !allChecked
                            }}
                            onCheckedChange={() => toggleSelectAll(group.id)}
                          />
                          <Label htmlFor={`select-all-${group.id}`} className="text-sm font-medium text-blue-600">
                            Select all
                          </Label>
                        </div>

                        {group.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={permission.checked}
                              onCheckedChange={() => togglePermission(group.id, permission.id)}
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!newRoleName.trim()} className="bg-orange-600 hover:bg-orange-700">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
