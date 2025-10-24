"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Calendar, Clock, MapPin, Users } from "lucide-react"

interface RegistrationCardProps {
  isInterested?: boolean
  isFavorite?: boolean
}

export default function ActiveEventRegistrationCard({ isInterested, isFavorite }: RegistrationCardProps) {
  const details = [
    { icon: Calendar, value: "Sun 28 Sep 2025" },
    { icon: Clock, value: "7:30 pm" },
    { icon: Clock, value: "4 hours" },
    { icon: Users, value: "Solo/Team: All are applicable" },
    { icon: MapPin, value: "MBA BLOCK, DBMS LAB" },
  ]

  return (
    <Card className="shadow-sm w-full max-w-[450px] lg:max-w-[480px] mx-auto transition-all duration-300">
      <CardContent className="pt-6 space-y-6">
        {/* Event Summary */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:gap-4">
            {details.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div
                  key={index}
                  className="flex gap-3 sm:gap-4 items-start mt-1"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-[#464646]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#282727] text-[13px] lg:text-[14px] leading-snug">
                      {detail.value}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Itian Club Section */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="flex-shrink-0 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height={15}
                  width={15}
                  className="h-5 w-5"
                >
                  <path d="m2.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m1.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m0.504 23.433 23 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m0.504 21.433 23 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m1.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m9.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m9.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m5.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m10.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m13.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m17.504 19.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m17.504 11.433 5 0" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m18.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path d="m21.504 19.433 0 -8" fill="none" stroke="#464646" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
                  <path
                    d="M1.65 8.538a0.5 0.5 0 0 0 0.307 0.895h20.1a0.5 0.5 0 0 0 0.309 -0.894L12.343 0.674a0.5 0.5 0 0 0 -0.616 0Z"
                    fill="none"
                    stroke="#464646"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] lg:text-[14px] text-[#282727] ">
                  Itian Club
                </p>
              </div>
            </div>

            <Separator className="bg-[#d0d0d0]" />
          </div>

          {/* Booking Info */}
          <div className="flex items-center gap-2 bg-[#fff9eb] p-2 sm:p-3 rounded-md">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#464646]" />
            <p className="text-[#282727] text-[12px] sm:text-[13px] leading-tight">
              Bookings are filling fast for Ethical Hacking
            </p>
          </div>
        </div>

        {/* Register Button */}
        <button
          className="w-full h-10 sm:h-11 lg:h-12 text-[16px] sm:text-[17px] lg:text-[18px] text-white rounded-xl cursor-pointer lg:rounded-2xl font-medium bg-[#d1410c] hover:bg-[#b83a0c]  transition-all"
        >
          Register Here
        </button>
      </CardContent>
    </Card>
  )
}
