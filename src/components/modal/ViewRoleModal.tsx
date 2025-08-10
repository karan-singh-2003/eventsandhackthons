"use client"

import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useModalStore } from "@/store/modal-slice"

export function ViewRoleModal() {
  const { isViewRoleOpen, closeViewRole, selectedRole } = useModalStore()

  if (!selectedRole) return null

  return (
    <Dialog open={isViewRoleOpen} onOpenChange={closeViewRole}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View role</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Role Information</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">{selectedRole.name}</h4>
              <p className="text-sm text-gray-600">{selectedRole.description}</p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Permissions</h3>

            {selectedRole.permissionGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium text-slate-900">{group.name}</h4>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </div>

                <div className="space-y-2 ml-4">
                  {group.permissions
                    .filter((permission) => permission.checked)
                    .map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{permission.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={closeViewRole} className="bg-orange-600 hover:bg-orange-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
