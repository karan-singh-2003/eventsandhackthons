"use client"
import WorkspacesettingHeader from "@/components/workspaceSettingComponent/WorkspacesettingHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Workspacesettingmain from "@/components/workspaceSettingComponent/Workspacesettingdelete"

function TaskviewSwitcher() {

  return (
    <div className="bg-[#ffff] text-[#828282] rounded-lg lg:p-4 p-5 lg:mt-1 mt-[88px]">
      {" "}
      {/* Added p-4 for overall padding */}
      <div className="text-black font-bold px-4 lg:text-[25px] text-5xl lg:mb-2 mb-[40px]">
        {" "}
        {/* Changed ml-5 to px-4 */}
        Organization Settings
      </div>
      <Tabs className="w-full">
        <div className="h-full flex flex-col overflow-auto">
          <div className="flex flex-col gap-y-4 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto bg-[#ffff] gap-3">
              {" "}
              {/* Fixed missing closing bracket for bg-[#ffff] */}
              <TabsTrigger
                value="workspace profile"
                className="h-8 w-full lg:w-auto lg:text-xs text-2xl text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4 data-[state=active]:text-[#5267ee] cursor-pointer hover:border-amber-50"
              >
                Workspace Profile
              </TabsTrigger>
              <TabsTrigger
                value="Team Management"
                className="h-8 w-full lg:w-auto lg:text-xs text-2xl text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4 data-[state=active]:text-[#5267ee] cursor-pointer hover:border-amber-50"
              >
                Team Management
              </TabsTrigger>
              <TabsTrigger
                value="Roles Management"
                className="h-8 w-full lg:w-auto lg:text-xs text-2xl text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4 data-[state=active]:text-[#5267ee] cursor-pointer border-2 hover:border-amber-50"
              >
                Roles Management
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="workspace profile" className="mt-4">
            {" "}
            {/* Added mt-4 for spacing */}
            <>
              <WorkspacesettingHeader />
               <Workspacesettingmain /> 
              {/* <WorkspaceAccess/>  */}
            </>
          </TabsContent>
          <TabsContent value="Team Management" className="mt-4">
            <h2>Team Management</h2>
          </TabsContent>
          <TabsContent value="Roles Management" className="mt-4">
            Roles Management
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default TaskviewSwitcher
