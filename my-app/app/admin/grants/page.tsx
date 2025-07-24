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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"

export default function ManageGrantsPage() {
  const [grants, setGrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGrant, setSelectedGrant] = useState(null)
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
    const token = localStorage.getItem("token")
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
    toast({
      title: "Delete Grant?",
      description: "Are you sure you want to delete this grant?",
      action: (
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={async () => {
            try {
              const token = localStorage.getItem("token")
              const res = await fetch(`${API_BASE_URL}/grants/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              })
              if (res.ok) {
                await fetchGrants()
                toast({ title: "Grant deleted!", description: "The grant was deleted successfully.", duration: 3000, position: "top-center" })
              } else {
                toast({ title: "Delete failed", description: "Failed to delete grant", duration: 3000, position: "top-center" })
              }
            } catch {
              toast({ title: "Delete failed", description: "Error deleting grant", duration: 3000, position: "top-center" })
            }
            setDeleteGrantId(null)
          }}
        >
          Confirm
        </Button>
      ),
      duration: 5000,
      position: "top-center"
    })
  }

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || grant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800"
      case "Healthcare":
        return "bg-green-100 text-green-800"
      case "Environment":
        return "bg-emerald-100 text-emerald-800"
      case "Social Sciences":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate total funding
  const totalFunding = grants.reduce((sum, grant) => sum + (Number(grant.funding) || 0), 0)

  return (
    <AdminLayout active="grants" title="Grants Management">
      <main className="p-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search grants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Grants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Grant Opportunities</CardTitle>
            <CardDescription>Manage all funding opportunities and their applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Funding</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Rejected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrants.map((grant) => (
                    <TableRow key={grant._id}>
                      <TableCell className="font-medium">{grant.title}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(grant.category)}>{grant.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">{grant.funding}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {grant.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(grant.status)}>{grant.status}</Badge>
                      </TableCell>
                      <TableCell>{grantStats[grant._id]?.applicants ?? 0}</TableCell>
                      <TableCell>{grantStats[grant._id]?.approved ?? 0}</TableCell>
                      <TableCell>{grantStats[grant._id]?.rejected ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button> */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedGrant(grant)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            {selectedGrant && (
                              <EditGrantModal grant={selectedGrant} onClose={() => setSelectedGrant(null)} onGrantChanged={fetchGrants} />
                            )}
                          </Dialog>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(grant._id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Grant Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{grants.length}</div>
              <p className="text-xs text-muted-foreground">
                {grants.filter((g) => g.status === "Active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(grantStats).reduce((sum, stat) => sum + (stat.applicants || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all grants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(grantStats).reduce((sum, stat) => sum + (stat.approved || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.values(grantStats).reduce((sum, stat) => sum + (stat.applicants || 0), 0) > 0
                  ? Math.round(
                      (Object.values(grantStats).reduce((sum, stat) => sum + (stat.approved || 0), 0) /
                        Object.values(grantStats).reduce((sum, stat) => sum + (stat.applicants || 0), 0)) *
                        100
                    )
                  : 0}
                % approval rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rejected</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRejected}</div>
              <p className="text-xs text-muted-foreground">Across all grants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFunding.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground">Available funding</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <CreateGrantModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onGrantChanged={fetchGrants}
        />
      </Dialog>
    </AdminLayout>
  )
}

function CreateGrantModal({ open, onClose, onGrantChanged }: { open: boolean; onClose: () => void; onGrantChanged: () => void }) {
  const [grantData, setGrantData] = useState({
    title: "",
    description: "",
    category: "",
    funding: "",
    deadline: "",
    requirements: "",
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async () => {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/grants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...grantData,
          funding: Number(grantData.funding),
          deadline: new Date(grantData.deadline),
        }),
      })
      if (res.ok) {
        setError("")
        toast({ title: "Grant created!", description: "The grant was created successfully.", duration: 3000, position: "top-center" })
        onGrantChanged()
        onClose()
      } else {
        const data = await res.json()
        setError(data.message || "Failed to create grant")
        toast({ title: "Create failed", description: data.message || "Failed to create grant", duration: 3000, position: "top-center" })
      }
    } catch {
      setError("Error creating grant")
      toast({ title: "Create failed", description: "Error creating grant", duration: 3000, position: "top-center" })
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Grant</DialogTitle>
        <DialogDescription>Set up a new funding opportunity</DialogDescription>
      </DialogHeader>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="grant-title">Grant Title</Label>
          <Input
            id="grant-title"
            placeholder="Enter grant title"
            value={grantData.title}
            onChange={(e) => setGrantData({ ...grantData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grant-category">Category</Label>
          <Select value={grantData.category} onValueChange={(value) => setGrantData({ ...grantData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {/* Value must match backend expectations exactly */}
              <SelectItem value="Technology">Technology & Innovation</SelectItem>
              <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
              <SelectItem value="Environment">Environment & Sustainability</SelectItem>
              <SelectItem value="Social Sciences">Social Sciences</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Others">Others</SelectItem>

            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grant-funding">Total Funding</Label>
            <Input
              id="grant-funding"
              type="number"
              placeholder="Amount in USD"
              value={grantData.funding}
              onChange={(e) => setGrantData({ ...grantData, funding: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grant-deadline">Application Deadline</Label>
            <Input
              id="grant-deadline"
              type="date"
              value={grantData.deadline}
              onChange={(e) => setGrantData({ ...grantData, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grant-description">Description</Label>
          <Textarea
            id="grant-description"
            placeholder="Describe the grant opportunity"
            rows={4}
            value={grantData.description}
            onChange={(e) => setGrantData({ ...grantData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grant-requirements">Requirements</Label>
          <Textarea
            id="grant-requirements"
            placeholder="List eligibility requirements and criteria"
            rows={3}
            value={grantData.requirements}
            onChange={(e) => setGrantData({ ...grantData, requirements: e.target.value })}
          />
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Create Grant
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function EditGrantModal({ grant, onClose, onGrantChanged }: { grant: any; onClose: () => void; onGrantChanged: () => void }) {
  const [grantData, setGrantData] = useState({
    title: grant.title,
    description: grant.description,
    category: grant.category,
    funding: grant.funding,
    deadline: grant.deadline ? grant.deadline.slice(0, 10) : "",
    requirements: grant.requirements,
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async () => {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/grants/${grant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...grantData,
          funding: Number(grantData.funding),
          deadline: new Date(grantData.deadline),
        }),
      })
      if (res.ok) {
        setError("")
        toast({ title: "Grant updated!", description: "The grant was updated successfully.", duration: 3000, position: "top-center" })
        onGrantChanged()
        onClose()
      } else {
        const data = await res.json()
        setError(data.message || "Failed to update grant")
        toast({ title: "Update failed", description: data.message || "Failed to update grant", duration: 3000, position: "top-center" })
      }
    } catch {
      setError("Error updating grant")
      toast({ title: "Update failed", description: "Error updating grant", duration: 3000, position: "top-center" })
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Grant</DialogTitle>
        <DialogDescription>Update grant information</DialogDescription>
      </DialogHeader>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-grant-title">Grant Title</Label>
          <Input
            id="edit-grant-title"
            value={grantData.title}
            onChange={(e) => setGrantData({ ...grantData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-grant-category">Category</Label>
          <Select value={grantData.category} onValueChange={(value) => setGrantData({ ...grantData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Value must match backend expectations exactly */}
              <SelectItem value="Technology">Technology & Innovation</SelectItem>
              <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
              <SelectItem value="Environment">Environment & Sustainability</SelectItem>
              <SelectItem value="Social Sciences">Social Sciences</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Others">Others</SelectItem>

            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-grant-funding">Total Funding</Label>
            <Input
              id="edit-grant-funding"
              type="number"
              value={grantData.funding}
              onChange={(e) => setGrantData({ ...grantData, funding: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-grant-deadline">Application Deadline</Label>
            <Input
              id="edit-grant-deadline"
              type="date"
              value={grantData.deadline}
              onChange={(e) => setGrantData({ ...grantData, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-grant-description">Description</Label>
          <Textarea
            id="edit-grant-description"
            rows={4}
            value={grantData.description}
            onChange={(e) => setGrantData({ ...grantData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-grant-requirements">Requirements</Label>
          <Textarea
            id="edit-grant-requirements"
            rows={3}
            value={grantData.requirements}
            onChange={(e) => setGrantData({ ...grantData, requirements: e.target.value })}
          />
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Update Grant
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
