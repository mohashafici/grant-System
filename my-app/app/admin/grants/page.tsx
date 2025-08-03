"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Plus,
  Eye,
  Edit,
  Trash2,
  Award,
  Search,
  Filter,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Building,
  MapPin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { FormError } from "@/components/ui/form-error"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ManageGrantsPage() {
  useAuthRedirect(["admin"])
  const [grants, setGrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGrant, setSelectedGrant] = useState(null)
  const [viewGrant, setViewGrant] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { toast } = useToast()
  const [deleteGrantId, setDeleteGrantId] = useState<string | null>(null)
  const [grantStats, setGrantStats] = useState({}) // { [grantId]: { applicants, approved, rejected } }
  const [totalRejected, setTotalRejected] = useState(0)

  useEffect(() => {
    fetchGrants()
  }, [])

  useEffect(() => {
    if (grants.length > 0) {
      fetchAllGrantStats()
    }
  }, [grants])

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchGrants = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/grants`)
      const data = await res.json()
      setGrants(data)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllGrantStats = async () => {
    const token = authStorage.getToken()
    let stats = {}
    let rejectedSum = 0
    await Promise.all(grants.map(async (grant) => {
      const res = await fetch(`${API_BASE_URL}/proposals/grant/${grant._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const proposals = await res.json()
      const applicants = proposals.length
      const approved = proposals.filter(p => p.status === "Approved").length
      const rejected = proposals.filter(p => p.status === "Rejected").length
      stats[grant._id] = { applicants, approved, rejected }
      rejectedSum += rejected
    }))
    setGrantStats(stats)
    setTotalRejected(rejectedSum)
  }

  const handleDelete = (id) => {
    setDeleteGrantId(id)
  }

  const confirmDelete = async () => {
    if (!deleteGrantId) return
    try {
      const token = authStorage.getToken()
      const res = await fetch(`${API_BASE_URL}/grants/${deleteGrantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast({ title: "Grant deleted!", description: "The grant was deleted successfully.", duration: 3000 })
        fetchGrants()
      } else {
        toast({ title: "Delete failed", description: "Failed to delete grant", duration: 3000 })
      }
    } catch (err) {
      toast({ title: "Delete failed", description: "Error deleting grant", duration: 3000 })
    }
    setDeleteGrantId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800"
      case "Healthcare":
        return "bg-red-100 text-red-800"
      case "Environment":
        return "bg-green-100 text-green-800"
      case "Social Sciences":
        return "bg-purple-100 text-purple-800"
      case "Education":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Handle status filtering with proper mapping
    let matchesStatus = true
    if (statusFilter === "all") {
      matchesStatus = true
    } else if (statusFilter === "Open") {
      matchesStatus = grant.status === "Active"
    } else if (statusFilter === "Closed") {
      matchesStatus = grant.status === "Closed"
    }
    
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Grants</h1>
            <p className="text-gray-600">Create and manage funding opportunities</p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Grant
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Grants</p>
                  <p className="text-2xl font-bold text-gray-900">{grants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Grants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grants.filter(g => g.status === "Active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(grantStats).reduce((sum: number, stat: any) => sum + stat.applicants, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trash2 className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Closed Grants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grants.filter(g => g.status === "Closed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search grants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Active</SelectItem>
                    <SelectItem value="Closed">Close</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grants Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Grants</CardTitle>
            <CardDescription>Manage your funding opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner text="Loading grants..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrants.map((grant) => (
                      <TableRow key={grant._id}>
                        <TableCell className="font-medium">{grant.title}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(grant.category)}>
                            {grant.category}
                          </Badge>
                        </TableCell>
                        <TableCell>${grant.funding?.toLocaleString()}</TableCell>
                        <TableCell>{new Date(grant.deadline).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(grant.status)}>
                            {grant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {grantStats[grant._id]?.applicants || 0}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewGrant(grant)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedGrant(grant)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(grant._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Grant Modal */}
        {createModalOpen && (
          <CreateGrantModal
            onClose={() => setCreateModalOpen(false)}
            onGrantChanged={fetchGrants}
          />
        )}

        {/* View Grant Modal */}
        {viewGrant && (
          <ViewGrantModal
            grant={viewGrant}
            onClose={() => setViewGrant(null)}
          />
        )}

        {/* Edit Grant Modal */}
        {selectedGrant && (
          <EditGrantModal
            grant={selectedGrant}
            onClose={() => setSelectedGrant(null)}
            onGrantChanged={fetchGrants}
          />
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deleteGrantId} onOpenChange={() => setDeleteGrantId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Grant</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this grant? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3">
              <Button onClick={confirmDelete} variant="destructive">
                Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteGrantId(null)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

// Validation functions
const validateGrantField = (name: string, value: string): string => {
  switch (name) {
    case 'title':
      if (!value.trim()) return "Title is required"
      if (value.trim().length < 5) return "Title must be at least 5 characters"
      if (/^\d+$/.test(value.trim())) return "Title cannot be only numbers"
      return ""
    
    case 'description':
      if (!value.trim()) return "Description is required"
      if (value.trim().length < 20) return "Description must be at least 20 characters"
      if (/^\d+$/.test(value.trim())) return "Description cannot be only numbers"
      return ""
    
    case 'requirements':
      if (!value.trim()) return "Requirements are required"
      if (value.trim().length < 10) return "Requirements must be at least 10 characters"
      if (/^\d+$/.test(value.trim())) return "Requirements cannot be only numbers"
      return ""
    
    case 'funding':
      if (!value) return "Funding amount is required"
      const fundingNum = Number(value)
      if (isNaN(fundingNum)) return "Funding must be a valid number"
      if (fundingNum <= 0) return "Funding must be greater than 0"
      if (fundingNum < 100) return "Funding must be at least $100"
      return ""
    
    case 'deadline':
      if (!value) return "Deadline is required"
      const deadlineDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadlineDate < today) return "Deadline cannot be in the past"
      return ""
    
    case 'category':
      if (!value) return "Category is required"
      return ""
    
    default:
      return ""
  }
}

function CreateGrantModal({ onClose, onGrantChanged }: { onClose: () => void; onGrantChanged: () => void }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [grantData, setGrantData] = useState({
    title: "",
    description: "",
    category: "",
    funding: "",
    deadline: "",
    requirements: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    title: false,
    description: false,
    category: false,
    funding: false,
    deadline: false,
    requirements: false,
  })
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Real-time validation
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateGrantField(field, grantData[field as keyof typeof grantData])
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [grantData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setGrantData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    const requiredFields = ['title', 'description', 'category', 'funding', 'deadline', 'requirements']
    return requiredFields.every(field => !validateGrantField(field, grantData[field as keyof typeof grantData]))
  }

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    const fieldsToValidate = ['title', 'description', 'category', 'funding', 'deadline', 'requirements']
    
    fieldsToValidate.forEach(field => {
      const error = validateGrantField(field, grantData[field as keyof typeof grantData])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    setTouched({
      title: true,
      description: true,
      category: true,
      funding: true,
      deadline: true,
      requirements: true,
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
    try {
      const token = authStorage.getToken();
      const payload = {
        ...grantData,
        funding: Number(grantData.funding),
        deadline: new Date(grantData.deadline).toISOString(),
      };
      const res = await fetch(`${API_BASE_URL}/grants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      let data = null;
      try { data = await res.clone().json(); } catch {}
      if (res.ok) {
        toast({ title: "Grant created!", description: "The grant was created successfully.", duration: 3000 });
        onGrantChanged();
        onClose();
        setGrantData({
          title: "",
          description: "",
          category: "",
          funding: "",
          deadline: "",
          requirements: "",
        });
        setErrors({})
        setTouched({
          title: false,
          description: false,
          category: false,
          funding: false,
          deadline: false,
          requirements: false,
        })
      } else {
        toast({ title: "Create failed", description: (data && data.message) || "Failed to create grant", variant: "destructive", duration: 4000 });
      }
    } catch (err) {
      toast({ title: "Create failed", description: "Error creating grant", variant: "destructive", duration: 4000 });
    } finally {
      setLoading(false);
    }
  }

  // Get minimum date for deadline (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Grant</DialogTitle>
          <DialogDescription>Set up a new funding opportunity</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grant-title">Grant Title *</Label>
            <Input
              id="grant-title"
              placeholder="Enter grant title"
              value={grantData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={errors.title && touched.title ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-category">Category *</Label>
            <Select 
              value={grantData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              onOpenChange={(open) => !open && handleBlur('category')}
            >
              <SelectTrigger className={errors.category && touched.category ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology & Innovation</SelectItem>
                <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
                <SelectItem value="Environment">Environment & Sustainability</SelectItem>
                <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.category} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grant-funding">Total Funding (USD) *</Label>
              <Input
                id="grant-funding"
                type="number"
                min="100"
                placeholder="Amount in USD"
                value={grantData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                onBlur={() => handleBlur('funding')}
                className={errors.funding && touched.funding ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.funding} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-deadline">Application Deadline *</Label>
              <Input
                id="grant-deadline"
                type="date"
                min={getMinDate()}
                value={grantData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                onBlur={() => handleBlur('deadline')}
                className={errors.deadline && touched.deadline ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.deadline} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-description">Description *</Label>
            <Textarea
              id="grant-description"
              placeholder="Describe the grant opportunity"
              rows={4}
              value={grantData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={errors.description && touched.description ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-requirements">Requirements *</Label>
            <Textarea
              id="grant-requirements"
              placeholder="List eligibility requirements and criteria"
              rows={3}
              value={grantData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              onBlur={() => handleBlur('requirements')}
              className={errors.requirements && touched.requirements ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.requirements} />
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
                "Create Grant"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(false);
                setErrors({});
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditGrantModal({ grant, onClose, onGrantChanged }: { grant: any; onClose: () => void; onGrantChanged: () => void }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [grantData, setGrantData] = useState({
    title: grant.title,
    description: grant.description,
    category: grant.category,
    funding: grant.funding?.toString() || "",
    deadline: grant.deadline ? new Date(grant.deadline).toISOString().split('T')[0] : "",
    requirements: grant.requirements,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    title: false,
    description: false,
    category: false,
    funding: false,
    deadline: false,
    requirements: false,
  })
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Real-time validation
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateGrantField(field, grantData[field as keyof typeof grantData])
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [grantData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setGrantData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isFormValid = () => {
    const requiredFields = ['title', 'description', 'category', 'funding', 'deadline', 'requirements']
    return requiredFields.every(field => !validateGrantField(field, grantData[field as keyof typeof grantData]))
  }

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    const fieldsToValidate = ['title', 'description', 'category', 'funding', 'deadline', 'requirements']
    
    fieldsToValidate.forEach(field => {
      const error = validateGrantField(field, grantData[field as keyof typeof grantData])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    setTouched({
      title: true,
      description: true,
      category: true,
      funding: true,
      deadline: true,
      requirements: true,
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
    try {
      const token = authStorage.getToken();
      const payload = {
        ...grantData,
        funding: Number(grantData.funding),
        deadline: new Date(grantData.deadline).toISOString(),
      };
      const res = await fetch(`${API_BASE_URL}/grants/${grant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      let data = null;
      try { data = await res.clone().json(); } catch {}
      if (res.ok) {
        toast({ title: "Grant updated!", description: "The grant was updated successfully.", duration: 3000 });
        onGrantChanged();
        onClose();
      } else {
        toast({ title: "Update failed", description: (data && data.message) || "Failed to update grant", variant: "destructive", duration: 4000 });
      }
    } catch (err) {
      toast({ title: "Update failed", description: "Error updating grant", variant: "destructive", duration: 4000 });
    } finally {
      setLoading(false);
    }
  }

  // Get minimum date for deadline (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Grant</DialogTitle>
          <DialogDescription>Update the grant information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-grant-title">Grant Title *</Label>
            <Input
              id="edit-grant-title"
              placeholder="Enter grant title"
              value={grantData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={errors.title && touched.title ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-grant-category">Category *</Label>
            <Select 
              value={grantData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              onOpenChange={(open) => !open && handleBlur('category')}
            >
              <SelectTrigger className={errors.category && touched.category ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology & Innovation</SelectItem>
                <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
                <SelectItem value="Environment">Environment & Sustainability</SelectItem>
                <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.category} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-grant-funding">Total Funding (USD) *</Label>
              <Input
                id="edit-grant-funding"
                type="number"
                min="100"
                placeholder="Amount in USD"
                value={grantData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                onBlur={() => handleBlur('funding')}
                className={errors.funding && touched.funding ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.funding} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-grant-deadline">Application Deadline *</Label>
              <Input
                id="edit-grant-deadline"
                type="date"
                min={getMinDate()}
                value={grantData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                onBlur={() => handleBlur('deadline')}
                className={errors.deadline && touched.deadline ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.deadline} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-grant-description">Description *</Label>
            <Textarea
              id="edit-grant-description"
              placeholder="Describe the grant opportunity"
              rows={4}
              value={grantData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={errors.description && touched.description ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-grant-requirements">Requirements *</Label>
            <Textarea
              id="edit-grant-requirements"
              placeholder="List eligibility requirements and criteria"
              rows={3}
              value={grantData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              onBlur={() => handleBlur('requirements')}
              className={errors.requirements && touched.requirements ? "border-red-500 focus:border-red-500" : ""}
            />
            <FormError error={errors.requirements} />
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <LoadingSpinner text="Updating..." />
              ) : (
                "Update Grant"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(false);
                setErrors({});
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// View Grant Modal Component
function ViewGrantModal({ grant, onClose }: { grant: any; onClose: () => void }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [grantDetails, setGrantDetails] = useState(grant);
  const [loading, setLoading] = useState(false);
  const [applicantStats, setApplicantStats] = useState({ applicants: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchGrantDetails();
    fetchApplicantStats();
  }, [grant._id]);

  const fetchGrantDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/grants/${grant._id}`);
      if (res.ok) {
        const data = await res.json();
        setGrantDetails(data);
      }
    } catch (error) {
      console.error('Error fetching grant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantStats = async () => {
    try {
      const token = authStorage.getToken();
      const res = await fetch(`${API_BASE_URL}/proposals/grant/${grant._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const proposals = await res.json();
        const stats = {
          applicants: proposals.length,
          approved: proposals.filter((p: any) => p.status === 'approved').length,
          rejected: proposals.filter((p: any) => p.status === 'rejected').length
        };
        setApplicantStats(stats);
      }
    } catch (error) {
      console.error('Error fetching applicant stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'bg-blue-100 text-blue-800';
      case 'Healthcare': return 'bg-green-100 text-green-800';
      case 'Environment': return 'bg-emerald-100 text-emerald-800';
      case 'Social Sciences': return 'bg-purple-100 text-purple-800';
      case 'Education': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Grant Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this grant opportunity
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner text="Loading grant details..." />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{grantDetails.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getCategoryColor(grantDetails.category)}>
                      {grantDetails.category}
                    </Badge>
                    <Badge className={getStatusColor(grantDetails.status)}>
                      {grantDetails.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <Building className="w-4 h-4 inline mr-1" />
                    {grantDetails.organization || 'Organization not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ${grantDetails.funding?.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Total Funding</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                      <p className="text-2xl font-bold text-gray-900">{applicantStats.applicants}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-gray-900">{applicantStats.approved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold text-gray-900">{applicantStats.rejected}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Application Deadline:</span>
                    <span className="text-sm font-semibold">
                      {new Date(grantDetails.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Created:</span>
                    <span className="text-sm font-semibold">
                      {new Date(grantDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                    <span className="text-sm font-semibold">
                      {new Date(grantDetails.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Funding Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Funding:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${grantDetails.funding?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Currency:</span>
                    <span className="text-sm font-semibold">USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <Badge className={getStatusColor(grantDetails.status)}>
                      {grantDetails.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {grantDetails.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {grantDetails.requirements || 'No requirements specified.'}
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {grantDetails.contactEmail && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <a 
                        href={`mailto:${grantDetails.contactEmail}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {grantDetails.contactEmail}
                      </a>
                    </div>
                    {grantDetails.contactPhone && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <a 
                          href={`tel:${grantDetails.contactPhone}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {grantDetails.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  // This would open the edit modal - you might want to add a state for this
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Edit Grant
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}