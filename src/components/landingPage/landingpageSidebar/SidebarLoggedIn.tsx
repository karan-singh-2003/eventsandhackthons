'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQueryData } from '@/hooks/useQueryData'
import SidebarManageEvents from './SidebarManageEvents'
import SidebarLogoutButton from './SidebarLogoutButton'
import { Separator } from '@/components/ui/separator'

interface SidebarLoggedInProps {
  userName: string
  onClose: () => void
}

interface ManageEventsConfig {
  show: boolean
  label: string
  redirectTo: string
  reason: string
}

const SidebarLoggedIn = ({ userName, onClose }: SidebarLoggedInProps) => {
  const [manageEventsConfig, setManageEventsConfig] =
    useState<ManageEventsConfig>({
      show: false,
      label: '',
      redirectTo: '',
      reason: '',
    })

  const { data: response, isPending: isLoading, error } = useQueryData(
    ['manageEventsConfig', userName],
    () => axios.get('/api/user/manage-events-config'),
    !!userName
  )

  useEffect(() => {
    if (response?.data && response.status === 200) {
      setManageEventsConfig(response.data.manageEvents)
    }
  }, [response])

  useEffect(() => {
    if (error) {
      setManageEventsConfig({
        show: false,
        label: '',
        redirectTo: '',
        reason: 'error',
      })
    }
  }, [error])

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Manage Events Section */}
      <div className=" space-y-2">
        <SidebarManageEvents
          isLoading={isLoading}
          config={manageEventsConfig}
          onClose={onClose}
        />
<Separator/>
         <button

      className="flex items-center gap-2 w-full px-4 py-1 text-[#333333] justify-start text-[14px]  hover:bg-gray-50 active:bg-gray-100"
      onClick={() => alert('Notifications clicked!')}
    >
      {/* Bell Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        id="Bell-Notification--Streamline-Sharp"
        height={17}
        width={17}
      >
        <g id="bell-notification--alert-bell-ring-notification-alarm">
          <path
            id="Vector 2344"
            stroke="#333333"
            d="M5 9v5l-2 4h18l-2 -4V9A7 7 0 1 0 5 9Z"
            strokeWidth={1.5}
          />
          <path
            id="Vector 2345"
            stroke="#333333"
            d="M10 22h4"
            strokeWidth={1.5}
          />
        </g>
      </svg>

      {/* Label */}
      <span>Notifications</span>
    </button>
  <Separator/>
       <button

      className="flex items-start gap-3 w-full  px-4 justify-start text-left hover:bg-gray-50 active:bg-gray-100 py-1"
      onClick={() => alert('View all your registered events')}
    >
      {/* Calendar Icon */}
      {/* New Order Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        id="Order-Approve--Streamline-Outlined-Material"
        height={17}
        width={17}
        className="mt-[2px] text-[#333333] flex-shrink-0"
      >
        <path
          fill="#333333"
          d="m17.6 20.525 3.475 -3.45 -1.05 -1.05 -2.425 2.375 -0.975 -0.975 -1.05 1.075 2.025 2.025ZM6 8.5h12v-1.5H6v1.5Zm12.3125 14.475c-1.29165 0 -2.39585 -0.4625 -3.3125 -1.3875 -0.91665 -0.925 -1.375 -2.02085 -1.375 -3.2875 0 -1.30715 0.45825 -2.4215 1.37475 -3.343 0.9165 -0.92135 2.0249 -1.382 3.32525 -1.382 1.28335 0 2.3875 0.46065 3.3125 1.382 0.925 0.9215 1.3875 2.03585 1.3875 3.343 0 1.26665 -0.4625 2.3625 -1.3875 3.2875 -0.925 0.925 -2.03335 1.3875 -3.325 1.3875ZM3 21.975V4.5c0 -0.4125 0.146915 -0.765665 0.44075 -1.0595C3.734415 3.146835 4.0875 3 4.5 3h15c0.4125 0 0.76565 0.146835 1.0595 0.4405C20.85315 3.734335 21 4.0875 21 4.5v8.175c-0.23615 -0.11435 -0.4785 -0.2096 -0.727 -0.28575 -0.24865 -0.07615 -0.50635 -0.13925 -0.773 -0.18925V4.5H4.5v14.975h7.75c0.048 0.30285 0.1225 0.5911 0.2235 0.86475 0.101 0.2735 0.21815 0.5436 0.3515 0.81025L12 21.975l-1.5 -1.5 -1.5 1.5 -1.5 -1.5 -1.5 1.5 -1.5 -1.5 -1.5 1.5ZM6 17h6.30675c0.06215 -0.26665 0.13075 -0.525 0.20575 -0.775 0.075 -0.25 0.17915 -0.49165 0.3125 -0.725H6v1.5Zm0 -4.25h9.6c0.36665 -0.18335 0.75 -0.32915 1.15 -0.4375 0.4 -0.10835 0.81665 -0.17915 1.25 -0.2125v-0.85H6v1.5Z"
          strokeWidth={0.5}
        />
      </svg>

      {/* Text Section */}
      <div className="flex flex-col">
        <span className="text-[14px]  text-[#333333]">
          Your Orders
        </span>
        <span className="text-[11px] text-gray-500">
          View all your registered events
        </span>
      </div>
    </button>
  <Separator/>
       
       <button className='flex items-start gap-3 w-full  px-4 justify-start text-left hover:bg-gray-50 active:bg-gray-100 py-1'>
            
       </button>

      </div>


      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <SidebarLogoutButton />
      </div>
    </div>
  )
}

export default SidebarLoggedIn
