"use client"

import type React from "react"
import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/useMobile"

interface ResponsiveMenuOrDrawerProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

const ResponsiveMenuOrDrawer = ({ trigger, children }: ResponsiveMenuOrDrawerProps) => {
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          <div className="mx-4 -mt-4">{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="min-w-[280px] border-[1px] mx-4 border-black/20" align="start">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ResponsiveMenuOrDrawer
