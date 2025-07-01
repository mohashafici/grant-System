"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  LogoutButton,
} from "@/components/ui/sidebar"
import { Home, FileText, Plus, Bell, User, Eye, Edit, Trash2, Award, Settings } from "lucide-react"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Draft":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return "✅"
    case "Rejected":
      return "❌"
    case "Under Review":
      return "⏳"
    case "Draft":
      return "📝"
    default:
      return "📄"
  }
}

function ResearcherSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Grant Portal</h2>
            <p className="text-xs text-muted-foreground">Researcher</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col h-full justify-between min-h-[60vh]">
          <div>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/dashboard/researcher">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/proposals">
                        <FileText className="w-4 h-4" />
                        <span>My Proposals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/submit">
                        <Plus className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/notifications">
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/profile">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/reports">
                        <FileText className="w-4 h-4" />
                        <span>Progress Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/researcher/settings">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          <div className="mb-4">
            <LogoutButton />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export default function ResearcherDashboardPage() {
  useAuthRedirect(["researcher"])
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/proposals/mine", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch proposals")
        const data = await res.json()
        setProposals(data)
      } catch (err: any) {
        setError(err.message || "Error fetching proposals")
      } finally {
        setLoading(false)
      }
    }
    fetchProposals()
  }, [])

  // Stats
  const totalProposals = proposals.length
  const approvedCount = proposals.filter((p) => p.status === "Approved").length
  const underReviewCount = proposals.filter((p) => p.status === "Under Review").length
  const rejectedCount = proposals.filter((p) => p.status === "Rejected").length
  const totalFunding = proposals
    .filter((p) => p.status === "Approved")
    .reduce((sum, p) => sum + (typeof p.funding === "number" ? p.funding : parseFloat((p.funding || "0").replace(/[^\d.]/g, ""))), 0)

  return (
    <ResearcherLayout active="dashboard">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals}</div>
            <p className="text-xs text-muted-foreground">{totalProposals > 0 ? `+${totalProposals} this year` : "No proposals yet"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="text-green-600">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalProposals > 0 ? `${Math.round((approvedCount / totalProposals) * 100)}% success rate` : "No approvals yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <div className="text-yellow-600">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting decision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="text-red-600">❌</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Rejected proposals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <div className="text-blue-600">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFunding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Approved funding</p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Proposals</h2>
          <Button variant="outline" asChild>
            <Link href="/researcher/proposals">View All</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading proposals...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid gap-6">
            {proposals.slice(0, 4).map((proposal) => (
              <Card key={proposal._id || proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription>
                        {proposal.dateSubmitted ? `Submitted: ${new Date(proposal.dateSubmitted).toLocaleDateString()}` : "Not submitted yet"} •
                        Deadline: {proposal.deadline ? new Date(proposal.deadline).toLocaleDateString() : "-"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(proposal.status)}>
                        {getStatusIcon(proposal.status)} {proposal.status}
                      </Badge>
                      <span className="text-lg font-semibold text-blue-600">
                        {typeof proposal.funding === "number"
                          ? `$${proposal.funding.toLocaleString()}`
                          : proposal.funding}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{proposal.progress}%</span>
                      </div>
                      <Progress value={proposal.progress} className="h-2" />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {proposal.status === "Draft" && (
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {proposal.status === "Draft" && (
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResearcherLayout>
  )
}
