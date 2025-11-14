"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface EventHeaderProps {
  title: string;
  status?: string; // default: "DRAFT"
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, status = "DRAFT" }) => {
  const firstChar = title?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="relative w-auto ml-[49px] min-h-[180px] bg-gradient-to-b from-[#182346] to-[#656565] text-white shadow">
      {/* Top Section */}
      <div className="flex items-center gap-3 p-3">
        
        {/* First Char Circle */}
        <div className="flex h-[25px] w-[25px] bg-[#0C1251] items-center justify-center rounded-full text-[13px] font-bold">
          {firstChar}
        </div>

        {/* Event Name + Status */}
        <h1 className="text-[15px] text-[#E2E6FF] uppercase font-semibold flex items-center gap-2">
          {title || "Event Title"}

          <span className="text-[9px] text-[#000000] h-[13px] px-1 bg-[#B8B8B8] rounded-2xl font-normal">
            {status || "DRAFT"}
          </span>
        </h1>
      </div>

      {/* Copy Link Button */}
      <div className="absolute bottom-1 right-3">
        <button className="flex items-center gap-1 h-[17px] w-[71px] bg-white text-black text-[9px] px-2 py-1 hover:bg-white/80 transition">
          <Copy className="h-2 w-2" /> Copy Link
        </button>
      </div>

      {/* Add Banner Button */}
      <div className="absolute bottom-[70px] left-0 w-full flex justify-center">
        <Button className="h-[10px] w-[58px] rounded-2xl text-black text-[9px] bg-[#cacaca] hover:bg-gray-200 font-medium">
          Add Banner
        </Button>
      </div>
    </header>
  );
};

export default EventHeader;
