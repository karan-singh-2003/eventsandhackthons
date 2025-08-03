'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getUserInfo } from '@/lib/auth-client'

export default function useRedirectToLastActiveWorkspace() {
  const router = useRouter()
  const user = getUserInfo()

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!user) return(
        router.push('/sign-in')
      )

      try {
        const res = await axios.get('/api/workspace/lastActiveworkspace')
        const workspace = res.data?.data

        if (workspace?.slug) {
          router.push(`/workspace/${workspace.slug}`)
        } else {
          if (user.isAdmin) {
            router.push('/create-workspace')
          } else {
            router.push('/getmembership')
          }
        }
      } catch (error) {
        console.error('Redirect error:', error)
        router.push('/')
      }
    }

    fetchAndRedirect()
  }, [user, router])
} 