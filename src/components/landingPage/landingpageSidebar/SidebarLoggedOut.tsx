'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

interface SidebarLoggedOutProps {
  onClose: () => void
}

const SidebarLoggedOut = ({ onClose }: SidebarLoggedOutProps) => {
  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex-1 p-4">
        <p className="text-gray-600">
          Sign in to manage events and explore more features.
        </p>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => {
            window.location.href = '/sign-in'
            onClose()
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}

export default SidebarLoggedOut
