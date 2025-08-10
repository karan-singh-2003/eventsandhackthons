"use client"

import { useState } from "react"
import { Search, Eye, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useModalStore } from "@/store/modal-slice"
import { CreateRoleModal } from "./modal/CreateRoleModal"
import { ViewRoleModal } from "./modal/ViewRoleModal"
import { UpdateRoleModal } from "./modal/UpdateRoleModal"

interface Role {
  id: string
  name: string
  description: string
  permissionGroups: Array<{
    id: string
    name: string
    description: string
    permissions: Array<{
      id: string
      name: string
      description: string
      checked: boolean
    }>
  }>
}

const roles: Role[] = [
  {
    id: "1",
    name: "Owner",
    description: "Primary owner of the organization",
    permissionGroups: [
      {
        id: "event-creation",
        name: "Event creation",
        description: "Allow users to enter event info, create tickets, and customize order forms.",
        permissions: [
          { id: "edit-event-details", name: "Edit event details", description: "", checked: true },
          { id: "manage-event-status", name: "Manage event status", description: "", checked: true },
          {
            id: "create-events-card-only",
            name: "Create events with card on file only",
            description: "",
            checked: true,
          },
          { id: "manage-card", name: "Manage card", description: "", checked: true },
          { id: "manage-subscription", name: "Manage subscription", description: "", checked: true },
          { id: "manage-card-subscriptions", name: "Manage card and subscriptions", description: "", checked: true },
          { id: "edit-seat-maps", name: "Edit seat maps", description: "", checked: true },
          { id: "manage-tickets", name: "Manage tickets", description: "", checked: true },
          { id: "view-ticket-holds", name: "View ticket holds", description: "", checked: true },
          { id: "manage-ticket-holds", name: "Manage ticket holds", description: "", checked: true },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access with limited permissions",
    permissionGroups: [
      {
        id: "event-creation",
        name: "Event creation",
        description: "Allow users to enter event info, create tickets, and customize order forms.",
        permissions: [
          { id: "edit-event-details", name: "Edit event details", description: "", checked: true },
          { id: "manage-event-status", name: "Manage event status", description: "", checked: true },
          {
            id: "create-events-card-only",
            name: "Create events with card on file only",
            description: "",
            checked: false,
          },
          { id: "manage-card", name: "Manage card", description: "", checked: false },
          { id: "manage-subscription", name: "Manage subscription", description: "", checked: false },
          { id: "manage-card-subscriptions", name: "Manage card and subscriptions", description: "", checked: false },
          { id: "edit-seat-maps", name: "Edit seat maps", description: "", checked: true },
          { id: "manage-tickets", name: "Manage tickets", description: "", checked: true },
          { id: "view-ticket-holds", name: "View ticket holds", description: "", checked: true },
          { id: "manage-ticket-holds", name: "Manage ticket holds", description: "", checked: false },
        ],
      },
    ],
  },
]

export default function RoleManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const { openCreateRole, openViewRole, openUpdateRole } = useModalStore()

  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleViewRole = (role: Role) => {
    openViewRole(role)
  }

  const handleDeleteRole = (roleId: string) => {
    // Handle delete role logic here
    console.log("Delete role:", roleId)
  }

  const handleUpdateRole = (role: Role) => {
    openUpdateRole(role)
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
        {/* Header with search and create role button */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Enter text to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={openCreateRole} className="bg-orange-600 hover:bg-orange-700 text-white">
            Create new role
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-slate-800 text-white">{getInitials(role.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="font-medium">{role.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRole(role)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(role)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-6">
          {filteredRoles.map((role) => (
            <div key={role.id} className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-800 text-white">{getInitials(role.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="font-medium truncate">{role.name}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewRole(role)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateRole(role)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No roles found matching your search.</div>
        )}
      </div>

      {/* Modals */}
      <CreateRoleModal />
      <ViewRoleModal />
      <UpdateRoleModal />
    </>
  )
}
