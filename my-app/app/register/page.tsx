"use client"

import { Suspense } from "react"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Home } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authStorage } from "@/lib/auth"

function RegisterContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    department: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    institution: false,
  })
  const router = useRouter()
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value) return "First name is required"
        if (value.length < 2) return "First name must be at least 2 characters"
        if (!/^[a-zA-Z\s]+$/.test(value)) return "First name can only contain letters and spaces"
        return ""
      
      case 'lastName':
        if (!value) return "Last name is required"
        if (value.length < 2) return "Last name must be at least 2 characters"
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Last name can only contain letters and spaces"
        return ""
      
      case 'email':
        if (!value) return "Email is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
        return ""
      
      case 'password':
        if (!value) return "Password is required"
        if (value.length < 8) return "Password must be at least 8 characters"
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
        if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
        if (!/(?=.*[@$!%*?&])/.test(value)) return "Password must contain at least one special character (@$!%*?&)"
        return ""
      
      case 'confirmPassword':
        if (!value) return "Please confirm your password"
        if (value !== registerData.password) return "Passwords do not match"
        return ""
      
      case 'institution':
        if (!value) return "Institution is required"
        if (value.length < 2) return "Institution must be at least 2 characters"
        return ""
      
      default:
        return ""
    }
  }

  // Real-time validation
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateField(field, registerData[field as keyof typeof registerData])
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [registerData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'institution']
    return requiredFields.every(field => !validateField(field, registerData[field as keyof typeof registerData]))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'institution']
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, registerData[field as keyof typeof registerData])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      institution: true,
    })
    
    if (Object.keys(newErrors).length > 0) {
      toast({ 
        title: "Validation Error", 
        description: "Please fix the errors above and try again.", 
        variant: "destructive",
        duration: 4000
      })
      return
    }

    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoading(false);
        toast({ 
          title: "Registration failed", 
          description: data.message || "An error occurred during registration.", 
          variant: "destructive",
          duration: 4000
        });
        return
      }
      
      // Show success message for email verification
      setSuccess(true);
      setRegisteredEmail(registerData.email);
      setVerificationSent(true);
      toast({ 
        title: "Account created successfully!", 
        description: "Please check your email for verification link.", 
        duration: 5000
      });
      
      // Don't redirect - show verification card instead
      // setTimeout(() => {
      //   router.push("/login?message=Please verify your email before logging in");
      // }, 2000);
      
    } catch (err) {
      setLoading(false);
      toast({ 
        title: "Registration error", 
        description: "A network or server error occurred. Please try again.", 
        variant: "destructive",
        duration: 4000
      });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Home Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grant Portal</h1>
            </div>
          </div>
          <p className="text-gray-600">Join our research funding community</p>
        </div>

        {verificationSent ? (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-600">Check Your Email!</CardTitle>
              <CardDescription>We've sent a verification link to your email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Verification Email Sent</span>
                </div>
                <p className="text-blue-700 text-sm">
                  We've sent a verification link to <strong>{registeredEmail}</strong>
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the verification link in the email</li>
                    <li>• You'll be automatically logged in after verification</li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setVerificationSent(false);
                      setSuccess(false);
                      setRegisterData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        institution: "",
                        department: "",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Register Another Account
                  </Button>
                  <Link href="/login" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Get Started</CardTitle>
              <CardDescription className="text-center">Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name *</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      value={registerData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className={errors.firstName && touched.firstName ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.firstName}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name *</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={registerData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className={errors.lastName && touched.lastName ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email Address *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={registerData.email}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      placeholder="University Name"
                      value={registerData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      onBlur={() => handleBlur('institution')}
                      className={errors.institution && touched.institution ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {errors.institution && touched.institution && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.institution}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="Computer Science"
                      value={registerData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={registerData.password}
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
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={errors.confirmPassword && touched.confirmPassword ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}
