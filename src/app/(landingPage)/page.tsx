'use client'

import React, { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAuthData } from '@/lib/auth-client'
import Image from 'next/image'
import Sidebar from '@/components/landingPage/Sidebar'
import ClientOnly from '@/components/global/ClientOnly'

const LandingPage = () => {
  const [userInfo, setUserInfo] = useState<{
    name?: string
    universityId?: string
  } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fetch user data on client side to prevent hydration errors
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = getAuthData()
        setUserInfo(authData.userInfo)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUserInfo(null)
      }
    }

    fetchUserData()

    // fetch pending invite token in local storage if there redirect to invite/[token] page.tsx

    const pendingInviteToken = localStorage.getItem('pending_invite_token')
    if (pendingInviteToken) {
      window.location.href = `/invite/${pendingInviteToken}`
    }
  }, [])

  const Name = userInfo?.name

  return (
    <>
      <div className="relative flex  items-center   w-[1200px] mx-auto ">
        {/* 🔹 Navbar Container */}
        <div className="flex items-center justify-between w-full px-6 py-4">
          <div className="flex items-center flex-1">
            <Image
              src="/eventsLogo.svg"
              alt="eventsLogo"
              width={126}
              height={36}
              className="w-16 h-3 sm:w-20 sm:h-6 md:w-24 md:h-5.5"
              style={{
                filter: 'invert(1)',
                display: 'block',
              }}
            />
            <div className="flex items-center bg-[#F5F5F5] rounded-full px-4 ml-6 w-full max-w-[600px] h-9">
              <Search className="text-[#929292] w-4 h-4 mr-4" />
              <input
                type="text"
                className="bg-transparent placeholder:text-[#929292] text-sm text-[#929292] outline-none w-full"
                placeholder="Search for events and hackathons"
              />
            </div>
          </div>
        </div>

        {/* 🔹 Right Side - Buttons & Menu */}
        <div className="flex items-center space-x-4">
          <ClientOnly
            fallback={
              <div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>
            }
          >
            {!Name ? (
              <Button
                className="bg-orange-600 rounded-full   px-8 hover:bg-orange-700"
                onClick={() => {
                  window.location.href = '/sign-in'
                }}
              >
                Get Started
              </Button>
            ) : (
              <span className="text-[15px]  px-4 py-2 rounded-full font-medium whitespace-nowrap">
                Hi, {Name.replace(/ .*/, '')}
              </span>
            )}
          </ClientOnly>

          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Sidebar Component - Only render on client to prevent hydration issues */}
      <ClientOnly>
        <Sidebar
          userName={userInfo?.name || null}
          URN={userInfo?.universityId || null}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </ClientOnly>
    </>
  )
}

export default LandingPage
