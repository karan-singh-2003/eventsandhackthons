import React from "react"

function FooterFirstSection() {
  return (
    <footer className="w-full bg-[#eeeeee] py-6 md:py-8 lg:py-6">
      <div className="max-w-[1400px] mx-auto px-4  md:px-12 lg:px-14 flex flex-col gap-1">
        {/* Heading */}
        <h2 className="text-[15px] md:text-[14px] font-bold text-[#707070]">
          Privacy Note
        </h2>

        {/* Description */}
        <p className="text-[12px] md:text-[12px] lg:text-[12px] text-[#7f7f7f] text-justify leading-relaxed">
          By using <span className="font-medium text-[#d1410c]">www.event.com</span> (our website), 
          you are fully accepting the Privacy Policy available at 
          <span className="font-medium text-[#d1410c]"> http://event.com/privacy</span>. 
          If you do not agree with these terms, please do not share any personal information 
          and immediately exit <span className="font-medium text-[#d1410c]" >event.com</span>.
        </p>
      </div>
    </footer>
  )
}

export default FooterFirstSection
