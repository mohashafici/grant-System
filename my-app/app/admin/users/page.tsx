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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useRouter } from "next/navigation"

function CreateUserModal({ onClose, onUserCreated }: { onClose: () => void; onUserCreated: (user: any) => void }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    institution: "",
    department: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async () => {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.role || !userData.institution) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users", {
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
      })
      onUserCreated(data.user)
    onClose()
      router.push("/admin/users")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>Create a new user account</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={userData.role} onValueChange={(value) => setUserData({ ...userData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="researcher">Researcher</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              placeholder="Enter institution"
              value={userData.institution}
              onChange={(e) => setUserData({ ...userData, institution: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="Enter department"
              value={userData.department}
              onChange={(e) => setUserData({ ...userData, department: e.target.value })}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
          <Button variant="outline" onClick={() => { onClose(); router.push("/admin/users") }} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
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
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user details")
        const data = await res.json()
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  if (loading) return (
    <DialogContent>
      <DialogTitle>Loading User</DialogTitle>
      Loading...
    </DialogContent>
  )
  if (!user) return (
    <DialogContent>
      <DialogTitle>Error</DialogTitle>
      Error loading user
    </DialogContent>
  )

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>View and manage user information</DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={"/placeholder-user.jpg"} alt={user.firstName + " " + user.lastName} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRoleColor(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><span className="font-medium">Institution:</span> <span className="ml-2">{user.institution}</span></div>
              <div><span className="font-medium">Department:</span> <span className="ml-2">{user.department}</span></div>
              <div><span className="font-medium">Join Date:</span> <span className="ml-2">{user.createdAt?.slice(0,10)}</span></div>
              <div><span className="font-medium">Last Update:</span> <span className="ml-2">{user.updatedAt?.slice(0,10)}</span></div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

function EditUserModal({ userId, onClose, onUserUpdated }: { userId: string; onClose: () => void; onUserUpdated: (user: any) => void }) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user details")
        const data = await res.json()
        setUserData(data)
      } catch {
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  if (loading) return (
    <DialogContent>
      <DialogTitle>Loading User</DialogTitle>
      Loading...
    </DialogContent>
  )
  if (!userData) return (
    <DialogContent>
      <DialogTitle>Error</DialogTitle>
      Error loading user
    </DialogContent>
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(userData),
      })
      if (!res.ok) throw new Error("Failed to update user")
      const updated = await res.json()
      toast({ title: "User updated!", description: "User information updated successfully." })
      onUserUpdated(updated)
      onClose()
    } catch {
      toast({ title: "Update failed", description: "Could not update user." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>Update user information</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={userData.firstName} onChange={e => setUserData({ ...userData, firstName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={userData.lastName} onChange={e => setUserData({ ...userData, lastName: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={userData.role} onValueChange={value => setUserData({ ...userData, role: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="researcher">Researcher</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" value={userData.institution} onChange={e => setUserData({ ...userData, institution: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={userData.department} onChange={e => setUserData({ ...userData, department: e.target.value })} />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        </div>
      </div>
    </DialogContent>
  )
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-red-100 text-red-800"
    case "Reviewer":
      return "bg-blue-100 text-blue-800"
    case "Researcher":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Inactive":
      return "bg-red-100 text-red-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewUserId, setViewUserId] = useState<string | null>(null)
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        // Map backend fields to frontend format
        const mapped = data.map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
          institution: u.institution,
          department: u.department,
          status: "Active", // Placeholder, backend does not have status
          joinDate: u.createdAt ? u.createdAt.slice(0, 10) : "",
          lastLogin: u.updatedAt ? u.updatedAt.slice(0, 10) : "",
          proposals: u.activity?.proposals || 0,
          approved: u.activity?.approved || 0,
          reviews: u.activity?.reviews || 0,
          avatar: "/placeholder-user.jpg",
        }))
        setUsers(mapped)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUserUpdated = (updated: any) => {
    // If it's a newly created user, add it to the list
    if (!updated._id) {
      const newUser = {
        id: updated.id,
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        role: updated.role.charAt(0).toUpperCase() + updated.role.slice(1),
        institution: updated.institution,
        department: updated.department,
        status: "Active",
        joinDate: new Date().toISOString().slice(0, 10),
        lastLogin: new Date().toISOString().slice(0, 10),
        proposals: 0,
        approved: 0,
        reviews: 0,
        avatar: "/placeholder-user.jpg",
      }
      setUsers(prev => [newUser, ...prev])
    } else {
      // If it's an updated user, update the existing one
    setUsers(prev => prev.map(u => u.id === updated._id ? {
      ...u,
      name: `${updated.firstName} ${updated.lastName}`,
      email: updated.email,
      role: updated.role.charAt(0).toUpperCase() + updated.role.slice(1),
      institution: updated.institution,
      department: updated.department,
    } : u))
    }
  }

  return (
    <AdminLayout active="users">
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                  <p className="text-gray-600">View and manage user accounts</p>
                </div>
              </div>
              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                  </Button>
                </DialogTrigger>
                <CreateUserModal onClose={() => setCreateUserOpen(false)} onUserCreated={handleUserUpdated} />
              </Dialog>
            </div>
          </header>

          <main className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or institution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Researcher">Researcher</SelectItem>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                  Showing {filteredUsers.length} of {users.length} users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.institution}</div>
                            <div className="text-sm text-gray-500">{user.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {user.joinDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.role === "Researcher" && (
                              <span>
                                {user.proposals} proposals, {user.approved} approved
                              </span>
                            )}
                            {user.role === "Reviewer" && <span>{user.reviews || 0} reviews completed</span>}
                            {user.role === "Admin" && <span>System administrator</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={viewUserId === user.id} onOpenChange={open => !open && setViewUserId(null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setViewUserId(user.id)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              {viewUserId === user.id && <UserDetailsModal userId={user.id} onClose={() => setViewUserId(null)} />}
                            </Dialog>
                            <Dialog open={editUserId === user.id} onOpenChange={open => !open && setEditUserId(null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setEditUserId(user.id)}>
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              {editUserId === user.id && <EditUserModal userId={user.id} onClose={() => setEditUserId(null)} onUserUpdated={handleUserUpdated} />}
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* User Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter((u) => u.status === "Active").length} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Researchers</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter((u) => u.role === "Researcher").length}</div>
                  <p className="text-xs text-muted-foreground">Active researchers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviewers</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter((u) => u.role === "Reviewer").length}</div>
                  <p className="text-xs text-muted-foreground">Active reviewers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">New registrations</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  )
}
