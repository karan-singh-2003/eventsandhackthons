'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAuthData } from '@/lib/auth-client'
import Image from 'next/image'
import Sidebar from '@/components/landingPage/Sidebar'
import ClientOnly from '@/components/global/ClientOnly'
import { Input } from '@/components/ui/input'

const Navbar = () => {
  const [hydrated, setHydrated] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name?: string; universityId?: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Hydration fix for Next.js
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch user info after hydration
  useEffect(() => {
    if (!hydrated) return
    try {
      const authData = getAuthData()
      setUserInfo(authData.userInfo)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserInfo(null)
    }

    const pendingInviteToken = localStorage.getItem('pending_invite_token')
    if (pendingInviteToken) {
      window.location.href = `/invite/${pendingInviteToken}`
    }
  }, [hydrated])

  const Name = userInfo?.name

  if (!hydrated) {
    return (
      <div className="h-[64px] w-full flex items-center justify-center bg-gray-100">
        <div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
    )
  }

  return (
    <>
      {/* 🔹 Sticky Navbar */}
      <nav
        className={` top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 border-b border-border shadow-md backdrop-blur-lg'
            : 'bg-background/70 border-b border-border/40 backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          {/* 🔸 Left: Logo + Search */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/eventsLogo.svg"
                alt="eventsLogo"
                width={120}
                height={36}
                className="w-20 sm:w-24 md:w-28"
                style={{ filter: 'invert(1)' }}
              />
            </a>

            {/* Search bar */}
            <div className="hidden sm:flex items-center w-[160px] md:w-[300px] lg:w-[480px] xl:w-[600px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-9 text-sm bg-muted/50 border-border/50"
                />
              </div>
            </div>
          </div>

          {/* 🔸 Right: Buttons */}
          <div className="flex items-center gap-4">
            <ClientOnly
              fallback={
                <div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>
              }
            >
              {!Name ? (
                <Button
                  className="bg-orange-600 rounded-full px-5 py-2 text-sm hover:bg-orange-700 hidden sm:flex"
                  onClick={() => (window.location.href = '/sign-in')}
                >
                  Get Started
                </Button>
              ) : (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2 text-[16px] font-medium px-3 py-2 rounded-full hover:bg-muted transition"
                >
                  {/* Person Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#6f6f6f"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    height={22}
                    width={22}
                  >
                    <path d="M11 6a3 3 0 1 1 -6 0 3 3 0 0 1 6 0" strokeWidth={1} />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8 -7a7 7 0 0 0 -5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      strokeWidth={1}
                    />
                  </svg>
                  Hi, {Name.replace(/ .*/, '')}
                </button>
              )}
            </ClientOnly>
          </div>
        </div>
      </nav>

      {/* 🔹 Sidebar */}
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

export default Navbar
