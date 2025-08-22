"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import Navigation from "./WorkspaceNavigation"

// Context for mobile sidebar state
const MobileSidebarContext = createContext<{
  isOpen: boolean
  toggle: () => void
  close: () => void
} | null>(null)

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext)
  if (!context) {
    throw new Error("useMobileSidebar must be used within MobileSidebarProvider")
  }
  return context
}

export const MobileSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  return (
    <MobileSidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileSidebarContext.Provider>
  )
}

function Slider() {
  const { isOpen } = useMobileSidebar()

  return (
    <aside
      className={`
        bg-white border-r border-[#d4d4d4] p-1 flex flex-col items-center
        transition-all duration-300 ease-in-out

        /* Desktop */
        lg:relative lg:w-[47px] lg:h-full lg:translate-x-0

        /* Mobile (open/close inside page flow) */
        ${isOpen ? "w-[37px]" : "w-0 overflow-hidden hidden lg:block"}
        h-[calc(100vh-40px)]  /* below navbar */
      `}
    >
      <Navigation />
    </aside>
  )
}

export default Slider
