"use client"

import AboutMotionTextTriangle from "@/components/landingPage/eventcomponents/motioncomponent/Aboutmotionscroll";
import EventParticipationSettings from "@/components/landingPage/eventcomponents/motioncomponent/EventParticipant";
import ScrollGrowBox from "@/components/landingPage/eventcomponents/motioncomponent/Scrollgrowbox";
import { useState } from "react";

// import { motion, useAnimation } from "framer-motion"
// import { useEffect } from "react"
// import { useInView } from "react-intersection-observer"

// export default function AboutMotionText() {
//   const controls = useAnimation()
//   const [ref, inView] = useInView({
//     triggerOnce: true, // only animate once
//     threshold: 0.2,    // start when 20% of text is visible
//   })

//   useEffect(() => {
//     if (inView) {
//       controls.start({
//         opacity: 1,
//         y: 0, // move to normal position
//         transition: {
//           duration: 0.9,
//           ease: [0.22, 1, 0.36, 1], // smooth "falling" easing
//         },
//       })
//     }
//   }, [controls, inView])

//   return (
//     <section className="h-[100vh] flex items-center justify-center bg-white">
//       <motion.h1
//         ref={ref}
//         initial={{ opacity: 0, y: -100 }} // start from above
//         animate={controls}
//         className="text-6xl md:text-8xl font-bold text-gray-800 tracking-tight"
//       >
//         About Me
//       </motion.h1>
//     </section>
//   )
// }



export default function HomePage() {
  const [eventSettings, setEventSettings] = useState({
  isTeamEvent: false,
  minTeamSize: null,
  maxTeamSize: null,
});
  return (
    <main>
      <section className="h-screen flex items-center justify-center bg-gray-800 text-white text-5xl">
        Scroll Down ⬇️
      </section>

      <AboutMotionTextTriangle/>

      <section className="h-screen flex items-center justify-center bg-gray-800 text-white text-5xl">
        Keep Scrolling ⬆️⬇️
      </section>
      <ScrollGrowBox/>
      <EventParticipationSettings  onChange={setEventSettings}/>
    </main>
  )
}
