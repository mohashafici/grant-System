"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Settings,
  Users,
  FileText,
  Bell,
  Eye,
  Edit,
  Award,
  Search,
  Filter,
  UserPlus,
  Mail,
  Shield,
  Calendar,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useRouter } from "next/navigation"
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { FormError } from "@/components/ui/form-error"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  institution: string;
  department?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Mobile-friendly user card component
function MobileUserCard({ user, onView, onEdit, onDelete, getRoleColor, getStatusColor }: {
  user: User;
  onView: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="mb-3 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3 sm:space-y-4">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback className="text-xs sm:text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base truncate">{user.firstName} {user.lastName}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">Role:</span>
            <Badge className={`${getRoleColor(user.role)} text-xs mt-1`}>
              {user.role}
            </Badge>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <Badge className={`${getStatusColor(user.status || 'active')} text-xs mt-1`}>
              {user.status || 'active'}
            </Badge>
          </div>
          <div>
            <span className="text-gray-500">Institution:</span>
            <p className="font-medium truncate">{user.institution}</p>
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <p className="font-medium truncate">{user.department || 'N/A'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onView(user._id)}
            className="flex-1 h-8 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user._id)}
            className="flex-1 h-8 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(user._id)}
            className="flex-1 h-8 text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Validation functions
const validateUserField = (name: string, value: string, isEdit: boolean = false): string => {
  switch (name) {
    case 'firstName':
      if (!value.trim()) return "First name is required"
      if (value.trim().length < 2) return "First name must be at least 2 characters"
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "First name can only contain letters and spaces"
      return ""
    
    case 'lastName':
      if (!value.trim()) return "Last name is required"
      if (value.trim().length < 2) return "Last name must be at least 2 characters"
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Last name can only contain letters and spaces"
      return ""
    
    case 'email':
      if (!value.trim()) return "Email is required"
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value.trim())) return "Please enter a valid email address"
      return ""
    
    case 'password':
      if (!isEdit && !value) return "Password is required"
      if (value && value.length < 8) return "Password must be at least 8 characters"
      if (value && !/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
      if (value && !/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
      if (value && !/(?=.*\d)/.test(value)) return "Password must contain at least one number"
      if (value && !/(?=.*[@$!%*?&])/.test(value)) return "Password must contain at least one special character (@$!%*?&)"
      return ""
    
    case 'role':
      if (!value) return "Role is required"
      return ""
    
    case 'institution':
      if (!value.trim()) return "Institution is required"
      if (value.trim().length < 2) return "Institution must be at least 2 characters"
      return ""
    
    case 'department':
      if (value.trim() && value.trim().length < 2) return "Department must be at least 2 characters if provided"
      return ""
    
    case 'status':
      if (!value) return "Status is required"
      if (!['active'].includes(value)) return "Status must be active"
      return ""
    
    default:
      return ""
  }
}

function CreateUserModal({ onClose, onUserCreated }: { onClose: () => void; onUserCreated: (user: any) => void }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    institution: "",
    department: "",
    status: "active",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    role: false,
    institution: false,
    status: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Real-time validation
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateUserField(field, userData[field as keyof typeof userData])
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [userData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role', 'institution', 'status']
    return requiredFields.every(field => !validateUserField(field, userData[field as keyof typeof userData]))
  }

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'role', 'institution', 'status']
    
    fieldsToValidate.forEach(field => {
      const error = validateUserField(field, userData[field as keyof typeof userData])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
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

    setLoading(true)
    try {
      const token = authStorage.getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to create user")
      }

      const data = await res.json()
      toast({
        title: "User Created Successfully",
        description: "The user has been created successfully",
        duration: 3000
      })
      onUserCreated(data.user)
      onClose()
      router.push("/admin/users")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new user account</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={userData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={errors.firstName && touched.firstName ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={userData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={errors.lastName && touched.lastName ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={userData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={errors.email && touched.email ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={userData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={errors.password && touched.password ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.password} />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={userData.role} 
              onValueChange={(value) => handleInputChange('role', value)}
              onOpenChange={(open) => !open && handleBlur('role')}
            >
              <SelectTrigger className={errors.role && touched.role ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.role} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                placeholder="Enter institution"
                value={userData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                onBlur={() => handleBlur('institution')}
                className={errors.institution && touched.institution ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.institution} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={userData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className={errors.department && touched.department ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.department} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={userData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
              onOpenChange={(open) => !open && handleBlur('status')}
            >
              <SelectTrigger className={errors.status && touched.status ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select user status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.status} />
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <LoadingSpinner text="Creating..." />
              ) : (
                "Create User"
              )}
            </Button>
            <Button variant="outline" onClick={() => { onClose(); router.push("/admin/users") }} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function UserDetailsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const token = authStorage.getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user details")
        const data = await res.json()
        setUser(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Loading User</DialogTitle>
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading user details..." />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Error</DialogTitle>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Error loading user</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View user information</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Institution</Label>
              <p>{user.institution || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p>{user.department || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <Badge className={getStatusColor(user.status || 'active')}>{user.status || 'active'}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Joined</Label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Audit Trail Section */}
          {user.lastModifiedBy && user.lastModifiedBy.adminName && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Last Modified</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Modified by:</span>
                  <span className="text-sm font-medium">{user.lastModifiedBy.adminName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Admin email:</span>
                  <span className="text-sm">{user.lastModifiedBy.adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Modified on:</span>
                  <span className="text-sm">{new Date(user.lastModifiedBy.modifiedAt).toLocaleString()}</span>
                </div>
                
                {user.lastModifiedBy.changes && user.lastModifiedBy.changes.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Changes made:</span>
                    <div className="mt-2 space-y-1">
                      {user.lastModifiedBy.changes.map((change: any, index: number) => (
                        <div key={index} className="text-xs bg-white rounded p-2 border">
                          <span className="font-medium capitalize">{change.field === 'user_created' ? 'User Created' : change.field}:</span>
                          <span className="text-gray-500 ml-1">
                            {change.field === 'user_created' 
                              ? change.newValue 
                              : `"${change.oldValue}" → "${change.newValue}"`
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditUserModal({ userId, onClose, onUserUpdated }: { userId: string; onClose: () => void; onUserUpdated: (user: any) => void }) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    role: false,
    institution: false,
    status: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const token = authStorage.getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user details")
        const data = await res.json()
        setUserData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        })
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  // Real-time validation
  useEffect(() => {
    if (!userData) return
    
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateUserField(field, userData[field] || "", true)
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [userData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    if (!userData) return false
    const requiredFields = ['firstName', 'lastName', 'email', 'role', 'institution']
    return requiredFields.every(field => !validateUserField(field, userData[field] || "", true))
  }

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Loading User</DialogTitle>
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading user details..." />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!userData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Error</DialogTitle>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Error loading user</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleSave = async () => {
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'role', 'institution', 'status']
    
    fieldsToValidate.forEach(field => {
      const error = validateUserField(field, userData[field] || "", true)
      if (error) newErrors[field] = error
    })
    
    // Validate password if provided
    if (userData.password) {
      const passwordError = validateUserField('password', userData.password, true)
      if (passwordError) newErrors.password = passwordError
    }
    
    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      institution: true,
      status: true,
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

    setSaving(true)
    try {
      const token = authStorage.getToken()
      const updateData = { ...userData }
      
      // Remove password if empty
      if (!updateData.password) {
        delete updateData.password
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      })
      if (!res.ok) throw new Error("Failed to update user")
      const updated = await res.json()
      toast({ title: "User updated!", description: "User information updated successfully.", duration: 3000 })
      onUserUpdated(updated)
      onClose()
    } catch (error) {
      toast({ title: "Update failed", description: "Could not update user.", variant: "destructive", duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input 
                id="edit-firstName" 
                value={userData.firstName} 
                onChange={e => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={errors.firstName && touched.firstName ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last Name *</Label>
              <Input 
                id="edit-lastName" 
                value={userData.lastName} 
                onChange={e => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={errors.lastName && touched.lastName ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.lastName} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input 
              id="edit-email" 
              value={userData.email} 
              onChange={e => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={errors.email && touched.email ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password">Password</Label>
            <Input 
              id="edit-password" 
              type="password"
              placeholder="Leave blank to keep current password"
              value={userData.password || ""} 
              onChange={e => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={errors.password && touched.password ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.password} />
            <p className="text-xs text-gray-500">
              Leave blank to keep current password. If provided, must meet requirements.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role *</Label>
            <Select 
              value={userData.role} 
              onValueChange={value => handleInputChange('role', value)}
              onOpenChange={(open) => !open && handleBlur('role')}
            >
              <SelectTrigger className={errors.role && touched.role ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.role} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-institution">Institution *</Label>
              <Input 
                id="edit-institution" 
                value={userData.institution} 
                onChange={e => handleInputChange('institution', e.target.value)}
                onBlur={() => handleBlur('institution')}
                className={errors.institution && touched.institution ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.institution} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input 
                id="edit-department" 
                value={userData.department || ""} 
                onChange={e => handleInputChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className={errors.department && touched.department ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.department} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status *</Label>
            <Select 
              value={userData.status || "active"} 
              onValueChange={(value) => handleInputChange('status', value)}
              onOpenChange={() => handleBlur('status')}
            >
              <SelectTrigger className={errors.status && touched.status ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.status} />
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={saving || !isFormValid()}
            >
              {saving ? (
                <LoadingSpinner text="Saving..." />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800"
    case "reviewer":
      return "bg-blue-100 text-blue-800"
    case "researcher":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ManageUsersPage() {
  useAuthRedirect(["admin"])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const token = authStorage.getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
      
      // Show success toast for refresh operations
      if (isRefresh) {
        toast({
          title: "Refreshed!",
          description: "User list has been updated successfully.",
          duration: 2000
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      const token = authStorage.getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to delete user")
      
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully",
        duration: 3000
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
        duration: 4000
      })
    }
    setDeleteUserId(null)
  }

  const handleUserCreated = (user: any) => {
    setUsers(prev => [...prev, user])
  }

  const handleUserUpdated = async (updated: any) => {
    // Update local state immediately for instant feedback
    setUsers(prev => prev.map(user => user._id === updated._id ? updated : user))
    
    // Re-fetch users to ensure we have the most up-to-date data
    try {
      await fetchUsers()
    } catch (error) {
      console.error('Failed to refresh users after update:', error)
      // If refresh fails, we still have the updated user in local state
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institution?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <AdminLayout active="users" title="Manage Users">
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Create and manage user accounts</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              variant="outline"
              className="h-9 sm:h-10 text-xs sm:text-sm"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <Card className={`p-2 sm:p-3 md:p-4 lg:p-6 ${refreshing ? 'opacity-75' : ''}`}>
            <CardContent className="p-0">
              <div className="flex items-center">
                <Users className={`w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 ${refreshing ? 'animate-pulse' : ''}`} />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Researchers</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === "researcher").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Reviewers</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === "reviewer").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Mobile optimized */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm md:text-base h-9 sm:h-10"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="roleFilter" className="text-xs sm:text-sm">Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusFilter" className="text-xs sm:text-sm">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List - Mobile/Desktop responsive */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">All Users</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner text="Loading users..." />
              </div>
            ) : (
              <>
                {/* Mobile View */}
                {isMobile ? (
                  <div className={`p-2 sm:p-3 md:p-4 ${refreshing ? 'opacity-75 transition-opacity duration-300' : ''}`}>
                    {filteredUsers.map((user) => (
                      <MobileUserCard
                        key={user._id}
                        user={user}
                        onView={setSelectedUserId}
                        onEdit={(userId) => {
                          setSelectedUserId(userId)
                          setEditModalOpen(true)
                        }}
                        onDelete={setDeleteUserId}
                        getRoleColor={getRoleColor}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                ) : (
                  /* Desktop Table View */
                  <div className={`w-full overflow-x-auto ${refreshing ? 'opacity-75 transition-opacity duration-300' : ''}`}>
                    <Table className="w-full text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[30%]">User</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[25%]">Email</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Role</TableHead>
                          <TableHead className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[20%]">Institution</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Status</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                  <AvatarImage src={user.profileImage} />
                                  <AvatarFallback className="text-xs">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-xs sm:text-sm truncate">{user.firstName} {user.lastName}</div>
                                  <div className="text-xs text-gray-500 truncate">{user.department}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 truncate">{user.email}</TableCell>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                              <Badge className={`${getRoleColor(user.role)} text-xs whitespace-nowrap`}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 truncate">{user.institution}</TableCell>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                              <Badge className={`${getStatusColor(user.status || 'active')} text-xs whitespace-nowrap`}>
                                {user.status || 'active'}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                              <div className="flex space-x-1 sm:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUserId(user._id)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                >
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(user._id)
                                    setEditModalOpen(true)
                                  }}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeleteUserId(user._id)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Create User Modal */}
        {createModalOpen && (
          <CreateUserModal
            onClose={() => setCreateModalOpen(false)}
            onUserCreated={handleUserCreated}
          />
        )}

        {/* Edit User Modal */}
        {editModalOpen && selectedUserId && (
          <EditUserModal
            userId={selectedUserId}
            onClose={() => {
              setEditModalOpen(false)
              setSelectedUserId(null)
            }}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {/* User Details Modal */}
        {selectedUserId && !editModalOpen && (
          <UserDetailsModal
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
          />
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-md p-3 sm:p-4 md:p-6">
            <DialogHeader className="space-y-2 sm:space-y-3">
              <DialogTitle className="text-base sm:text-lg md:text-xl">Delete User</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base">
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button onClick={() => deleteUserId && handleDelete(deleteUserId)} variant="destructive" className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
                Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteUserId(null)} className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}