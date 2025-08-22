import { HomeIcon, SettingsIcon, NotificationIcon, MembersIcon, CalendarIcon } from "@/components/icons/NavigationIcons"
import type React from "react"

export interface NavigationRoute {
  href?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon: React.ComponentType<{ className?: string }>
  action?: "navigate" | "dialog" | "function"
  onClick?: () => void
}

export function getRoutes(workspaceSlug: string): NavigationRoute[] {
  return [
    {
      label: "Home",
      href: "/",
      icon: HomeIcon,
      activeIcon: HomeIcon,
      action: "navigate",
    },
    {
      label: "Settings",
      href: `/workspace/${workspaceSlug}/workspacesetting`,
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
      action: "navigate",
    },
    {
      label: "Notification",
      href: `/workspace/${workspaceSlug}/notification`,
      icon: NotificationIcon,
      activeIcon: NotificationIcon,
      action: "navigate",
    },
    {
      label: "Members",
      href: "/members",
      icon: MembersIcon,
      activeIcon: MembersIcon,
      action: "navigate",
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      activeIcon: CalendarIcon,
      action: "navigate",
    },
  ]
}
