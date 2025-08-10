'use client';

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, User } from "lucide-react"
import { getUserInfo } from "@/lib/auth-client";// ✅ adjust path based on your structure
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileDropdownProps {
  onProfileClick?: () => void
  onSettingsClick?: () => void
  }

export default function ProfileDropdown({
  onProfileClick,
  onSettingsClick,
  
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{
    name: string
    email: string
    initials: string
    avatar?: string
  } | null>(null)

  useEffect(() => {
    const userInfo = getUserInfo()
    if (userInfo) {
      setUser({
        name: userInfo.name,
        email: userInfo.email,
        initials: userInfo.name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase(),
      })
    }
  }, [])
  const router = useRouter()

const handleLogout = async () => {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (!res.ok) throw new Error('Logout failed')

    toast.success('Logged out successfully')
    router.push('/sign-in') // 👈 or homepage `/`
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('Something went wrong')
  }
}

  if (!user) return null // optionally show skeleton loader here

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
       <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative
            h-[26px] w-[26px] /* Bigger for mobile */
            lg:h-8 lg:w-8 /* Same as code for desktop */
            rounded-full hover:bg-gray-100 focus:outline-none focus:ring-0"
        >
          <Avatar
            className="
            h-8 w-8 /* Bigger avatar for mobile */
            lg:h-8 lg:w-8 /* Same as code for desktop */
          "
          >
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white font-semibold lg:text-sm text-sm">{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="lg:w-60 lg:p-2 w-50 p-1" align="end" sideOffset={8}>
        {/* User Info Section */}
        <DropdownMenuLabel className="lg:p-3 p-2">
          <div className="flex items-center space-x-3">
            <Avatar className="lg:h-10 lg:w-10 h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-blue-500 text-white font-semibold lg:text-sm text-sm ">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="lg:text-sm text-sm font-medium leading-none">{user.name}</p>
              <p className="lg:text-xs text-[11px] text-muted-foreground leading-none">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem className="cursor-pointer p-3 focus:bg-gray-100" onClick={onProfileClick}>
          <User className="mr-3 lg:h-4 lg:w-4 h-4 w-4" />
          <span className="text-xs lg:text-sm">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer lg:p-3 p-4 focus:bg-gray-100" onClick={onSettingsClick}>
          <Settings className="mr-3 lg:h-4 lg:w-4 h-[30px] w[40px]" />
          <span className="text-xs lg:text-sm">Account settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer p-3 focus:bg-gray-100 text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 lg:h-4 lg:w-4 sm:w-6 sm:h-6" />
          <span className="text-xs lg:text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
