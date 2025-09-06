"use client";

import React from "react";
import { getEventRoutes } from "@/lib/eventNavigationRoute"; // your routes file
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn button
import { Separator } from "../ui/separator";

interface EventNavigationProps {
  workspaceSlug: any;
  eventSlug: any;
}

const EventNavigation: React.FC<EventNavigationProps> = ({ workspaceSlug, eventSlug }) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = getEventRoutes(workspaceSlug, eventSlug);

  return (
    <nav className="flex flex-col ml-[49px] gap-2 mt-2 bg-transparent"> {/* column & no background */}
      {routes.map((route) => {
        const isActive = route.href ? pathname === route.href : false;

        return (
          <button
            key={route.label}
           // no border, no background by default
            className={`flex items-center gap-2 px-2 justify-start text-left ${
              isActive ? "text-blue-600" : "text-gray-700"
            }`}
            onClick={() => {
              if (route.action === "navigate" && route.href) {
                router.push(route.href);
              } else if ((route.action === "function" || route.action === "dialog") && route.onClick) {
                route.onClick();
              }
            }}
          >
            <route.icon className="h-[14px] w-[14px] text-[#636363] hover:underline" />
            <span className="text-[11px] font-medium text-[#636363] hover:underline">{route.label}</span>
          </button>
        );
      })}
      <Separator className="my-2 bg-[#C9C9C9]"/>
    </nav>
  );
};

export default EventNavigation;
