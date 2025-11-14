// import { useParams, usePathname, useRouter } from 'next/navigation'
// import React from 'react'
// import { cn } from './utils'
// import { Plus, PlusCircle, SearchIcon } from 'lucide-react'
// import { EventCreateModal } from '@/components/dashboard/EventcreateModal'
// import { Button } from '@/components/ui/button'
// import { useEventModalStore } from '@/store/modal-slice'
// import { EventCreateButton } from '@/components/dashboard/Eventcreatebutton'

// function NavigationRoutesecond() {
//     const { workspaceSlug } = useParams()
//      const { openModal } = useEventModalStore();
//     const pathname = usePathname()
//      const router = useRouter()

//   const targetUrl = `/workspace/${workspaceSlug}/organizationevents`

//   const isActive = pathname === targetUrl

  
//   return (
// <>
//  <div className="flex flex-col items-center space-y-1 my-1 w-full">
//         {/* {(() => {
//           const isSearchActive = pathname === `/${workspaceSlug}/search` // 👈 adjust this route if different
//           return (
//             // <button
//             //   onClick={() => router.push(`/${workspaceSlug}/search`)}
//             //   className={cn(
//             //     "w-full h-[42px] flex items-center justify-center transition-colors focus:outline-none",
//             //     isSearchActive
//             //       ? "bg-gray-100 text-gray-900"
//             //       : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
//             //   )}
//             // >
//             //    <SearchIcon
//             //     className="w-[17px] h-[17px] lg:w-[22px] lg:h-[22px]"
//             //   />
//             // </button>
            
            
            
//           )
//         })()}
//         */}
       
//        {/* <EventCreateButton workspaceSlug={workspaceSlug}/> */}
//          <button
//       onClick={() => router.push(targetUrl)}
//       className={`
//         p-2 rounded flex items-center gap-2 hover:cursor-pointer
//         transition
//         ${isActive ? "bg-gray-100 text-gray-700" : "hover:text-gray-800 hover:bg-gray-50"}
//       `}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         height={21}
//         width={21}
//       >
//         <path
//           fill={isActive ? "#555" : ""}  // icon color changes
//           d="M14.9205 18.5c-0.68035 0 -1.25385 -0.23485 -1.7205 -0.7045 -0.46665 -0.46985 -0.7 -1.04485 -0.7 -1.725 0 -0.68035 0.23485 -1.25385 0.7045 -1.7205 0.46985 -0.46665 1.04485 -0.7 1.725 -0.7 0.68035 0 1.25385 0.23485 1.7205 0.7045 0.46665 0.46985 0.7 1.04485 0.7 1.725 0 0.68035 -0.23485 1.25385 -0.7045 1.7205 -0.46985 0.46665 -1.04485 0.7 -1.725 0.7ZM3 22V3.5h3.125V2h1.625v1.5h8.5V2h1.625v1.5H21v18.5H3Zm1.5 -1.5h15V9.75H4.5V20.5Zm0 -12.25h15V5H4.5v3.25Z"
//           strokeWidth={0.5}
//         />
//       </svg>

      
//     </button>
  

//       </div>
// </>
//   )
// }

// export default NavigationRoutesecond


"use client"

import * as Tooltip from "@radix-ui/react-tooltip"
import { useParams, usePathname, useRouter } from "next/navigation"

export default function NavigationRoutesecond() {
  const {workspaceSlug} = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const targetUrl = `/workspace/${workspaceSlug}/organizationevents`
  const isActive = pathname === targetUrl

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>

        <Tooltip.Trigger asChild>
          <button
            onClick={() => router.push(targetUrl)}
            className={`
              p-2 rounded hover:cursor-pointer flex items-center gap-2 transition
              ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:bg-gray-50"}
            `}
          >
            {/* Your SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height={21}
              width={21}
            >
              <path
                fill={isActive ? "#555" : "#a3a3a3"}
                d="M14.9205 18.5c-0.68035 0 -1.25385 -0.23485 -1.7205 -0.7045 -0.46665 -0.46985 -0.7 -1.04485 -0.7 -1.725 0 -0.68035 0.23485 -1.25385 0.7045 -1.7205 0.46985 -0.46665 1.04485 -0.7 1.725 -0.7 0.68035 0 1.25385 0.23485 1.7205 0.7045 0.46665 0.46985 0.7 1.04485 0.7 1.725 0 0.68035 -0.23485 1.25385 -0.7045 1.7205 -0.46985 0.46665 -1.04485 0.7 -1.725 0.7ZM3 22V3.5h3.125V2h1.625v1.5h8.5V2h1.625v1.5H21v18.5H3Zm1.5 -1.5h15V9.75H4.5V20.5Zm0 -12.25h15V5H4.5v3.25Z"
                strokeWidth={0.5}
              />
            </svg>
          </button>
        </Tooltip.Trigger>

        {/* Tooltip Content */}
           <Tooltip.Portal>
                          <Tooltip.Content
                            side="right"
                            sideOffset={8}
                            className="z-50 rounded-none bg-white px-1.5 py-1.5 text-xs text-black"
                          >
                            Organization Events
                            <Tooltip.Arrow className="fill-white" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
