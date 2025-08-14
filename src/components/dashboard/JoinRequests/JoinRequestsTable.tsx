'use client'

import React from 'react'
import { X, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Spinner from '@/components/Global/Spinner'
import { promise } from 'zod'
import { QueryClient } from '@tanstack/react-query'

export type JoinRequest = {
  id: string
  name: string
  email: string
  role: string
  requestedAt: string
  URN: string
  note?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

// Format a date-like value to "august 8 2025" to match Members table style
function formatDisplayDate(value?: string | number | Date | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return typeof value === 'string' ? value : '—'
  const formatted = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return formatted.replace(',', '').toLowerCase()
}

type JoinRequestsTableProps = {
  requests: JoinRequest[]
  isLoading?: boolean
  roles?: string[]
  workspaceSlug?: string
}

export default function JoinRequestsTable({
  requests,
  isLoading = false,
  roles = [],
  workspaceSlug,
}: JoinRequestsTableProps) {
  const queryClient = new QueryClient()
  const [query, setQuery] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('All')
  const [localRequests, setLocalRequests] =
    React.useState<JoinRequest[]>(requests)

  React.useEffect(() => {
    setLocalRequests(requests)
  }, [requests])

  const filtered = React.useMemo(() => {
    return localRequests.filter((r) => {
      const matchesQuery = `${r.name} ${r.email}`
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesRole = roleFilter === 'All' || r.role === roleFilter

      return matchesQuery && matchesRole
    })
  }, [localRequests, query, roleFilter])

  const handleApprove = async (id: string) => {
    try {
      setLocalRequests((prev) => prev.filter((r) => r.id !== id)) // optimistic
      await fetch(`/api/workspace/${workspaceSlug}/join-requests/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      })
      await queryClient.invalidateQueries({
        queryKey: ['members', workspaceSlug],
      })
    } catch {
      // optional: revert on error
    }
  }

  const handleReject = async (id: string) => {
    try {
      setLocalRequests((prev) => prev.filter((r) => r.id !== id)) // optimistic
      await fetch(`/api/workspace/${workspaceSlug}/join-requests/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      })
    } catch {
      // optional: revert on error
    }
  }

  return (
    <div className="w-full ">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="pl-9 rounded-full placeholder:text-[15px]"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px] rounded-none">
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

          <button
            onClick={() => {
              setQuery('')
              setRoleFilter('All')
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Active filter badges */}
      {(roleFilter !== 'All' || query) && (
        <div className=" flex flex-wrap items-center gap-2 mt-4  text-[15px]">
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
        </div>
      )}

      {/* Table / Loading */}

      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={17} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-9 bg-gray-50">
                    No Joining requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-neutral-200 text-neutral-700 text-xs font-medium">
                            {getInitials(r.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-foreground text-[15px] font-medium">
                            {r.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {r.URN}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[15px]">{r.role}</TableCell>
                    <TableCell className="text-muted-foreground text-[15px]">
                      {r.email}
                    </TableCell>
                    <TableCell className="text-[15px]">
                      {formatDisplayDate(r.requestedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full text-sm px-3"
                          onClick={() => handleReject(r.id)}
                        >
                          {/* <X className="size-4 mr-1" /> */}
                          <span>Reject</span>
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-blue-700 text-sm hover:bg-blue-800"
                          onClick={() => handleApprove(r.id)}
                        >
                          {/* <Check className="size-4 mr-1" /> */}
                          <span>Approve</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
