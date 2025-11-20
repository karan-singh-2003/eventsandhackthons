'use client'


import { EnrolledEventsList } from '@/components/landingPage/landingpageEnrolledEventcomp/EnrolledEventList'
import { ProfileDataEnrolled } from '@/components/landingPage/landingpageEnrolledEventcomp/ProfileDataEnrolledEvent'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-6xl mx-auto">
        {/* Events Section - Takes 3 columns */}
        <div className="lg:col-span-3 ">
          <EnrolledEventsList/>
        </div>
        
        {/* User Profile Section - Takes 1 column */}
        <div className="lg:col-span-1 hidden">
          <ProfileDataEnrolled/>
        </div>
      </div>
    </div>
  )
}