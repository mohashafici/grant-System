"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"
import { AlertTriangle, Shield, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UnauthorizedAccessProps {
  requiredRole?: string
  userRole?: string
  resource?: string
}

export default function UnauthorizedAccess({ 
  requiredRole = "admin", 
  userRole, 
  resource = "this page" 
}: UnauthorizedAccessProps) {
  const router = useRouter()
  const user = userRole || authStorage.getUser()?.role

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    if (user === 'researcher') {
      router.push('/researcher')
    } else if (user === 'reviewer') {
      router.push('/reviewer')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access {resource}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Insufficient Privileges
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Your current role: <span className="font-semibold">{user || 'Unknown'}</span>
                  </p>
                  <p>
                    Required role: <span className="font-semibold">{requiredRole}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleGoBack} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={handleGoHome} 
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
