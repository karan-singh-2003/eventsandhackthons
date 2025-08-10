import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useQueryData } from '@/hooks/useQueryData'

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { getBgColor, getTextColor } from '@/utils/generateColor'

interface SidebarProps {
  userName: string | null
  URN: string | null
  isOpen: boolean
  onClose: () => void
}

interface ManageEventsConfig {
  show: boolean
  label: string
  redirectTo: string
  reason: string
}

const Sidebar = ({ userName, isOpen, onClose, URN }: SidebarProps) => {
  const [manageEventsConfig, setManageEventsConfig] =
    useState<ManageEventsConfig>({
      show: false,
      label: '',
      redirectTo: '',
      reason: '',
    })

  // Use your custom hook to fetch manage events config
  const {
    data: response,
    isPending: isLoading,
    error,
  } = useQueryData(
    ['manageEventsConfig', userName], // Include userName in key to refetch when user changes
    () => axios.get('/api/user/manage-events-config'),
    !!userName && isOpen // Only run query when user exists and sidebar is open
  )

  // Update manage events config when data changes
  useEffect(() => {
    if (response?.data) {
      console.log('manage events redirect in sidebar:', response.data)
      if (response.status === 200) {
        setManageEventsConfig(response.data.manageEvents)
      } else {
        console.error('Failed to fetch manage events config')
        setManageEventsConfig({
          show: false,
          label: '',
          redirectTo: '',
          reason: 'error',
        })
      }
    }
  }, [response])

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching manage events config:', error)
      setManageEventsConfig({
        show: false,
        label: '',
        redirectTo: '',
        reason: 'error',
      })
    }
  }, [error])

  const handleManageEventsClick = () => {
    if (manageEventsConfig.redirectTo) {
      window.location.href = manageEventsConfig.redirectTo
      onClose()
    }
  }
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Clear any client-side storage
        localStorage.clear()
        sessionStorage.clear()

        // Force reload and redirect
        window.location.replace('/sign-in')
      } else {
        console.error('Logout failed:', await response.text())
        // Still redirect even if API fails
        window.location.replace('/sign-in')
      }
    } catch (error) {
      console.error('Error logging out:', error)
      // Still redirect even if there's an error
      window.location.replace('/sign-in')
    }
  }

  // const getUserInitials = (name: string | null) => {
  //   if (!name) return 'G'
  //   return name.charAt(0).toUpperCase()
  // }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{
          duration: 0.3,
          ease: [0.3, 0.0, 0.2, 1],
        }}
        className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-[#f3f3f3]">
          <div className="flex items-center gap-3">
            {/* <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback
                className="font-semibold text-[18px]"
                style={{
                  backgroundColor: userName ? getBgColor(userName) : '#FF6CAC',
                  color: userName ? getTextColor(userName) : '#A10046',
                }}
              >
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar> */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Hey {userName ? userName : 'Guest'}!
              </h3>
              {URN && <p className="text-sm text-black/60">{URN}</p>}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {userName && (
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-none"></div>
              ) : manageEventsConfig.show ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-auto  hover:bg-gray-50"
                  onClick={handleManageEventsClick}
                >
                  <span className="font-medium text-gray-900">
                    Manage Events
                  </span>
                </Button>
              ) : null}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t  border-gray-100">
          {userName ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Log out
            </Button>
          ) : (
            <Button
              className="w-full rounded-none bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                window.location.href = '/sign-in'
                onClose()
              }}
            >
              Get Started
            </Button>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
