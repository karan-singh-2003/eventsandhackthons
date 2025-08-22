'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import WorkspaceSettingsProfile from '@/components/dashboard/workspaceSettingComponent/WorkspaceProfile'
import RolesComponent from '@/components/Onboarding/Roles/RolesComponent'
import InviteMembersDemo from '@/components/dashboard/InviteMembers'
import JoinRequests from '@/components/dashboard/JoinRequests'
import { useState } from 'react'

function Page() {
  const [tab, setTab] = useState('workspace profile')

  return (
    <div className="bg-white text-[#828282] max-w-[1500px] rounded-lg lg:mx-6 lg:my-2 lg:p-0">
      {/* Header */}
      <div className="text-black font-bold text-[19px] lg:text-2xl mb-4 px-1 hidden lg:block">
        Organization Settings
      </div>

      <Tabs className="w-full" value={tab} onValueChange={setTab}>
        <div className="h-full flex flex-col overflow-auto">
          {/* Desktop Tabs */}
          <div className="w-full overflow-x-auto whitespace-nowrap lg:overflow-visible hidden lg:block">
            <TabsList className="inline-flex lg:gap-3 bg-white -p-0">
              <TabsTrigger value="workspace profile">Workspace Profile</TabsTrigger>
              <TabsTrigger value="Team Management">Team Management</TabsTrigger>
              <TabsTrigger value="Roles Management">Roles Management</TabsTrigger>
              <TabsTrigger value="Joining Request">Joining Requests</TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Dropdown */}
       <div className="lg:hidden mb-1">
  <Select value={tab} onValueChange={setTab}>
    <SelectTrigger 
      className="w-full h-[37px] bg-[#F3F3F3] rounded-none flex items-center px-2 text-[11px]"
    >
      <SelectValue placeholder="Select section" />
    </SelectTrigger>
    <SelectContent className="text-[10px] ">
      <SelectItem value="workspace profile" className='text-[10px]'>Workspace Profile</SelectItem>
      <SelectItem className='text-[10px]' value="Team Management">Team Management</SelectItem>
      <SelectItem value="Roles Management" className='text-[10px]'>Roles Management</SelectItem>
      <SelectItem value="Joining Request" className='text-[10px]'>Joining Requests</SelectItem>
    </SelectContent>
  </Select>
</div>



          {/* Tabs Content */}
          <TabsContent value="workspace profile" className="lg:mt-4 mt-2 max-w-[800px]">
            <WorkspaceSettingsProfile />
          </TabsContent>

          <TabsContent value="Team Management" className="mt-4">
            <div className="max-w-[1200px]">
              <InviteMembersDemo />
            </div>
          </TabsContent>

          <TabsContent value="Roles Management" className="mt-4">
            <div className="text-base lg:text-lg font-semibold max-w-[800px] px-1">
              <RolesComponent />
            </div>
          </TabsContent>

          <TabsContent value="Joining Request" className="mt-4">
            <div className="text-base lg:text-lg font-semibold max-w-[900px] px-1">
              <JoinRequests />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default Page
