// // components/navigation.tsx
// "use client"
// import Image from "next/image"
// import { useParams, usePathname, useRouter } from "next/navigation"
// import { Separator } from "@/components/ui/separator"
// import { cn } from "@/lib/utils"
// import * as Tooltip from "@radix-ui/react-tooltip" // Ensure Tooltip is imported correctly

// import { routes , type  NavigationRoute } from "@/lib/navigationRoute"

// function Navigation() {
//   const { workspaceSlug } = useParams()
//   const pathname = usePathname()
//   const router = useRouter()

//   // Function to handle navigation using router.push
//   const handleNavigation = (item: NavigationRoute) => {
//     let fullHref = item.href
//     // Replace dynamic segment if workspaceSlug is available
//     if (item.href.includes("[workspaceSlug]") && workspaceSlug) {
//       fullHref = item.href.replace("[workspaceSlug]", workspaceSlug as string)
//     }

//     // Future: Add conditional logic for specific buttons, e.g., "Invite Peoples"
//     if (item.label === "Invite Peoples") {
//       // This is where you would open a dialog box instead of navigating
//       console.log("Opening invite dialog for:", fullHref)
//       // For now, it still navigates as per your current request.
//       // You would remove or modify the router.push(fullHref) line here
//       // when you implement the dialog.
//       router.push(fullHref)
//     } else {
//       router.push(fullHref)
//     }
//   }

//   return (
//     <>
//       <Tooltip.Provider delayDuration={150}>
//         <ul className="flex flex-col items-center space-y-2 mt-2">
//           {routes.map((item: NavigationRoute) => {
//             // Construct the full href for active state comparison
//             let itemFullHref = item.href
//             if (item.href.includes("[workspaceSlug]") && workspaceSlug) {
//               itemFullHref = item.href.replace("[workspaceSlug]", workspaceSlug as string)
//             }

//             const isActive = pathname === itemFullHref
//             const iconSrc = isActive ? item.activeIcon : item.icon // Choose icon based on active state

//             return (
//               <Tooltip.Root key={item.href}>
//                 <Tooltip.Trigger asChild>
//                   <button
//                     onClick={() => handleNavigation(item)}
//                     className={cn(
//                       "group rounded-md transition-all p-2 w-10 h-10 flex items-center justify-center",
//                       isActive ? "bg-gray-100 text-blue-900" : "hover:bg-gray-100",
//                     )}
//                     aria-label={item.label}
//                   >
//                     <Image
//                       src={iconSrc || "/placeholder.svg"}
//                       alt={item.label}
//                       width={20}
//                       height={20}
//                       className="w-[20px] h-[20px]"
//                     />
//                   </button>
//                 </Tooltip.Trigger>
//                 {/* Use Tooltip.Portal to prevent layout shifts */}
//                 <Tooltip.Portal>
//                   <Tooltip.Content
//                     side="right"
//                     sideOffset={8}
//                     className="z-50 rounded-md bg-white px-1.5 py-1.5 text-xs text-black shadow-md"
//                   >
//                     {item.label}
//                     <Tooltip.Arrow className="fill-white" />
//                   </Tooltip.Content>
//                 </Tooltip.Portal>
//               </Tooltip.Root>
//             )
//           })}
//         </ul>
//       </Tooltip.Provider>
//      <Separator className="my-4 bg-gray-300" />

// <Tooltip.Provider delayDuration={150}>
//   <div className="flex flex-col items-center space-y-2 my-2">
//     <Tooltip.Root>
//       <Tooltip.Trigger asChild>
//         <button
//           className="group rounded-md transition-all p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-100"
//           aria-label="Search"
//         >
//           <Image
//             src="/searchicon.svg"
//             alt="Search Icon"
//             width={20}
//             height={20}
//             className="w-[20px] h-[20px]"
//           />
//         </button>
//       </Tooltip.Trigger>
//       <Tooltip.Portal>
//         <Tooltip.Content
//           side="right"
//           sideOffset={8}
//           className="z-50 rounded-md bg-white px-1.5 py-1.5 text-xs text-black shadow-md"
//         >
//           Search
//           <Tooltip.Arrow className="fill-white" />
//         </Tooltip.Content>
//       </Tooltip.Portal>
//     </Tooltip.Root>
//   </div>
// </Tooltip.Provider>

//     </>
//   )
// }

// export default Navigation

// components/navigation.tsx
'use client'

import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'
import { getRoutes, type NavigationRoute } from '@/lib/navigationRoute'
import { useQueryData } from '@/hooks/useQueryData'
import { getUserInfo } from '@/lib/auth-client'

function Navigation() {
  const { workspaceSlug } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const userInfo = getUserInfo()
  const userId = userInfo?.userId
const routes = getRoutes(workspaceSlug as any)
  // 🔴 Fetch unread notification status
  const { data: notificationData } = useQueryData(
    ['notifications-status', workspaceSlug],
    () =>
      fetch(`/api/notifications/status?workspaceSlug=${workspaceSlug}&userId=${userId}`).then((res) =>
        res.json()
      ),
    !!workspaceSlug && !!userId
  )

  const hasUnread = notificationData?.hasUnread

  const handleNavigation = (item: NavigationRoute) => {
    let fullHref = item.href
    if (item.href.includes('[workspaceSlug]') && workspaceSlug) {
      fullHref = item.href.replace('[workspaceSlug]', workspaceSlug as string)
    }

    router.push(fullHref)
  }

  return (
    <>
      <Tooltip.Provider delayDuration={150}>
        <ul className="flex flex-col items-center space-y-2 mt-2">
          {routes.map((item: NavigationRoute) => {
            let itemFullHref = item.href
            if (item.href.includes('[workspaceSlug]') && workspaceSlug) {
              itemFullHref = item.href.replace('[workspaceSlug]', workspaceSlug as string)
            }

            const isActive = pathname === itemFullHref
            const iconSrc = isActive ? item.activeIcon : item.icon

            const showDot = item.label === 'Notification' && hasUnread

            return (
              <Tooltip.Root key={item.href}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      'group rounded-md transition-all p-2 w-10 h-10 flex items-center justify-center relative',
                      isActive ? 'bg-gray-100 text-blue-900' : 'hover:bg-gray-100'
                    )}
                    aria-label={item.label}
                  >
                    <Image
                      src={iconSrc || '/placeholder.svg'}
                      alt={item.label}
                      width={20}
                      height={20}
                      className="w-[20px] h-[20px]"
                    />
                    {/* 🔴 Red dot for unread notifications */}
                    {showDot && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="z-50 rounded-md bg-white px-1.5 py-1.5 text-xs text-black shadow-md"
                  >
                    {item.label}
                    <Tooltip.Arrow className="fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            )
          })}
        </ul>
      </Tooltip.Provider>
      <Separator className="my-4 bg-gray-300" />
      <div className="flex flex-col items-center space-y-2 my-2">
        <Image src="/searchicon.svg" alt="Search Icon" width={20} height={20} className="w-[20px] h-[20px]" />
      </div>
    </>
  )
}

export default Navigation
