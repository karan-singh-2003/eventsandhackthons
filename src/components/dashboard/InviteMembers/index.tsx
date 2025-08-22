'use client'

import React from 'react'
import MembersTable from './MembersTable'
import { useParams } from 'next/navigation'
import { useQueryData } from '@/hooks/useQueryData'
import axios from 'axios'
import { usePermissions } from '@/hooks/usePermissions'
import PageLoader from '@/components/global/PageLoader'
import PermissionError from '@/components/Global/PermissionError'

export type Member = {
  id: string
  name: string
  role: string
  email: string
  URN: string
  dateAdded: string
  status: 'Active' | 'Invited' | 'Deactivated'
  lastActive: string
}

export default function InviteMembersDemo() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>()

  // Members query
  const membersQuery = useQueryData(
    ['members', workspaceSlug],
    async () => {
      const res = await axios.get(`/api/workspace/${workspaceSlug}/members`)
      return res.data // unwrap axios .data
    },
    Boolean(workspaceSlug)
  )

  // Roles query
  const rolesQuery = useQueryData(
    ['roles', workspaceSlug],
    async () => {
      const res = await axios.get(`/api/roles`, {
        params: { workspaceSlug, action: 'getAll' },
      })
      return res.data // unwrap axios .data
    },
    Boolean(workspaceSlug)
  )

  const members: Member[] =
    membersQuery.data?.status === 'success'
      ? membersQuery.data.members ?? []
      : []

  const roles: string[] = Array.isArray(rolesQuery.data?.data)
    ? rolesQuery.data.data.map((r: { name: string }) => r.name).filter(Boolean)
    : []

  const loading =
    membersQuery.isPending ||
    rolesQuery.isPending ||
    membersQuery.isFetching ||
    rolesQuery.isFetching

  const count = members.length

  // Permissions
  const { can, isPending: permsPending } = usePermissions(
    workspaceSlug as string
  )

  if (loading || permsPending) {
    return <PageLoader title="Loading" />
  }

  console.log('Members:', members)
  console.log(
    'can view members',
    `can(${process.env.NEXT_PUBLIC_VIEW_MEMBERS_PERMISSION_ID})`
  )

  if (!can(`${process.env.NEXT_PUBLIC_VIEW_MEMBERS_PERMISSION_ID}`)) {
    return (
      <PermissionError message="You do not have permission to view members." />
    )
  }

  return (
    <div className="bg-white rounded-lg px-2">
      <div className="text-black font-semibold lg:text-lg text-[12px] mb-4">
        Members ({count})
      </div>
      <MembersTable
        members={members}
        loading={loading}
        roles={roles}
        workspaceSlug={String(workspaceSlug)}
      />
    </div>
  )
}
