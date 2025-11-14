"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import EventResizableData from "@/components/event/EventResizableData"

export default function CustomLeftResizableLayout({
  children,
  title
}: {
  children?: React.ReactNode
title: string
}) {
  return (
    <>
      {/* ✅ ✅ MOBILE VIEW — ONLY CHILDREN, NO RESIZABLE PANEL */}
      <div className="block lg:hidden h-full w-full bg-white">
        <div className="h-full w-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* ✅ ✅ DESKTOP VIEW — SHOW FULL RESIZABLE PANEL */}
      <div className="hidden lg:flex h-full overflow-hidden ml-[-47px] bg- mt-[-8px]">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">

          {/* ✅ LEFT RESIZABLE PANEL */}
          <ResizablePanel
            defaultSize={15}
            minSize={25}
            maxSize={25}
            className="flex flex-col bg-[#f0f0f0]"
          >
            <div className="h-full w-full overflow-y-auto text-gray-700">
              <EventResizableData event={title} />
            </div>
          </ResizablePanel>

          {/* ✅ DRAG HANDLE */}
          <ResizableHandle className="bg-[#f6f6f6] cursor-col-resize" />

          {/* ✅ RIGHT CONTENT */}
          <ResizablePanel defaultSize={75} minSize={60}>
            <div className="h-full w-full overflow-y-auto bg-white">
              {children}
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </>
  )
}
