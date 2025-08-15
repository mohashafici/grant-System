"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"

export function useAuthRedirect(roles?: string[]) {
  const router = useRouter()

  useEffect(() => {
    const user = authStorage.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    // If roles are specified, check if user has required role
    if (roles && roles.length > 0) {
      if (!roles.includes(user.role)) {
        // User doesn't have required role, show error and redirect
        console.warn(`Access denied: User role '${user.role}' is not authorized for this page`)
        
        // Redirect to appropriate page based on user role
        if (user.role === 'researcher') {
          router.push("/researcher")
        } else if (user.role === 'reviewer') {
          router.push("/reviewer")
        } else {
          router.push("/login")
        }
        return
      }
    }
  }, [router, roles])
} 