import React from "react"

function FooterSecondSection() {
  return (
    <footer className="w-full bg-[#383838] py-8 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-14 flex flex-col gap-4">
        {/* Book Your Calendar */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] lg:text-[14px] font-bold text-[#a5a5a5] uppercase cursor-pointer transition duration-300 ease-in-out hover:text-[#ffffff]">
            Book Your Calendar Now
          </h3>
          <p className="text-[12px] lg:text-[12px] text-[#7f7f7f] font-medium leading-relaxed cursor-pointer transition duration-300 ease-in-out hover:text-[#bfbfbf]">
       Activities happening around you today |     Activities happening around you  tomorrow |     Activities happening around you  this week |     Activities happening around you  this month |     Activities happening around you  this year
          </p>
        </div>

        {/* More Activities */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] lg:text-[14px] font-bold text-[#a5a5a5] uppercase cursor-pointer transition duration-300 ease-in-out hover:text-[#ffffff]">
            More Activities
          </h3>
          <p className="text-[12px] lg:text-[12px] text-[#7f7f7f] font-medium leading-relaxed cursor-pointer transition duration-300 ease-in-out hover:text-[#bfbfbf]">
            Activities happening around you today |     Activities happening around you  tomorrow |     Activities happening around you  this week |     Activities happening around you  this month |     Activities happening around you  this year
          </p>
        </div>

        {/* Venues */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] lg:text-[14px] font-bold text-[#a5a5a5] uppercase cursor-pointer transition duration-300 ease-in-out hover:text-[#ffffff]">
            Venues
          </h3>
          <p className="text-[12px] lg:text-[12px] text-[#7f7f7f] font-medium leading-relaxed cursor-pointer transition duration-300 ease-in-out hover:text-[#bfbfbf]">
            Activities happening around you today | tomorrow | this week | this month | this year
          </p>
        </div>

        {/* Help Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[15px] lg:text-[14px] font-bold text-[#a5a5a5] uppercase cursor-pointer transition duration-300 ease-in-out hover:text-[#ffffff]">
            Help
          </h3>
          <p className="text-[12px] lg:text-[12px] text-[#7f7f7f] font-medium leading-relaxed cursor-pointer transition duration-300 ease-in-out hover:text-[#bfbfbf]">
            About Us | Contact Us | Privacy Policy | Terms & Conditions | FAQs
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSecondSection
