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

// Mobile-friendly grant card component
function MobileGrantCard({ grant, grantStats, onView, onEdit, onDelete, getStatusColor, getCategoryColor }: {
  grant: any;
  grantStats: any;
  onView: (grant: any) => void;
  onEdit: (grant: any) => void;
  onDelete: (grantId: string) => void;
  getStatusColor: (status: string) => string;
  getCategoryColor: (category: string) => string;
}) {
  return (
    <Card className="mb-3 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">{grant.title}</h3>
          </div>
          <Badge className={`${getStatusColor(grant.status)} text-xs whitespace-nowrap flex-shrink-0`}>
            {grant.status}
          </Badge>
        </div>

        {/* Category and Funding */}
        <div className="flex items-center justify-between">
          <Badge className={`${getCategoryColor(grant.category)} text-xs`}>
            {grant.category}
          </Badge>
          <div className="text-right">
            <div className="text-sm sm:text-base font-semibold text-blue-600">
              ${grant.funding?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Funding</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">Deadline:</span>
            <p className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Applicants:</span>
            <p className="font-medium">{grantStats[grant._id]?.applicants || 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onView(grant)}
            className="flex-1 h-8 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(grant)}
            className="flex-1 h-8 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(grant._id)}
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

interface Grant {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  funding: number;
  deadline: string;
  organization?: string;
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
}

interface GrantStats {
  applicants: number;
  approved: number;
  rejected: number;
}

export default function ManageGrantsPage() {
  useAuthRedirect()
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [viewGrant, setViewGrant] = useState<Grant | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const [deleteGrantId, setDeleteGrantId] = useState<string | null>(null)
  const [grantStats, setGrantStats] = useState<Record<string, GrantStats>>({})
  const [totalRejected, setTotalRejected] = useState(0)

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
    let stats: Record<string, GrantStats> = {}
    let rejectedSum = 0

    for (const grant of grants) {
      try {
        const proposalsRes = await fetch(`${API_BASE_URL}/proposals/grant/${grant._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (proposalsRes.ok) {
          const proposals = await proposalsRes.json()
      const applicants = proposals.length
          const approved = proposals.filter((p: any) => p.status === "Approved").length
          const rejected = proposals.filter((p: any) => p.status === "Rejected").length
          
      stats[grant._id] = { applicants, approved, rejected }
      rejectedSum += rejected
        }
      } catch (error) {
        console.error(`Error fetching stats for grant ${grant._id}:`, error)
        stats[grant._id] = { applicants: 0, approved: 0, rejected: 0 }
      }
    }
    
    setGrantStats(stats)
    setTotalRejected(rejectedSum)
  }

  const handleDelete = (id: string) => {
    setDeleteGrantId(id)
  }

  const confirmDelete = async () => {
    if (!deleteGrantId) return

    try {
      const token = authStorage.getToken()
      const res = await fetch(`${API_BASE_URL}/grants/${deleteGrantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        toast({
          title: "Grant Deleted",
          description: "The grant has been successfully deleted.",
        })
        fetchGrants()
      } else {
        const errorData = await res.json().catch(() => ({}))
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete the grant. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Delete grant error:', error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the grant.",
        variant: "destructive",
      })
    } finally {
      setDeleteGrantId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
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
      case "Education":
        return "bg-orange-100 text-orange-800"
      case "Arts":
        return "bg-purple-100 text-purple-800"
      case "Science":
        return "bg-indigo-100 text-indigo-800"
      case "Social Impact":
        return "bg-pink-100 text-pink-800"
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading grants...</p>
      </div>
    </div>
  )

  return (
    <AdminLayout active="grants" title="Manage Grants">
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Manage Grants</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Create and manage funding opportunities</p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Create Grant
          </Button>
        </div>

        {/* Stats Cards - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Grants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{grants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Grants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {grants.filter(g => g.status === "Active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {Object.values(grantStats).reduce((sum: number, stat: any) => sum + stat.applicants, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 p-2 sm:p-3 md:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center">
                <Trash2 className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
                <div className="ml-2 sm:ml-3 md:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Closed Grants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {grants.filter(g => g.status === "Closed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Mobile optimized */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <Input
                    placeholder="Search grants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 text-xs sm:text-sm md:text-base h-9 sm:h-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grants List - Mobile/Desktop responsive */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">All Grants</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">Manage your funding opportunities</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner text="Loading grants..." />
              </div>
            ) : (
              <>
                {/* Mobile View */}
                {isMobile ? (
                  <div className="p-2 sm:p-3 md:p-4">
                    {filteredGrants.map((grant) => (
                      <MobileGrantCard
                        key={grant._id}
                        grant={grant}
                        grantStats={grantStats}
                        onView={setViewGrant}
                        onEdit={setSelectedGrant}
                        onDelete={handleDelete}
                        getStatusColor={getStatusColor}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                ) : (
                  /* Desktop Table View */
                  <div className="w-full overflow-x-auto">
                  <Table className="w-full text-xs sm:text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[30%]">Title</TableHead>
                        <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Category</TableHead>
                        <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Funding</TableHead>
                        <TableHead className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Deadline</TableHead>
                        <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%] sm:w-[10%]">Status</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Applicants</TableHead>
                        <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrants.map((grant) => (
                        <TableRow key={grant._id}>
                          <TableCell className="font-medium text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                            {grant.title}
                          </TableCell>
                          <TableCell className="px-2 md:px-4 py-2 md:py-3">
                            <Badge className={`${getCategoryColor(grant.category)} text-xs whitespace-nowrap`}>
                              {grant.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">${grant.funding?.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{new Date(grant.deadline).toLocaleDateString()}</TableCell>
                          <TableCell className="px-2 md:px-4 py-2 md:py-3">
                            <Badge className={`${getStatusColor(grant.status)} text-xs whitespace-nowrap`}>
                              {grant.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                            {grantStats[grant._id]?.applicants || 0}
                          </TableCell>
                          <TableCell className="px-2 md:px-4 py-2 md:py-3">
                            <div className="flex flex-row gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewGrant(grant)}
                                className="text-xs h-7 w-7 md:h-8 md:w-auto md:px-2 md:px-3 p-0"
                              >
                                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden md:inline md:ml-1">View</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedGrant(grant)}
                                className="text-xs h-7 w-7 md:h-8 md:w-auto md:px-2 md:px-3 p-0"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden md:inline md:ml-1">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(grant._id)}
                                className="text-xs h-7 w-7 md:h-8 md:w-auto md:px-2 md:px-3 p-0"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden md:inline md:ml-1">Delete</span>
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
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-md p-3 sm:p-4 md:p-6">
            <DialogHeader className="space-y-2 sm:space-y-3">
              <DialogTitle className="text-base sm:text-lg md:text-xl">Delete Grant</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base">
                Are you sure you want to delete this grant? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button onClick={confirmDelete} variant="destructive" className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
                Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteGrantId(null)} className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
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
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-base sm:text-lg md:text-xl">Create New Grant</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm md:text-base">Set up a new funding opportunity</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grant-title" className="text-xs sm:text-sm md:text-base">Grant Title *</Label>
            <Input
              id="grant-title"
              placeholder="Enter grant title"
              value={grantData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`text-xs sm:text-sm ${errors.title && touched.title ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <FormError error={errors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-category" className="text-xs sm:text-sm md:text-base">Category *</Label>
            <Select 
              value={grantData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              onOpenChange={(open) => !open && handleBlur('category')}
            >
              <SelectTrigger className={`text-xs sm:text-sm ${errors.category && touched.category ? "border-red-500 focus:border-red-500" : ""}`}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="grant-funding" className="text-xs sm:text-sm md:text-base">Total Funding (USD) *</Label>
              <Input
                id="grant-funding"
                type="number"
                min="100"
                placeholder="Amount in USD"
                value={grantData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                onBlur={() => handleBlur('funding')}
                className={`text-xs sm:text-sm ${errors.funding && touched.funding ? "border-red-500 focus:border-red-500" : ""}`}
              />
              <FormError error={errors.funding} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-deadline" className="text-xs sm:text-sm md:text-base">Application Deadline *</Label>
              <Input
                id="grant-deadline"
                type="date"
                min={getMinDate()}
                value={grantData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                onBlur={() => handleBlur('deadline')}
                className={`text-xs sm:text-sm ${errors.deadline && touched.deadline ? "border-red-500 focus:border-red-500" : ""}`}
              />
              <FormError error={errors.deadline} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-description" className="text-xs sm:text-sm md:text-base">Description *</Label>
            <Textarea
              id="grant-description"
              placeholder="Describe the grant opportunity"
              rows={4}
              value={grantData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`text-xs sm:text-sm min-h-[80px] sm:min-h-[100px] resize-none ${errors.description && touched.description ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <FormError error={errors.description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-requirements" className="text-xs sm:text-sm md:text-base">Requirements *</Label>
            <Textarea
              id="grant-requirements"
              placeholder="List eligibility requirements and criteria"
              rows={3}
              value={grantData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              onBlur={() => handleBlur('requirements')}
              className={`text-xs sm:text-sm min-h-[60px] sm:min-h-[80px] resize-none ${errors.requirements && touched.requirements ? "border-red-500 focus:border-red-500" : ""}`}
            />
            <FormError error={errors.requirements} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm" 
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
              className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm"
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
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Grant Details
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm md:text-base">
            View complete information about this grant opportunity
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner text="Loading grant details..." />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">{grantDetails.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={`${getCategoryColor(grantDetails.category)} text-xs sm:text-sm`}>
                      {grantDetails.category}
                    </Badge>
                    <Badge className={`${getStatusColor(grantDetails.status)} text-xs sm:text-sm`}>
                      {grantDetails.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    {grantDetails.organization || 'Organization not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    ${grantDetails.funding?.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">Total Funding</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applicants</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{applicantStats.applicants}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{applicantStats.approved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{applicantStats.rejected}</p>
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