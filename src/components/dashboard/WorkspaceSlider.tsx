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

  return <MobileSidebarContext.Provider value={{ isOpen, toggle, close }}>{children}</MobileSidebarContext.Provider>
}

function Slider() {
  const { isOpen, close } = useMobileSidebar()

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-[47px] lg:top-[49px] left-0 right-0 bottom-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        h-full bg-white border-r border-[#d4d4d4] p-1 w-[47px] flex flex-col items-center
        lg:relative lg:translate-x-0 lg:z-auto
        fixed top-[47px] lg:top-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        h-[calc(100vh-47px)] lg:h-full
      `}
      >
        <Navigation />
      </aside>
    </>
  )
}

export default Slider
