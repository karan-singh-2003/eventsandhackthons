'use client'
import React from 'react'
import { motion } from 'framer-motion'
import SidebarLoggedIn from './landingpageSidebar/SidebarLoggedIn'
import SidebarLoggedOut from './landingpageSidebar/SidebarLoggedOut'

interface SidebarProps {
  userName: string | null
  URN: string | null
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ userName, URN, isOpen, onClose }: SidebarProps) => {
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

      {/* Sidebar Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{ duration: 0.3, ease: [0.3, 0.0, 0.2, 1] }}
        className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-[#f3f3f3]">
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-lg">
              Hey {userName ? userName : 'Guest'}!
            </h3>
            {URN && <p className="text-sm text-black/60">{URN}</p>}
          </div>
        </div>

        {/* Conditional Render */}
        {userName ? (
          <SidebarLoggedIn userName={userName} onClose={onClose} />
        ) : (
          <SidebarLoggedOut onClose={onClose} />
        )}
      </motion.div>
    </>
  )
}

export default Sidebar
