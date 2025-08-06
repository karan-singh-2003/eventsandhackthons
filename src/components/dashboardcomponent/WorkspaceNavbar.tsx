import React from 'react'
import WorkspacesSwitcher from './WorkspacesSwitcher'
import ProfileDropdown from '../Profilelogo'

function WorkspaceNavbar() {
  return (
       <div className="px-2 py-2 lg:p-2 border-b border-[#dcdcdc] w-full flex items-center justify-between h-full">
      <div className="flex items-center">
        <WorkspacesSwitcher />
      </div>
      <div className="flex items-center">
        <ProfileDropdown />
      </div>
    </div>
  )
}

export default WorkspaceNavbar
