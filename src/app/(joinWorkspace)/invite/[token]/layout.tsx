'use client'
import React from 'react'
import { getAuthData, isAuthenticated, type AuthData } from '@/lib/auth-client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageLoader from '@/components/global/PageLoader'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      const data = await getAuthData()
      const authenticated = isAuthenticated()

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

      setLoading(false)
    }

    checkAuth()
  }, [router, token])

  const userUniversityId = authData?.userInfo?.universityId || 'Not logged in'

  if (loading || !authData || !authData.userInfo) {
    return <PageLoader title="Loading" />
  }

  return (
    <div>
      <div className="lg:w-[1300px] mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center">
            <Image
              src="/eventsLogo.svg"
              alt="eventsLogo"
              width={126}
              height={40}
              className="w-16 h-5 sm:w-20 sm:h-6 md:w-24 md:h-7"
              style={{
                filter: 'invert(1)',
                display: 'block',
              }}
            />
          </div>
          <div className="flex flex-col leading-tight text-right">
            <h1 className="text-[#3d3d3d] text-[13px] lg:text-[14px] font-medium">
              Logged in with University ID
            </h1>
            <h1 className="text-[#818181] text-[13px] lg:text-[14px] font-medium">
              {userUniversityId}
            </h1>
          </div>
        </div>
      </div>
      <div className="lg:w-[500px] w-full px-4 mx-auto">{children}</div>
    </div>
  )
}

export default Layout
