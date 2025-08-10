export type RoleResponse = {
  id: string
  name: string
  updatedAt: Date
  createdAt: Date
  permissions: {
    id: string
    name: string
    label: string
    categoryId: string
  }[]
  workspace: {
    id: string
    name: string
  }
  createdBy?: {
    id: string
    name: string | null
    email: string | null
  }
  updatedBy?: {
    id: string
    name: string | null
    email: string | null
  }
  _count: {
    permissions: number
    members: number
  }
}

export type PermissionResponse = {
  id: string
  name: string
  label: string
  categoryId: string
  category?: {
    id: string
    name: string
  }
}
