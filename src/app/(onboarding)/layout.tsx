'use client'

import React from 'react'
import PageLoader from '@/components/Global/PageLoader'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  getAuthData,
  isAuthenticated,
  isAdmin,
  type AuthData,
} from '@/lib/auth-client'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const [loading, setLoading] = useState(true)
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string | undefined

  useEffect(() => {
    const checkAuth = () => {
      const data = getAuthData()
      const authenticated = isAuthenticated()
      const userIsAdmin = isAdmin()

      setAuthData(data)

      if (!authenticated) {
        console.log('No authentication found, redirecting to sign-in.')
        if (token) {
          localStorage.setItem('pending_invite_token', token)
          router.replace(`/sign-in?redirect=/invite/${token}`)
        } else {
          router.replace('/sign-in')
        }
        return
      }

      if (!userIsAdmin) {
        console.log('User is not an admin, redirecting to home.')
        router.replace('/')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [token, router])

  const universityId = authData?.userInfo?.universityId || 'Not logged in'

  if (loading || !authData || !authData.userInfo) {
    return <PageLoader title="Loading" />
  }

  return (
    <div>
      <div className="lg:w-[1300px] mx-auto px-3 py-4 ">
        <div className="flex justify-between">
          <div className="flex items-center justify-center">
            {/* Use the SVG with proper styling to make it visible */}
            <Image
              src="/eventsLogo.svg"
              alt="eventsLogo"
              height={40}
              width={126}
              className="w-20 h-6 sm:w-22 sm:h-6 lg:w-24 lg:h-7"
              style={{
                filter: 'invert(1)', // This will make white SVG appear black
                display: 'block',
              }}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div>
              <h1 className="text-[#3d3d3d] text-[13px] lg:text-[14px] font-medium">
                University Id
              </h1>
            </div>
            <div>
              <h1 className="text-[#818181] text-[13px] lg:text-[14px] font-medium">
                {universityId}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[500px] w-full px-4 mx-auto ">{children}</div>
    </div>
  )
}

export default Layout
