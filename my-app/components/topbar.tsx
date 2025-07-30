"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "./notification-bell"
import { ProfileMenu } from "./profile-menu"

interface TopbarProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function Topbar({ onMenuClick, showMenuButton = false }: TopbarProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-semibold text-lg">Grant Portal</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </div>
  )
} 