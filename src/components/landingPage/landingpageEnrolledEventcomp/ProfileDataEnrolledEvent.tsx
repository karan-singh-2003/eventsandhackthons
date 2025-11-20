'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  enrolledEventsCount: number
  deliveryMethod: string
}

export function ProfileDataEnrolled() {
  const user: UserInfo = {
    firstName: 'Himanshu',
    lastName: 'Singh',
    email: 'hr1411687@gmail.com',
    enrolledEventsCount: 2,
    deliveryMethod: 'eTicket',
  }

  return (
    <Card className="p-6 border border-border sticky top-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Your Profile</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Edit
          </button>
        </div>
        <div className="h-px bg-border"></div>
      </div>

      {/* User Info Section */}
      <div className="space-y-6">
        {/* Login Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">✓ Logged In</p>
            <p className="text-xs">You are signed in to your account</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide ">
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                First Name
              </label>
              <div className="text-sm text-foreground font-medium">
                {user.firstName}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Last Name
              </label>
              <div className="text-sm text-foreground font-medium">
                {user.lastName}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Email
              </label>
              <div className="text-sm text-foreground font-medium break-all">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide ">
            Delivery Method
          </h3>
          <div className="bg-gray-50 border border-border rounded-lg p-3">
            <p className="text-sm font-medium text-foreground">{user.deliveryMethod}</p>
            <p className="text-xs text-muted-foreground mt-1">Digital ticket delivery</p>
          </div>
        </div>

        {/* Enrollment Stats */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{user.enrolledEventsCount}</div>
              <p className="text-xs text-blue-900 mt-1">Events</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-xs text-green-900 mt-1">Available</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full mt-6 border-red-200 text-red-600 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>
    </Card>
  )
}
