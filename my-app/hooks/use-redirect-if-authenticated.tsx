"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"

export function useRedirectIfAuthenticated() {
  const router = useRouter()

  useEffect(() => {
    const user = authStorage.getUser()
    const token = authStorage.getToken()

    if (user && token) {
      // Redirect based on role
      if (user.role === "admin") router.push("/admin")
      else if (user.role === "reviewer") router.push("/reviewer")
      else router.push("/researcher")
    }
  }, [router])
} 