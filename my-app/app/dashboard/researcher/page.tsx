"use client"
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

const proposals = [
  {
    id: 1,
    title: "AI-Powered Medical Diagnosis System",
    status: "Under Review",
    dateSubmitted: "2024-01-15",
    deadline: "2024-03-15",
    funding: "$75,000",
    progress: 75,
  },
  {
    id: 2,
    title: "Sustainable Energy Storage Solutions",
    status: "Draft",
    dateSubmitted: null,
    deadline: "2024-04-20",
    funding: "$50,000",
    progress: 30,
  },
  {
    id: 3,
    title: "Quantum Computing Applications",
    status: "Approved",
    dateSubmitted: "2023-11-20",
    deadline: "2024-01-30",
    funding: "$100,000",
    progress: 100,
  },
  {
    id: 4,
    title: "Climate Change Modeling",
    status: "Rejected",
    dateSubmitted: "2023-12-10",
    deadline: "2024-02-15",
    funding: "$60,000",
    progress: 100,
  },
]

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

export default function ResearcherDashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ResearcherSidebar />
        <div className="flex flex-col flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome back, Dr. Sarah Johnson</p>
                </div>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/researcher/submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Proposal
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 w-full max-w-none">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <div className="text-green-600">✅</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">25% success rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <div className="text-yellow-600">⏳</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Awaiting decision</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                  <div className="text-blue-600">💰</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$100K</div>
                  <p className="text-xs text-muted-foreground">Approved funding</p>
                </CardContent>
              </Card>
            </div>

            {/* Proposals Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Proposals</h2>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/researcher/proposals">View All</Link>
                </Button>
              </div>

              <div className="grid gap-6">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription>
                            {proposal.dateSubmitted ? `Submitted: ${proposal.dateSubmitted}` : "Not submitted yet"} •
                            Deadline: {proposal.deadline}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusIcon(proposal.status)} {proposal.status}
                          </Badge>
                          <span className="text-lg font-semibold text-blue-600">{proposal.funding}</span>
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
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
