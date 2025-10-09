// src/app/(landingPage)/layout.tsx
import type { ReactNode } from 'react'
import ClientOnly from '@/components/global/ClientOnly'


// 🧩 Import fonts properly
import { Inter, Poppins } from 'next/font/google'
import Navbar from '@/components/landingPage/Navbar'

// 🧠 Configure fonts

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* ✅ Combine font class names and apply to body */}
      <body className={`${inter.variable} ${poppins.variable} font-poppins `}>
        <ClientOnly>
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
