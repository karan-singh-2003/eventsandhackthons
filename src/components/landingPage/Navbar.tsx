// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Search, Menu } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { getAuthData } from '@/lib/auth-client'
// import Image from 'next/image'
// import Sidebar from '@/components/landingPage/Sidebar'
// import ClientOnly from '@/components/global/ClientOnly'

// const Navbar = () => {
//   const [hydrated, setHydrated] = useState(false)
//   const [userInfo, setUserInfo] = useState<{ name?: string; universityId?: string } | null>(null)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   // Mark when client hydration is complete
//   useEffect(() => {
//     setHydrated(true)
//   }, [])

//   // Fetch auth data and handle pending invites only after hydration
//   useEffect(() => {
//     if (!hydrated) return

//     try {
//       const authData = getAuthData()
//       setUserInfo(authData.userInfo)
//     } catch (error) {
//       console.error('Error fetching user data:', error)
//       setUserInfo(null)
//     }

//     const pendingInviteToken = localStorage.getItem('pending_invite_token')
//     if (pendingInviteToken) {
//       window.location.href = `/invite/${pendingInviteToken}`
//     }
//   }, [hydrated])

//   const Name = userInfo?.name

//   // Render placeholder during hydration to avoid mismatch
//   if (!hydrated) {
//     return (
//       <div className="h-[64px] w-full flex items-center justify-center bg-gray-100">
//         <div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>
//       </div>
//     )
//   }

//   return (
//     <>
//       {/* 🔹 Navbar Container */}
//       <nav className="relative flex items-center w-[1200px] mx-auto">
//         {/* Left Section - Logo + Search */}
//         <div className="flex items-center justify-between w-full px-6 py-4">
//           <div className="flex items-center flex-1">
//             <Image
//               src="/eventsLogo.svg"
//               alt="eventsLogo"
//               width={126}
//               height={36}
//               className="w-16 h-3 sm:w-20 sm:h-6 md:w-24 md:h-5.5"
//               style={{
//                 filter: 'invert(1)',
//                 display: 'block',
//               }}
//             />

//             {/* Search Bar */}
//             <div className="flex items-center bg-[#F5F5F5] rounded-full px-4 ml-6 w-full max-w-[600px] h-9">
//               <Search className="text-[#929292] w-4 h-4 mr-4" />
//               <input
//                 type="text"
//                 className="bg-transparent placeholder:text-[#929292] text-sm text-[#929292] outline-none w-full"
//                 placeholder="Search for events and hackathons"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Right Section - Buttons & Menu */}
//         <div className="flex items-center space-x-4">
//           <ClientOnly
//             fallback={<div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>}
//           >
//             {!Name ? (
//               <Button
//                 className="bg-orange-600 rounded-full px-8 hover:bg-orange-700"
//                 onClick={() => (window.location.href = '/sign-in')}
//               >
//                 Get Started
//               </Button>
//             ) : (
//               <span className="text-[15px] px-4 py-2 rounded-full font-medium whitespace-nowrap">
//                 Hi, {Name.replace(/ .*/, '')}
//               </span>
//             )}
//           </ClientOnly>

//           {/* Sidebar toggle */}
//           <button onClick={() => setIsSidebarOpen(true)}>
//             <Menu className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
//           </button>
//         </div>
//       </nav>

//       {/* Sidebar (Client-side only) */}
//       <ClientOnly>
//         <Sidebar
//           userName={userInfo?.name || null}
//           URN={userInfo?.universityId || null}
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//         />
//       </ClientOnly>
//     </>
//   )
// }

// export default Navbar

'use client'

import React, { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAuthData } from '@/lib/auth-client'
import Image from 'next/image'
import Sidebar from '@/components/landingPage/Sidebar'
import ClientOnly from '@/components/global/ClientOnly'
import { Input } from '@/components/ui/input'

const Navbar = () => {
  const [hydrated, setHydrated] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name?: string; universityId?: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // ✅ Handle hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // ✅ Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ Fetch user data
  useEffect(() => {
    if (!hydrated) return

    try {
      const authData = getAuthData()
      setUserInfo(authData.userInfo)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserInfo(null)
    }

    const pendingInviteToken = localStorage.getItem('pending_invite_token')
    if (pendingInviteToken) {
      window.location.href = `/invite/${pendingInviteToken}`
    }
  }, [hydrated])

  const Name = userInfo?.name

  if (!hydrated) {
    return (
      <div className="h-[64px] w-full flex items-center justify-center bg-gray-100">
        <div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
    )
  }

  return (
    <>
      {/* 🔹 Sticky Navbar */}
      <nav
        className={` top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background border-b border-border shadow-md backdrop-blur-xl'
            : 'bg-background/80 border-b border-border/40 backdrop-blur-md'
        }`}
      >
        <div 
        // className={`transition-all duration-700 delay-100 ${
        //     showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        //   }`}
        className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* 🔸 Left: Logo + Search together */}
          <div className="flex items-center ml-4 gap-4 md:gap-6 flex-shrink-0">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/eventsLogo.svg"
                alt="eventsLogo"
                width={110}
                height={36}
                   className="w-16 h-3 sm:w-20 sm:h-6 md:w-24 md:h-5.5"
          style={{
                 filter: 'invert(1)',
                 display: 'block',
               }}
              />
              </a>

            {/* Search bar — closer to logo */}
            <div className="hidden sm:flex items-center w-[180px]   lg:w-[620px] ">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-9 text-sm bg-muted/50 border-border/50"
                />
              </div>
            </div>
          </div>

          {/* 🔸 Right: Buttons & Menu */}
          {/* Right: User icon + name + Sidebar toggle */}
<div className="flex items-center gap-4 ml-auto relative left-45">
  <ClientOnly
    fallback={<div className="w-[110px] h-9 bg-gray-200 animate-pulse rounded-full"></div>}
  >
    {!Name ? (
                <Button
                  className="bg-orange-600 rounded-full px-6 hover:bg-orange-700 hidden sm:flex"
                  onClick={() => (window.location.href = '/sign-in')}
                >
                  Get Started
                </Button> ) :(
      <span className="flex items-center gap-2 text-[18px] px-4 py-2 rounded-full font-medium whitespace-nowrap" onClick={() => setIsSidebarOpen(true)}>
        {/* Person Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#6f6f6f"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
          height={22}
          width={22}
        >
          <desc>
            {"Person Circle Streamline Icon: https://streamlinehq.com"}
          </desc>
          <path d="M11 6a3 3 0 1 1 -6 0 3 3 0 0 1 6 0" strokeWidth={1} />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8 -7a7 7 0 0 0 -5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            strokeWidth={1}
          />
        </svg>
        {/* User Name */}
        Hi, {Name.replace(/ .*/, '')}
      </span>
    )}
  </ClientOnly>

  {/* Sidebar toggle */}
  
</div>

        </div>
      </nav>

      {/* 🔹 Sidebar */}
      <ClientOnly>
        <Sidebar
          userName={userInfo?.name || null}
          URN={userInfo?.universityId || null}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </ClientOnly>
    </>
  )
}

export default Navbar
