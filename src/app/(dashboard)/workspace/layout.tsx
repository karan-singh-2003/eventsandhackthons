"use client"

import type React from "react"
import WorkspaceNavbar from "@/components/dashboard/WorkspaceNavbar"
import Slider, { MobileSidebarProvider } from "@/components/dashboard/WorkspaceSlider"
import { NuqsAdapter } from "nuqs/adapters/next"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

interface DashboardlayoutProps {
  children: React.ReactNode
}

function Layout({ children }: DashboardlayoutProps) {
  return (
    <MobileSidebarProvider>
      <div className="min-h-screen bg-white">
        {/* Fixed Top Navbar */}
         <div className="fixed top-0 left-0 z-50 w-full h-8 lg:h-[49px] bg-white border-b border-gray-200">
          <WorkspaceNavbar />
        </div>

        {/* Content Area */}
        <div className="pt-[30px] lg:pt-[49px] h-screen">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Sidebar Panel - Hidden on mobile, visible on desktop */}
            <Panel defaultSize={0} minSize={0} maxSize={18} className="bg-[#f0f0f0] hidden lg:block">
              <div className="fixed top-[49px] left-0 h-[calc(100vh-49px)] w-[47px] border-r border-gray-200 bg-white z-40">
                <Slider />
              </div>
            </Panel>

            {/* Mobile Sidebar - Only visible when toggled on mobile */}
            <div className="lg:hidden ">
              <Slider />
            </div>

            {/* Resize Handle (desktop only) */}
            <PanelResizeHandle className="w-1 bg-[#f6f6f6] cursor-col-resize hidden lg:block" />

            {/* Main Content Panel */}
            <Panel>
              <div className="lg:pl-[18px] h-full ">
                <div className="mx-auto max-w-screen-3xl h-full ">
                  <main className="h-full overflow-y-auto px-3 sm:px-6 py-2">
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </main>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </MobileSidebarProvider>
  )
}

export default Layout
