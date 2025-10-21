/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from "react-router-dom"
import type { IMenuItem } from "@/types/global.type"

interface SidebarNavItemProps {
  item: any;
  level?: number;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuItem: React.FC<SidebarNavItemProps> = ({ item, level = 0, setSidebarOpen }) => {
  const [isExpanded, setIsExpanded] = useState(item.title === "Analytics")
  const hasSubMenu = item.submenu && item.submenu.length > 0
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false)
  }


  if (hasSubMenu) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 py-2.5 h-auto font-normal text-black hover:text-foreground hover:bg-accent transition-colors",
              level > 0 && "ml-6 text-sm"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{item.name}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.submenu?.map((child: IMenuItem) => (
            // <MenuItem key={child.title} item={child} level={level + 1} />
            <Button
              variant="ghost"
              onClick={() => handleNavigate(child?.href as string)}
              className={cn(
                "w-full justify-start gap-3 ml-6 text-sm px-3 py-2.5 h-auto font-normal text-gray-700 hover:text-foreground hover:bg-accent transition-colors ",
                level > 0 && "ml-6 text-sm", child.href === pathname ? "bg-indigo-50 border-r-2 border-l-2 border-indigo-500 text-indigo-700" : ""
              )}
            >
              <child.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{child.name}</span>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }


  return (
    <Button
      variant="ghost"
      onClick={() => handleNavigate(item.href)}
      className={cn(
        "w-full justify-start gap-3 px-3 py-2.5 h-auto font-normal text-black hover:text-foreground hover:bg-accent transition-colors ",
        level > 0 && "ml-6 text-sm", item.href === pathname ? "bg-indigo-50 border-r-2 border-l-2 border-indigo-500 text-indigo-700" : ""
      )}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 text-left">{item.name}</span>
    </Button>
  )
}

export default MenuItem