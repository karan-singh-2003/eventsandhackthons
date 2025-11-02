'use client'

import React from 'react'
import JoinRequestsTable from './JoinRequestsTable'
import { useParams } from 'next/navigation'
import type { JoinRequest } from './JoinRequestsTable'
import { usePermissions } from '@/hooks/usePermissions'
import PermissionError from '@/components/Global/PermissionError'

export default function JoinRequests() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>()
  const [requests, setRequests] = React.useState<JoinRequest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [roles, setRoles] = React.useState<string[]>([])

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/workspace/${workspaceSlug}/join-requests`,
          {
            cache: 'no-store',
          }
        )
        const json = await res.json()
        if (!cancelled && json?.status === 'success') {
          setRequests(json.requests ?? [])
        }

        const rolesRes = await fetch(
          `/api/roles?workspaceSlug=${workspaceSlug}&action=getAll`,
          { cache: 'no-store' }
        )
        const rolesJson: { data?: { id: string; name: string }[] } =
          await rolesRes.json()
        if (!cancelled && rolesJson) {
          const roleNames = Array.isArray(rolesJson.data)
            ? rolesJson.data
                .map((r) => r?.name)
                .filter((n): n is string => Boolean(n))
            : []
          setRoles(roleNames)
        }
      } catch {
        if (!cancelled) setRequests([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (workspaceSlug) load()
    return () => {
      cancelled = true
    }
  }, [workspaceSlug])

  const { can } = usePermissions(workspaceSlug as string)
  const hasManageJoinRequestsPermission = can(
    process.env.NEXT_PUBLIC_MANAGE_JOIN_REQUESTS_PERMISSION_ID ?? ''
  )

  // ✅ Correct JSX return
  return hasManageJoinRequestsPermission ? (
    <div className="bg-white rounded-lg">
      <div className="text-black font-semibold text-lg mb-4">
        Joining Requests {requests.length > 0 ? `(${requests.length})` : '(0)'}
      </div>
      <JoinRequestsTable
        requests={requests}
        isLoading={loading}
        roles={roles}
        workspaceSlug={String(workspaceSlug)}
      />
    </div>
  ) : (
    <PermissionError message="YPermission given" />
  )
}
