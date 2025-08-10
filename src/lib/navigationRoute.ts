// lib/navigation-routes.ts (✅ REMOVE 'use client')

export interface NavigationRoute {
  label: string
  href: string
  icon: string
  activeIcon: string
}

export function getRoutes(workspaceSlug: string): NavigationRoute[] {
  return [
    {
      label: "Home",
      href: "/",
      icon: "/home.svg",
      activeIcon: "/home.svg",
    },
    {
      label: "Settings",
      href: `/workspace/${workspaceSlug}/workspacesetting`,
      icon: "/setting1.svg",
      activeIcon: "/setting1.svg",
    },
    {
      label: "Notification",
      href: `/workspace/${workspaceSlug}/notification`,
      icon: "/notification.svg",
      activeIcon: "/notification.svg",
    },
    {
      label: "Members",
      href: "/members", // Add dynamic slug if needed
      icon: "/members.svg",
      activeIcon: "/members.svg",
    },
    {
      label: "Invite Peoples",
      href: `/workspace/${workspaceSlug}/invitemembers`,
      icon: "/setting1.svg",
      activeIcon: "/setting1.svg",
    },
  ]
}
