// "use client"

// import AboutMotionTextTriangle from "@/components/landingPage/eventcomponents/motioncomponent/Aboutmotionscroll";
// import EventParticipationSettings from "@/components/landingPage/eventcomponents/motioncomponent/EventParticipant";
// import ScrollGrowBox from "@/components/landingPage/eventcomponents/motioncomponent/Scrollgrowbox";
// import { useState } from "react";

// // import { motion, useAnimation } from "framer-motion"
// // import { useEffect } from "react"
// // import { useInView } from "react-intersection-observer"

// // export default function AboutMotionText() {
// //   const controls = useAnimation()
// //   const [ref, inView] = useInView({
// //     triggerOnce: true, // only animate once
// //     threshold: 0.2,    // start when 20% of text is visible
// //   })

// //   useEffect(() => {
// //     if (inView) {
// //       controls.start({
// //         opacity: 1,
// //         y: 0, // move to normal position
// //         transition: {
// //           duration: 0.9,
// //           ease: [0.22, 1, 0.36, 1], // smooth "falling" easing
// //         },
// //       })
// //     }
// //   }, [controls, inView])

// //   return (
// //     <section className="h-[100vh] flex items-center justify-center bg-white">
// //       <motion.h1
// //         ref={ref}
// //         initial={{ opacity: 0, y: -100 }} // start from above
// //         animate={controls}
// //         className="text-6xl md:text-8xl font-bold text-gray-800 tracking-tight"
// //       >
// //         About Me
// //       </motion.h1>
// //     </section>
// //   )
// // }



// export default function HomePage() {
//   const [eventSettings, setEventSettings] = useState({
//   isTeamEvent: false,
//   minTeamSize: null,
//   maxTeamSize: null,
// });
//   return (
//     <>
//     <main>
//       <section className="h-screen flex items-center justify-center bg-gray-800 text-white text-5xl">
//         Scroll Down ⬇️
//       </section>

//       <AboutMotionTextTriangle/>

//       <section className="h-screen flex items-center justify-center bg-gray-800 text-white text-5xl">
//         Keep Scrolling ⬆️⬇️
//       </section>
//       <ScrollGrowBox/>
//       <EventParticipationSettings  onChange={setEventSettings}/>
//     </main>

//     <div className=" flex space-x-12 bg-gray-200 text-black text-5xl">
//       <div className="border h-screen overflow-y-scroll border-gray-600 w-[70%]"> <div className="space-y-4">
//           {Array.from({ length: 30 }).map((_, i) => (
//             <div
//               key={i}
//               className="p-4 bg-white rounded-xl shadow-sm border"
//             >
//               Scrollable Item {i + 1}
//             </div>
//           ))}
//         </div></div>
//       <div className="w-[20%] border border-gray-500 sticky top-0">hii</div>
//       </div>


//     </>
//   )
// }




"use client";
import React from "react";

// 🔹 Example data coming from API
const sampleData = [
  { title: "Hackathon", name: "Rahul Sharma", status: "APPROVED" },
  { title: "Tech Talk", name: "Aditi Verma", status: "PENDING" },
  { title: "Workshop", name: "Karan Singh", status: "APPROVED" },
];

export default function ExportCSVUI({ data = sampleData }) {

  const exportToCSV = () => {
    // Convert to CSV string
    const headers = ["Event Title", "Name", "Status"];
    const rows = data.map((item) => [item.title, item.name, item.status]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "event_participants.csv";
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-5 bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Event Participants</h2>
        <button
          onClick={exportToCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Event Title</th>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{d.title}</td>
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
