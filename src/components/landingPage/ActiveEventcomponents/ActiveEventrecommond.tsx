"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EventCardProps {
  id: string;
  title: string;
  society: string;
  img: string;
  eventUserStatus?: any;
}

export default function ActiveEventrecommond({
  id,
  title,
  society,
  img,eventUserStatus
}: EventCardProps) {
  const router = useRouter()
  return (
    <div className="group cursor-pointer mb-4 w-full" onClick={() => router.push(`/event/${id}`)}>
      {/* ✅ Card container */} 
      <div className="relative 
          w-full 
          rounded-lg 
          overflow-hidden 
          bg-card 
          border 
          border-border 
          transition-all 
          duration-300 
          hover:shadow-lg">

        {/* ✅ Image Container — fully responsive */}
        <div className="relative 
            w-full 
            h-[260px] 
            
            md:h-[320px]
            lg:h-[350px] 
            xl:h-[380px]
            2xl:h-[420px]">
          <img
            src={img || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover 
              transition-transform duration-300 
              group-hover:scale-105"
          />
        </div>
      </div>

      {/* ✅ Text Section */}
      <div className="mt-3 lg:mt-2 space-y-1">
        <div className="font-medium text-[#1a1a1a] line-clamp-2 
           group-hover:text-primary transition-colors text-[14px]">
          {title}
        </div>
        <p className="text-[11px] text-muted-foreground">{society}</p>
         {eventUserStatus?.isEnrolled && (
          <p className="text-[11px] text-green-600 font-medium">Enrolleddd</p>
        )}
      </div>
    </div>
  );
}
