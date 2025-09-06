import { useParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { cn } from './utils'
import { Plus, PlusCircle, SearchIcon } from 'lucide-react'
import { EventCreateModal } from '@/components/dashboard/EventcreateModal'
import { Button } from '@/components/ui/button'
import { useEventModalStore } from '@/store/modal-slice'
import { EventCreateButton } from '@/components/dashboard/Eventcreatebutton'

function NavigationRoutesecond() {
    const { workspaceSlug } = useParams()
     const { openModal } = useEventModalStore();
    const pathname = usePathname()
    const router = useRouter()
  return (
<>
 <div className="flex flex-col items-center space-y-1 my-1 w-full">
        {/* {(() => {
          const isSearchActive = pathname === `/${workspaceSlug}/search` // 👈 adjust this route if different
          return (
            // <button
            //   onClick={() => router.push(`/${workspaceSlug}/search`)}
            //   className={cn(
            //     "w-full h-[42px] flex items-center justify-center transition-colors focus:outline-none",
            //     isSearchActive
            //       ? "bg-gray-100 text-gray-900"
            //       : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            //   )}
            // >
            //    <SearchIcon
            //     className="w-[17px] h-[17px] lg:w-[22px] lg:h-[22px]"
            //   />
            // </button>
            
            
            
          )
        })()}
        */}
       
       <EventCreateButton workspaceSlug={workspaceSlug}/>
      </div>
</>
  )
}

export default NavigationRoutesecond