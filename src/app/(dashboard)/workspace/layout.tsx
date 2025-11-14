"use client"

import type React from "react"
import WorkspaceNavbar from "@/components/dashboard/WorkspaceNavbar"
import Slider, { MobileSidebarProvider } from "@/components/dashboard/WorkspaceSlider"
import { NuqsAdapter } from "nuqs/adapters/next"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { usePanelStore } from "@/store/modal-slice"
import EventResizableData from "@/components/event/EventResizableData"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface DashboardlayoutProps {
  children: React.ReactNode
}

function Layout({ children }: DashboardlayoutProps) {
  const { isOpen, panelType, panelData, panelRoute, closePanel } = usePanelStore()

  const pathname = usePathname()

  // ✅ Auto-close panel when route changes
  useEffect(() => {
    if (panelRoute && pathname !== panelRoute) {
      closePanel()
    }
  }, [pathname, panelRoute])

  return (
    <MobileSidebarProvider>
      <div className="min-h-screen bg-white">

        {/* Fixed Top Navbar */}
        <div className="fixed top-0 left-0 z-50 w-full h-8 lg:h-[49px] bg-white border-b border-gray-200">
          <WorkspaceNavbar />
        </div>

        {/* Content Area */}
        <div className="pt-[30px] lg:pt-[49px] h-screen">
          <ResizablePanelGroup direction="horizontal" className="h-full">

            {/* Desktop Sidebar Panel */}
            <div className="hidden lg:flex">
              <div className="fixed top-[49px] left-0 h-[calc(100vh-49px)] w-[47px] border-r border-gray-200 bg-white z-40">
                <Slider />
              </div>
            </div>

            {/* Resizable Panel - Desktop only */}
            <ResizablePanel
              defaultSize={isOpen ? 25 : 0}
              minSize={isOpen ? 25 : 0}
              maxSize={25}
              className={`${isOpen ? "hidden lg:flex" : "hidden"} flex-col bg-[#f0f0f0]`}
            >
              {isOpen && (
                <div className="text-gray-600 overflow-y-auto">

                  {/* ✅ Event Panel */}
                  {panelType === "event" &&  (
                    <EventResizableData event={panelData} />
                  )}

                  {/* ✅ Workspace Panel */}
                  {panelType === "workspace" && panelData && (
                    <div>
                      <h2 className="text-lg font-bold mb-2">Workspace Info</h2>
                      <p className="text-sm text-gray-600">{panelData.info}</p>
                    </div>
                  )}

                </div>
              )}
            </ResizablePanel>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
              <Slider />
            </div>

            {/* Resize Handle */}
            {isOpen && (
              <ResizableHandle className="hidden lg:flex w-1 bg-[#f6f6f6] cursor-col-resize" />
            )}

            {/* Main Content Panel */}
            <ResizablePanel>
              <div className="lg:pl-[18px] h-full">
                <div className="mx-auto max-w-screen-3xl h-full">
                  <main className="h-full overflow-y-auto px-3 sm:px-6 py-2">
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </main>
                </div>
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>

      </div>
    </MobileSidebarProvider>
  )
}

export default Layout
