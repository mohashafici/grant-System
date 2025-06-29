"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Settings,
  Users,
  FileText,
  Bell,
  Award,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"

const evaluationReports = [
  {
    id: 1,
    title: "Q1 2024 Grant Evaluation Report",
    period: "January - March 2024",
    totalProposals: 45,
    approved: 12,
    rejected: 28,
    pending: 5,
    totalFunding: "$1,250,000",
    averageScore: 6.8,
    generatedDate: "2024-04-01",
    status: "Final",
  },
  {
    id: 2,
    title: "Technology Grants Analysis 2024",
    period: "January - December 2024",
    totalProposals: 78,
    approved: 23,
    rejected: 45,
    pending: 10,
    totalFunding: "$2,100,000",
    averageScore: 7.2,
    generatedDate: "2024-01-15",
    status: "Draft",
  },
  {
    id: 3,
    title: "Healthcare Research Funding Report",
    period: "2023 Annual",
    totalProposals: 32,
    approved: 18,
    rejected: 14,
    pending: 0,
    totalFunding: "$1,800,000",
    averageScore: 7.9,
    generatedDate: "2024-01-05",
    status: "Final",
  },
]

const monthlyData = [
  { month: "Jan", proposals: 15, approved: 4, funding: 420000 },
  { month: "Feb", proposals: 18, approved: 5, funding: 380000 },
  { month: "Mar", proposals: 12, approved: 3, funding: 450000 },
  { month: "Apr", proposals: 22, approved: 7, funding: 620000 },
  { month: "May", proposals: 19, approved: 6, funding: 540000 },
  { month: "Jun", proposals: 16, approved: 4, funding: 480000 },
]

const categoryData = [
  { name: "Technology", value: 35, funding: 1200000, color: "#3B82F6" },
  { name: "Healthcare", value: 28, funding: 980000, color: "#10B981" },
  { name: "Environment", value: 22, funding: 750000, color: "#F59E0B" },
  { name: "Social Sciences", value: 15, funding: 420000, color: "#EF4444" },
]

const reviewerPerformance = [
  {
    id: 1,
    name: "Prof. David Martinez",
    reviewsCompleted: 12,
    averageScore: 7.8,
    onTimeRate: 95,
    expertise: "AI & Machine Learning",
  },
  {
    id: 2,
    name: "Dr. Lisa Zhang",
    reviewsCompleted: 18,
    averageScore: 7.2,
    onTimeRate: 88,
    expertise: "Computer Science",
  },
  {
    id: 3,
    name: "Prof. Robert Kim",
    reviewsCompleted: 8,
    averageScore: 8.1,
    onTimeRate: 100,
    expertise: "Environmental Science",
  },
  {
    id: 4,
    name: "Dr. Maria Santos",
    reviewsCompleted: 15,
    averageScore: 7.5,
    onTimeRate: 92,
    expertise: "Healthcare Technology",
  },
]

function ReportDetailsModal({ report, onClose }: { report: any; onClose: () => void }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{report.title}</DialogTitle>
        <DialogDescription>
          Generated on {report.generatedDate} • Period: {report.period}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Report Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Total Proposals:</span>
                <span className="ml-2 text-2xl font-bold text-blue-600">{report.totalProposals}</span>
              </div>
              <div>
                <span className="font-medium">Total Funding:</span>
                <span className="ml-2 text-2xl font-bold text-green-600">{report.totalFunding}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{report.approved}</div>
                <div className="text-sm text-green-700">Approved</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{report.rejected}</div>
                <div className="text-sm text-red-700">Rejected</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{report.pending}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="font-medium">Approval Rate:</span>
                <span className="ml-2 text-lg font-bold">
                  {Math.round((report.approved / report.totalProposals) * 100)}%
                </span>
              </div>
              <div>
                <span className="font-medium">Average Score:</span>
                <span className="ml-2 text-lg font-bold">{report.averageScore}/10</span>
              </div>
              <div>
                <span className="font-medium">Avg. Funding:</span>
                <span className="ml-2 text-lg font-bold">
                  $
                  {Math.round(
                    Number.parseInt(report.totalFunding.replace(/[$,]/g, "")) / report.approved,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function AdminReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState(null)

  const filteredReports = evaluationReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Final":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout active="reports">
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Evaluation Reports</h1>
                  <p className="text-gray-600">Comprehensive analysis and reporting on grant evaluations</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </header>

          <main className="p-6">
            <Tabs defaultValue="reports" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search reports..."
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
                      <SelectItem value="Final">Final</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reports Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Reports</CardTitle>
                    <CardDescription>Generated reports and analysis documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Title</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Proposals</TableHead>
                          <TableHead>Approved</TableHead>
                          <TableHead>Total Funding</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.title}</TableCell>
                            <TableCell>{report.period}</TableCell>
                            <TableCell>{report.totalProposals}</TableCell>
                            <TableCell>
                              <span className="font-semibold text-green-600">{report.approved}</span>
                              <span className="text-gray-500">
                                /{report.totalProposals} ({Math.round((report.approved / report.totalProposals) * 100)}
                                %)
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold text-blue-600">{report.totalFunding}</TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                {report.generatedDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  {selectedReport && (
                                    <ReportDetailsModal
                                      report={selectedReport}
                                      onClose={() => setSelectedReport(null)}
                                    />
                                  )}
                                </Dialog>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Analytics Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Proposal Trends</CardTitle>
                      <CardDescription>Proposal submissions and approvals over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="proposals" fill="#3B82F6" name="Proposals" />
                          <Bar dataKey="approved" fill="#10B981" name="Approved" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Funding by Category</CardTitle>
                      <CardDescription>Distribution of funding across research categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="funding"
                            label={({ name, value }) => `${name}: $${(value / 1000000).toFixed(1)}M`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Funding Trends</CardTitle>
                    <CardDescription>Monthly funding allocation trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${(value / 1000).toLocaleString()}K`} />
                        <Line type="monotone" dataKey="funding" stroke="#10B981" strokeWidth={2} name="Funding" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {/* Reviewer Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reviewer Performance</CardTitle>
                    <CardDescription>Performance metrics for active reviewers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reviewer</TableHead>
                          <TableHead>Expertise</TableHead>
                          <TableHead>Reviews Completed</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>On-Time Rate</TableHead>
                          <TableHead>Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviewerPerformance.map((reviewer) => (
                          <TableRow key={reviewer.id}>
                            <TableCell className="font-medium">{reviewer.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{reviewer.expertise}</Badge>
                            </TableCell>
                            <TableCell>{reviewer.reviewsCompleted}</TableCell>
                            <TableCell>
                              <div className="text-lg font-bold text-blue-600">{reviewer.averageScore}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="font-semibold">{reviewer.onTimeRate}%</span>
                                {reviewer.onTimeRate >= 95 ? (
                                  <CheckCircle className="w-4 h-4 ml-1 text-green-600" />
                                ) : reviewer.onTimeRate >= 85 ? (
                                  <Clock className="w-4 h-4 ml-1 text-yellow-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 ml-1 text-red-600" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  reviewer.onTimeRate >= 95 && reviewer.averageScore >= 7.5
                                    ? "bg-green-100 text-green-800"
                                    : reviewer.onTimeRate >= 85 && reviewer.averageScore >= 7.0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {reviewer.onTimeRate >= 95 && reviewer.averageScore >= 7.5
                                  ? "Excellent"
                                  : reviewer.onTimeRate >= 85 && reviewer.averageScore >= 7.0
                                    ? "Good"
                                    : "Needs Improvement"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                {/* Key Statistics */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">+12% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">27%</div>
                      <p className="text-xs text-muted-foreground">+3% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7.2</div>
                      <p className="text-xs text-muted-foreground">+0.3 from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$3.2M</div>
                      <p className="text-xs text-muted-foreground">+18% from last quarter</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Trend Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Trends Analysis</CardTitle>
                    <CardDescription>Key performance indicators over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Proposal Quality Improvement</h3>
                        <p className="text-sm text-gray-600">
                          Average proposal scores have increased by 0.8 points over the past year, indicating improved
                          quality of submissions and better researcher preparation.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Funding Efficiency</h3>
                        <p className="text-sm text-gray-600">
                          The approval rate has stabilized at 27%, with more strategic funding allocation leading to
                          higher impact research projects.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Review Process Optimization</h3>
                        <p className="text-sm text-gray-600">
                          Average review completion time has decreased by 15%, with 92% of reviews completed on time
                          thanks to improved reviewer management.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AdminLayout>
  )
}
