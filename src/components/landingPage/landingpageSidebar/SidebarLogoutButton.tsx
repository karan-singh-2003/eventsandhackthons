'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

const SidebarLogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      localStorage.clear()
      sessionStorage.clear()
      window.location.replace('/sign-in')
    } catch {
      window.location.replace('/sign-in')
    }
  }

  return (
    <button
      className="w-full bg-transparent border-[#d1410c] p-1 hover:bg-[#d1410c] hover:text-white border-1 hover:cursor-pointer text-[#d1410c]"
      onClick={handleLogout}
    >
      Log out
    </button>
  )
}

export default SidebarLogoutButton
