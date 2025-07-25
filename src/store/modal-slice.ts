import { create } from "zustand"

interface Permission {
  id: string
  name: string
  description: string
  checked: boolean
}

interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

interface Role {
  id: string
  name: string
  description: string
  permissionGroups: PermissionGroup[]
}

interface ModalState {
  isCreateRoleOpen: boolean
  isViewRoleOpen: boolean
  selectedRole: Role | null
  newRoleName: string
  newRolePermissions: PermissionGroup[]
  isUpdateRoleOpen: boolean
  selectedRoleForUpdate: Role | null
  updateRoleName: string
  updateRolePermissions: PermissionGroup[]
  openCreateRole: () => void
  closeCreateRole: () => void
  openViewRole: (role: Role) => void
  closeViewRole: () => void
  setNewRoleName: (name: string) => void
  togglePermission: (groupId: string, permissionId: string) => void
  toggleSelectAll: (groupId: string) => void
  resetNewRole: () => void
  openUpdateRole: (role: Role) => void
  closeUpdateRole: () => void
  setUpdateRoleName: (name: string) => void
  toggleUpdatePermission: (groupId: string, permissionId: string) => void
  toggleUpdateSelectAll: (groupId: string) => void
  resetUpdateRole: () => void
}

const defaultPermissions: PermissionGroup[] = [
  {
    id: "event-creation",
    name: "Event creation",
    description: "Allow users to enter event info, create tickets, and customize order forms.",
    permissions: [
      { id: "edit-event-details", name: "Edit event details", description: "", checked: false },
      { id: "manage-event-status", name: "Manage event status", description: "", checked: false },
      { id: "create-events-card-only", name: "Create events with card on file only", description: "", checked: false },
      { id: "manage-card", name: "Manage card", description: "", checked: false },
      { id: "manage-subscription", name: "Manage subscription", description: "", checked: false },
      { id: "manage-card-subscriptions", name: "Manage card and subscriptions", description: "", checked: false },
      { id: "edit-seat-maps", name: "Edit seat maps", description: "", checked: false },
      { id: "manage-tickets", name: "Manage tickets", description: "", checked: false },
      { id: "view-ticket-holds", name: "View ticket holds", description: "", checked: false },
      { id: "manage-ticket-holds", name: "Manage ticket holds", description: "", checked: false },
    ],
  },
]

export const useModalStore = create<ModalState>((set, get) => ({
  isCreateRoleOpen: false,
  isViewRoleOpen: false,
  selectedRole: null,
  newRoleName: "",
  newRolePermissions: defaultPermissions,
  isUpdateRoleOpen: false,
  selectedRoleForUpdate: null,
  updateRoleName: "",
  updateRolePermissions: [],

  openCreateRole: () => set({ isCreateRoleOpen: true }),
  closeCreateRole: () => set({ isCreateRoleOpen: false }),

  openViewRole: (role: Role) => set({ isViewRoleOpen: true, selectedRole: role }),
  closeViewRole: () => set({ isViewRoleOpen: false, selectedRole: null }),

  setNewRoleName: (name: string) => set({ newRoleName: name }),

  togglePermission: (groupId: string, permissionId: string) => {
    const { newRolePermissions } = get()
    const updatedPermissions = newRolePermissions.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: group.permissions.map((permission) =>
            permission.id === permissionId ? { ...permission, checked: !permission.checked } : permission,
          ),
        }
      }
      return group
    })
    set({ newRolePermissions: updatedPermissions })
  },

  toggleSelectAll: (groupId: string) => {
    const { newRolePermissions } = get()
    const group = newRolePermissions.find((g) => g.id === groupId)
    if (!group) return

    const allChecked = group.permissions.every((p) => p.checked)
    const updatedPermissions = newRolePermissions.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          permissions: g.permissions.map((p) => ({ ...p, checked: !allChecked })),
        }
      }
      return g
    })
    set({ newRolePermissions: updatedPermissions })
  },

  resetNewRole: () =>
    set({
      newRoleName: "",
      newRolePermissions: defaultPermissions.map((group) => ({
        ...group,
        permissions: group.permissions.map((p) => ({ ...p, checked: false })),
      })),
    }),
  openUpdateRole: (role: Role) =>
    set({
      isUpdateRoleOpen: true,
      selectedRoleForUpdate: role,
      updateRoleName: role.name,
      updateRolePermissions: role.permissionGroups,
    }),
  closeUpdateRole: () => set({ isUpdateRoleOpen: false, selectedRoleForUpdate: null }),

  setUpdateRoleName: (name: string) => set({ updateRoleName: name }),

  toggleUpdatePermission: (groupId: string, permissionId: string) => {
    const { updateRolePermissions } = get()
    const updatedPermissions = updateRolePermissions.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: group.permissions.map((permission) =>
            permission.id === permissionId ? { ...permission, checked: !permission.checked } : permission,
          ),
        }
      }
      return group
    })
    set({ updateRolePermissions: updatedPermissions })
  },

  toggleUpdateSelectAll: (groupId: string) => {
    const { updateRolePermissions } = get()
    const group = updateRolePermissions.find((g) => g.id === groupId)
    if (!group) return

    const allChecked = group.permissions.every((p) => p.checked)
    const updatedPermissions = updateRolePermissions.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          permissions: g.permissions.map((p) => ({ ...p, checked: !allChecked })),
        }
      }
      return g
    })
    set({ updateRolePermissions: updatedPermissions })
  },

  resetUpdateRole: () =>
    set({
      updateRoleName: "",
      updateRolePermissions: [],
      selectedRoleForUpdate: null,
    }),
}))
