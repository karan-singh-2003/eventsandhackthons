"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface MobileSidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const MobileSidebarContext = createContext<MobileSidebarContextType | undefined>(undefined)

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  return <MobileSidebarContext.Provider value={{ isOpen, toggle, close }}>{children}</MobileSidebarContext.Provider>
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext)
  if (context === undefined) {
    throw new Error("useMobileSidebar must be used within a MobileSidebarProvider")
  }
  return context
}
