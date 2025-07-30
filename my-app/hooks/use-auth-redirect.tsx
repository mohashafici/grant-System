"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"

export function useAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const user = authStorage.getUser()
    
    if (!user) {
      router.push("/login")
    }
  }, [router])
} 