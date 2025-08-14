'use client'

import React from 'react'
import { Search, Download, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getBgColor, getTextColor } from '@/utils/generatecolor'
import { Badge } from '@/components/ui/badge'
import Spinner from '@/components/Global/Spinner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import InviteMembers from '@/components/Onboarding/InviteMembers'
import type { Member } from './index'
import { useQueryClient } from '@tanstack/react-query'
import { usePermissions } from '@/hooks/usePermissions'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

// Format a date-like value to "august 8 2025"
function formatDisplayDate(value?: string | number | Date | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return typeof value === 'string' ? value : '—'
  const formatted = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  // Remove comma and lowercase to match requested style
  return formatted.replace(',', '').toLowerCase()
}

// Note: Members data shape is provided by the parent via props

export default function MembersTable({
  members,
  loading = false,
  roles = [],
  workspaceSlug,
}: {
  members: Member[]
  loading?: boolean
  roles?: string[]
  workspaceSlug: string
}) {
  const [query, setQuery] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('All')
  const [statusFilter, setStatusFilter] = React.useState<string>('Active')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [activeMember, setActiveMember] = React.useState<Member | null>(null)
  const [open, setOpen] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const queryClient = useQueryClient()

  // Track whether the role has changed compared to the original sample data
  const originalRole = React.useMemo(() => {
    if (!activeMember) return null
    const original = members.find((m) => m.id === activeMember.id)
    return original?.role ?? null
  }, [activeMember, members])
  const isDirty = !!activeMember && activeMember.role !== originalRole

  const filtered = React.useMemo(() => {
    return members.filter((m) => {
      const matchesQuery = `${m.name} ${m.email}`
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesRole = roleFilter === 'All' || m.role === roleFilter
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [members, query, roleFilter, statusFilter])

  const allVisibleChecked =
    filtered.length > 0 && filtered.every((m) => selectedIds.includes(m.id))

  const toggleAllVisible = (checked: boolean) => {
    if (checked) {
      setSelectedIds(
        Array.from(new Set([...selectedIds, ...filtered.map((m) => m.id)]))
      )
      if (filtered.length > 0) {
        setActiveMember(filtered[0])
        setOpen(true)
      }
    } else {
      setSelectedIds(
        selectedIds.filter((id) => !filtered.some((m) => m.id === id))
      )
    }
  }

  const onRowClick = (m: Member) => {
    setActiveMember(m)
    setOpen(true)
  }

  async function handleDeleteInvite() {
    if (!activeMember) return
    try {
      setBusy(true)
      // For invited users, we likely only have their email. Revoke any pending email invites for this workspace
      await fetch('/api/invite/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeMember.email, workspaceSlug }),
      })
      // Optimistic UI: mark member as Deactivated or remove from list if status was Invited only in view model
      setActiveMember((prev) =>
        prev ? { ...prev, status: 'Deactivated' } : prev
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveMember() {
    if (!activeMember) return
    try {
      setBusy(true)
      await fetch(
        `/api/workspace/${workspaceSlug}/members?memberId=${activeMember.id}`,
        {
          method: 'DELETE',
        }
      )

      await queryClient.invalidateQueries({
        queryKey: ['members', workspaceSlug],
      })

      // Close and optimistically remove from selection
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveChanges() {
    if (!activeMember || !isDirty) return
    try {
      setBusy(true)
      await fetch(`/api/workspace/${workspaceSlug}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: activeMember.id,
          roleName: activeMember.role,
        }),
      })
      // Invalidate and refetch members queries (new and legacy keys)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['members', workspaceSlug] }),
        queryClient.invalidateQueries({ queryKey: ['MEMBERS'] }),
        queryClient.refetchQueries({ queryKey: ['members', workspaceSlug] }),
      ])
      // Close the sheet
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }
  // loading comes from props
  const { can } = usePermissions(workspaceSlug as string)

  const hasInvitePermission = can(
    `${process.env.NEXT_PUBLIC_INVITE_MEMBERS_PERMISSION_ID}`
  )
  const hasRemoveMembersPermission = can(
    `${process.env.NEXT_PUBLIC_REMOVE_MEMBERS_PERMISSION_ID}`
  )
  const canUpdateRole = can(
    `${process.env.NEXT_PUBLIC_MANAGE_ROLES_PERMISSION_ID}`
  )
  return (
    <div className=" w-full">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-2 flex-1 ">
          <div className="relative w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="pl-9 rounded-full placeholder:text-[15px] font-medium"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px] rounded-none font-medium">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] rounded-none font-medium">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Invited">Invited</SelectItem>
              <SelectItem value="Deactivated">Deactivated</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => {
              setQuery('')
              setRoleFilter('All')
              setStatusFilter('All')
            }}
            className="text-sm text-muted-foreground font-medium hover:text-foreground"
          >
            Clear filters
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full">
            <Download className="size-4 mr-2" /> Download CSV
          </Button>
          <Button
            className="rounded-full bg-neutral-700 hover:bg-neutral-800"
            onClick={() => setInviteOpen(true)}
            disabled={!hasInvitePermission}
          >
            Invite Members
          </Button>
        </div>
      </div>

      {(roleFilter !== 'All' || statusFilter !== 'All') && (
        <div className="flex flex-wrap items-center gap-5 mt-5">
          {roleFilter !== 'All' && (
            <Badge
              variant="secondary"
              className="gap-1 px-4 py-1 text-[13px] rounded-full"
            >
              <span>Role: {roleFilter}</span>
              <button
                type="button"
                onClick={() => setRoleFilter('All')}
                className=" inline-flex rounded-full hover:bg-muted "
                aria-label="Clear role filter"
              >
                <X className="size-3.5 mt-0.5" />
              </button>
            </Badge>
          )}

          {statusFilter !== 'All' && (
            <Badge
              variant="secondary"
              className="gap-1 px-4 py-1 text-[13px] rounded-full"
            >
              <span>Status: {statusFilter}</span>
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className=" inline-flex rounded-full hover:bg-muted "
                aria-label="Clear status filter"
              >
                <X className="size-3.5 mt-0.5" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={17} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allVisibleChecked}
                    onCheckedChange={(c) => toggleAllVisible(Boolean(c))}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email address</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="font-medium">
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center p-9 bg-gray-50">
                    No results found, please try another name, email address or
                    filter setting.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((m) => {
                const checked = selectedIds.includes(m.id)
                return (
                  <TableRow
                    key={m.id}
                    onClick={() => onRowClick(m)}
                    className="cursor-pointer"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) => {
                          const isChecked = Boolean(c)
                          setSelectedIds((prev) =>
                            isChecked
                              ? [...prev, m.id]
                              : prev.filter((id) => id !== m.id)
                          )
                          if (isChecked) {
                            setActiveMember(m)
                            setOpen(true)
                          }
                        }}
                        aria-label={`Select ${m.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback
                            className=" text-xs font-medium"
                            style={{
                              backgroundColor: getBgColor(m.name),
                              color: getTextColor(m.name),
                            }}
                          >
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-foreground text-[15px] font-medium">
                            {m.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {m.URN}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[15px]">{m.role}</TableCell>
                    <TableCell className="text-muted-foreground text-[15px]">
                      {m.email}
                    </TableCell>
                    <TableCell className="text-[15px]">
                      {formatDisplayDate(m.dateAdded)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          m.status === 'Active'
                            ? 'text-green-600'
                            : m.status === 'Invited'
                            ? 'text-amber-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {m.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[15px]">
                      {formatDisplayDate(m.lastActive)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Right sheet with member details */}
      <Sheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val)
          if (!val) {
            setSelectedIds([])
            setActiveMember(null)
          }
        }}
      >
        <SheetContent className="sm:max-w-md w-[380px]" side="right">
          {activeMember && (
            <div className="flex flex-col h-full">
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className="  text-base font-medium"
                      style={{
                        backgroundColor: getBgColor(activeMember.name),
                        color: getTextColor(activeMember.name),
                      }}
                    >
                      {getInitials(activeMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{activeMember.name}</SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                      {activeMember.URN}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-4 py-2 space-y-4">
                <div>
                  <div className="text-base font-medium mb-1">Role</div>
                  <Select
                    value={activeMember.role}
                    onValueChange={(val) =>
                      setActiveMember((prev) =>
                        prev ? { ...prev, role: val } : prev
                      )
                    }
                  >
                    <SelectTrigger className="w-full rounded-none font-medium text-muted-foreground">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="sm"
                  className={`w-full h-10 text-[15px] rounded-none ${
                    isDirty
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  disabled={!isDirty || busy || !canUpdateRole}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>

                <div className="flex flex-col gap-y-2 my-3">
                  <div className="flex justify-between">
                    <div className="text-base font-medium">Joined</div>
                    <div className="text-base text-muted-foreground">
                      {formatDisplayDate(activeMember.dateAdded)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-base font-medium">Status</div>
                    <div className="text-base text-muted-foreground lowercase">
                      {activeMember.status.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  {activeMember.status === 'Invited' ? (
                    <Button
                      variant="outline"
                      className="rounded-full h-10"
                      disabled={busy}
                      onClick={handleDeleteInvite}
                    >
                      Delete Invite Link
                    </Button>
                  ) : (
                    activeMember.role?.toLowerCase() !== 'owner' && (
                      <Button
                        variant="outline"
                        className="rounded-full h-10"
                        disabled={busy || !hasRemoveMembersPermission}
                        onClick={handleRemoveMember}
                      >
                        Remove Member
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-auto" />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Invite Members dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md  rounded-none">
          {/* <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Share an invite link or add members by email.
            </DialogDescription>
          </DialogHeader> */}
          <DialogTitle></DialogTitle>
          <InviteMembers></InviteMembers>
          {/* You can place your invite form or link UI here later */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
