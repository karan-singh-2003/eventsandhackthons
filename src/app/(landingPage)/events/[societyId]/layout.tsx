import Footer from "@/components/landingPage/Footer landing page/Footer"
import Navbar from "@/components/landingPage/Navbar"

export default function MotionTextLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar/>
      {children}
       <Footer/>
    </>
  )
}
