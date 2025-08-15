"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { ProfileMenu } from "@/components/profile-menu"
import NotificationBell from "@/components/notification-bell";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset";

export default function AdminLayout({ active, children, title }: { active: string; children: React.ReactNode; title?: string }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const user = authStorage.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      if (user.role !== 'admin') {
        // User doesn't have admin role, redirect to appropriate page
        console.warn(`Access denied: User role '${user.role}' is not authorized for admin pages`)
        
        if (user.role === 'researcher') {
          router.push("/researcher")
        } else if (user.role === 'reviewer') {
          router.push("/reviewer")
        } else {
          router.push("/login")
        }
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminSidebar active={active} />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-400 px-3 sm:px-6 py-3 sm:py-4 flex items-center" style={{ minHeight: '56px' }}>
          <SidebarTrigger className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 border border-blue-400 text-blue-700 shadow-md mr-2 sm:mr-3 flex items-center justify-center hover:bg-blue-200 transition-colors touch-manipulation" />
          {title && <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 ml-2 sm:ml-4 truncate">{title}</h1>}
                      <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <NotificationBell />
              <ProfileMenu />
            </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 