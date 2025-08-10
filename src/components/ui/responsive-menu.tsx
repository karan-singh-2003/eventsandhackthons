'use client'

import * as React from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { DialogTitle } from './dialog'

interface ResponsiveMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end' | 'center'
}

export function ResponsiveMenu({
  trigger,
  children,
  align = 'start',
}: ResponsiveMenuProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-70 bg-white border border-gray-200 shadow-lg "
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DialogTitle></DialogTitle>
      <DrawerContent className="">
        <div className="my-5 mx-3">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

interface ResponsiveMenuItemProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'destructive'
}

export function ResponsiveMenuItem({
  onClick,
  className = '',
  children,
  variant = 'default',
}: ResponsiveMenuItemProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const baseClasses =
    'flex items-center w-full text-left transition-colors duration-200'
  const desktopClasses =
    variant === 'destructive'
      ? 'rounded-none hover:bg-red-50 focus:bg-red-50 px-3  text-sm cursor-pointer'
      : 'rounded-none hover:bg-gray-50 focus:bg-gray-50 px-3  text-sm cursor-pointer'
  const mobileClasses =
    variant === 'destructive'
      ? 'hover:bg-red-50 py-2 focus:bg-red-50 px-4  text-[15px] cursor-pointer rounded-none'
      : 'hover:bg-gray-50 focus:bg-gray-50 px-4 text-base cursor-pointer rounded-none'

  if (isDesktop) {
    return (
      <DropdownMenuItem
        onClick={onClick}
        className={`${baseClasses} ${desktopClasses} ${className}`}
      >
        {children}
      </DropdownMenuItem>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${mobileClasses} ${className}`}
    >
      {children}
    </button>
  )
}
