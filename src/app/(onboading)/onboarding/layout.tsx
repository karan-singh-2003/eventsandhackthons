'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryData } from '@/hooks/useQueryData'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import axios from 'axios'
import Image from 'next/image'
import { getAuthData } from '@/lib/auth-client'
import PageLoader from '@/components/global//PageLoader'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [universityId, setUniversityId] = useState<string>('')

  // Check user's workspace status
  const {
    data: response,
    isPending: isLoading,
    error,
  } = useQueryData(
    ['onboarding-check'],
    () => axios.get('/api/user/manage-events-config'),
    true // Always run this check
  )

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isLoading) return // Still loading

      if (error) {
        // If there's an error (like user not authenticated), redirect to sign-in
        router.replace('/sign-in')
        return
      }

      if (response?.data) {
        const { workspaces, userRole } = response.data

        // If user has workspaces, redirect them away from onboarding
        if (workspaces && workspaces.length > 0) {
          // User already has workspaces, redirect to their primary workspace
          const primaryWorkspace = workspaces[0]
          router.replace(`/workspace/${primaryWorkspace.slug}`)
          return
        }

        // If user is not admin and has no workspaces, they shouldn't be here
        if (userRole !== 'admin') {
          router.replace('/') // Redirect to landing page
          return
        }

        // find user's university ID or name from cookie
        try {
          const { userInfo } = await getAuthData()
          console.log('User Info in Layout.tsx in onboarding:', userInfo)
          setUniversityId(userInfo?.universityId || userInfo?.name || '')
        } catch (error) {
          console.error('Error fetching user data:', error)
        }

        // If we reach here, user is admin with no workspaces - allow onboarding
        setIsChecking(false)
      }
    }

    checkUserStatus()
  }, [response, isLoading, error, router])

  // Show loading state while checking
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <PageLoader title="Loading" />
      </div>
    )
  }

  // If we reach here, user is allowed to see onboarding
  return (
    <WorkspaceProvider>
      <div>
        <div className="lg:w-[1300px] mx-auto px-4 py-4 ">
          <div className="flex justify-between">
            <div className="flex items-center justify-center">
              {/* Use the SVG with proper styling to make it visible */}
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
            <div className="flex flex-col leading-tight">
              <div>
                <h1 className="text-[#3d3d3d] text-[13px] lg:text-[14px] font-medium">
                  Logged in with University ID
                </h1>
              </div>
              <div>
                <h1 className="text-[#818181] text-[13px] lg:text-[14px] font-medium">
                  {universityId || 'Your University ID'}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[500px] w-full px-4 mx-auto ">{children}</div>
      </div>
    </WorkspaceProvider>
  )
}
