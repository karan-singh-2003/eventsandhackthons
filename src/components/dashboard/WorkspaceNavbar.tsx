import WorkspacesSwitcher from "./WorkspaceSwitcher"

function WorkspaceNavbar() {
  return (
    <div className="px-1 py-1 lg:p-2 w-full flex items-center justify-between h-8 lg:h-full">
      <div className="flex items-center">
        <WorkspacesSwitcher />
      </div>
      {/* <div className="flex items-center">        
        <ProfileDropdown />      
      </div> */}
    </div>
  )
}

export default WorkspaceNavbar
