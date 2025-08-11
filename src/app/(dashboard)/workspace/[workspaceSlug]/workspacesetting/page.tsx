'use client'

import WorkspacesettingHeader from '@/components/workspaceSettingComponent/WorkspacesettingHeader'
import Workspacesettingmain from '@/components/workspaceSettingComponent/Workspacesettingdelete'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function TaskviewSwitcher() {
  return (
    <div className="bg-white text-[#828282] rounded-lg p-2 lg:p-4 mt-1">
      {/* Header */}
      <div className="text-black font-bold text-xl lg:text-[25px] mb-4 lg:px-4">
        Organization Settings
      </div>

      <Tabs className="w-full" defaultValue="workspace profile">
        <div className="h-full flex flex-col overflow-auto">
     
          <div className="w-full overflow-x-auto whitespace-nowrap lg:overflow-visible">
            <TabsList className="inline-flex gap-2 lg:gap-3 bg-white px-1 lg:px-0">
              <TabsTrigger
                value="workspace profile"
                className="h-10 text-nowrap px-4 text-xs lg:text-xs text-[#828282]
        data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4
        data-[state=active]:text-[#5267ee] cursor-pointer transition-colors"
              >
                Workspace Profile
              </TabsTrigger>

              <TabsTrigger
                value="Team Management"
                className="h-10 text-nowrap px-4 text-xs lg:text-xs text-[#828282]
        data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4
        data-[state=active]:text-[#5267ee] cursor-pointer transition-colors"
              >
                Team Management
              </TabsTrigger>

              <TabsTrigger
                value="Roles Management"
                className="h-10 text-nowrap px-4 text-xs lg:text-xs text-[#828282]
        data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4
        data-[state=active]:text-[#5267ee] cursor-pointer transition-colors"
              >
                Roles Management
              </TabsTrigger>
            </TabsList>
          </div>

       
          <TabsContent
            value="workspace profile"
            className="lg:mt-4 mt-2"
            defaultValue="Team Management"
          >
            <WorkspacesettingHeader />
            <Workspacesettingmain />
          </TabsContent>

          <TabsContent value="Team Management" className="mt-4">
            <h2 className="text-base lg:text-lg font-semibold">
              Team Management
            </h2>
          </TabsContent>

          <TabsContent value="Roles Management" className="mt-4">
            <h2 className="text-base lg:text-lg font-semibold">
              Roles Management
            </h2>
          </TabsContent>
        </div>
      </Tabs>
      {/* <Tabs defaultValue="profile" className="lg:w-[680px] mt-5">
        <TabsList className="grid w-full grid-cols-3 gap-x-2 bg-transparent text-[#696767]">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="roles">Roles Management</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">Profile</TabsContent>
        <TabsContent value="roles">Roles</TabsContent>
        <TabsContent value="teams">Teams</TabsContent>
      </Tabs> */}
    </div>
  )
}

export default TaskviewSwitcher
