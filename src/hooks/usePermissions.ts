import * as React from 'react'
import { useQueryData } from '@/hooks/useQueryData'
import axios from 'axios'
import { permission } from 'process'

export type PermissionsResponse = {
  status: 'success' | 'error'
  permissions?: string[]
  message?: string
}

export function usePermissions(workspaceSlug?: string) {
  const { data, isPending } = useQueryData<PermissionsResponse>(
    ['permissions', workspaceSlug],
    async () => {
      if (!workspaceSlug) return { status: 'error', permissions: [] }
      const res = await axios.get(
        `/api/workspace/${workspaceSlug}/me/permissions`
      )
      console.log('Permissions response:', res)
      const json = res.data as PermissionsResponse
      console.log('Permissions data:', json)
      if (json.status === 'error') {
        return { status: 'error', permissions: [] }
      }
      return json
    },
    Boolean(workspaceSlug)
  )

  const set = React.useMemo(
    () => new Set<string>(data?.permissions ?? []),
    [data?.permissions]
  )
  console.log('Permissions set:', set)

  const can = React.useCallback(
    (permissionId: string) => set.has(permissionId),
    [set]
  )

  return { can, all: set, isPending }
}
