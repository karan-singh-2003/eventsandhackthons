import React, { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

interface ResponsiveMenuOrDrawerProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

function useIsMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
}

const ResponsiveMenuOrDrawer: React.FC<ResponsiveMenuOrDrawerProps> = ({
  trigger,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const isMobile =
    typeof window !== 'undefined' ? window.innerWidth < 640 : false

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

      <DropdownMenuContent
        side="bottom"
        className="min-w-[280px] border-[1px] mx-4 border-black/20"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ResponsiveMenuOrDrawer
