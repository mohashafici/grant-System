"use client"

import type React from "react"
import { Suspense } from "react"

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated"
import { authStorage } from "@/lib/auth"

function LoginContent() {
  useRedirectIfAuthenticated()
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  // Real-time validation
  useEffect(() => {
    if (touched.email) {
      const emailError = validateEmail(loginData.email)
      setErrors(prev => ({ ...prev, email: emailError }))
    }
  }, [loginData.email, touched.email])

  useEffect(() => {
    if (touched.password) {
      const passwordError = validatePassword(loginData.password)
      setErrors(prev => ({ ...prev, password: passwordError }))
    }
  }, [loginData.password, touched.password])

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    return !validateEmail(loginData.email) && !validatePassword(loginData.password) && loginData.email && loginData.password
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const emailError = validateEmail(loginData.email)
    const passwordError = validatePassword(loginData.password)
    
    setErrors({ email: emailError, password: passwordError })
    setTouched({ email: true, password: true })
    
    if (emailError || passwordError) {
      toast({ 
        title: "Validation Error", 
        description: "Please fix the errors above and try again.", 
        variant: "destructive", 
        duration: 4000 
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        // Handle unverified email case
        if (data.requiresVerification) {
          toast({ 
            title: "Email Verification Required", 
            description: "Please check your email and click the verification link before logging in.", 
            variant: "destructive", 
            duration: 6000 
          })
          return
        }
        throw new Error(data.message || "Login failed")
      }
      
      // Save JWT and user info
      authStorage.setAuth(data.token, data.user)
      toast({ 
        title: "Login Successful!", 
        description: "Welcome back. You will be redirected shortly.", 
        duration: 2000 
      })
      
      // Redirect based on role
      const redirect = searchParams.get("redirect");
      if (redirect) router.push(redirect);
      else if (data.user.role === "admin") router.push("/admin")
      else if (data.user.role === "reviewer") router.push("/reviewer")
      else router.push("/researcher")
    } catch (err: any) {
      console.error("Login error:", err)
      toast({ 
        title: "Login Failed", 
        description: err.message || "An unexpected error occurred. Please try again.", 
        variant: "destructive", 
        duration: 4000 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo - Centered above text */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logos.jpeg" 
              alt="Mubarak Grant Portal Logo" 
              className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover shadow-lg" 
            />
          </div>
          
          {/* Text below logo */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mubarak Grant Portal</h1>
            <p className="text-gray-600 text-sm md:text-base">Access your research funding dashboard</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={errors.email && touched.email ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={errors.password && touched.password ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {errors.password && touched.password && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
