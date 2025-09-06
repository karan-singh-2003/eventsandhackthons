import type React from "react"
import { TeamMemberIcon, EditEventIcon, ActiveLogIcon } from "@/components/icons/EventNavigationIcon"

export interface NavigationRoute {
  href?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon: React.ComponentType<{ className?: string }>
  action?: "navigate" | "dialog" | "function"
  onClick?: () => void
}

export function getEventRoutes(workspaceSlug: string, eventSlug: string): NavigationRoute[] {
  return [
    {
      label: "Team Member",
      href: `/workspace/${workspaceSlug}/event/${eventSlug}/team`,
      icon: TeamMemberIcon,
      activeIcon: TeamMemberIcon,
      action: "navigate",
    },
    {
      label: "Edit Event",
      href: `/workspace/${workspaceSlug}/event/${eventSlug}/edit`,
      icon: EditEventIcon,
      activeIcon: EditEventIcon,
      action: "navigate",
    },
    {
      label: "Active Log",
      href: `/workspace/${workspaceSlug}/event/${eventSlug}/log`,
      icon: ActiveLogIcon,
      activeIcon: ActiveLogIcon,
      action: "navigate",
    },
  ]
}
