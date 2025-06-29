"use client"

import { useState, useEffect } from "react"
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

  // Dynamic data states
  const [evaluationReports, setEvaluationReports] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [reviewerPerformance, setReviewerPerformance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        // Fetch evaluation reports
        const evalRes = await fetch("http://localhost:5000/api/reports/evaluation", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!evalRes.ok) throw new Error("Failed to fetch evaluation reports")
        const evalData = await evalRes.json()
        setEvaluationReports(evalData)

        // Fetch analytics
        const analyticsRes = await fetch("http://localhost:5000/api/reports/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics")
        const analyticsData = await analyticsRes.json()
        setMonthlyData(analyticsData.monthlyData)
        setCategoryData(analyticsData.categoryData)

        // Fetch reviewer performance
        const perfRes = await fetch("http://localhost:5000/api/reports/reviewer-performance", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!perfRes.ok) throw new Error("Failed to fetch reviewer performance")
        const perfData = await perfRes.json()
        setReviewerPerformance(perfData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  if (loading) return <div className="p-8 text-center text-lg">Loading reports...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

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
                        <BarChart data={monthlyData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
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
                      <CardDescription>Distribution of funding across categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            dataKey="funding"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviewer Performance</CardTitle>
                    <CardDescription>Reviewer activity and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Reviews Completed</TableHead>
                          <TableHead>Avg. Score</TableHead>
                          <TableHead>On-Time Rate</TableHead>
                          <TableHead>Expertise</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviewerPerformance.map((reviewer) => (
                          <TableRow key={reviewer.id}>
                            <TableCell>{reviewer.name}</TableCell>
                            <TableCell>{reviewer.reviewsCompleted}</TableCell>
                            <TableCell>{reviewer.averageScore}</TableCell>
                            <TableCell>{reviewer.onTimeRate}%</TableCell>
                            <TableCell>{reviewer.expertise}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proposal & Approval Trends</CardTitle>
                      <CardDescription>Monthly trends for proposals and approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="proposals" stroke="#3B82F6" name="Proposals" />
                          <Line type="monotone" dataKey="approved" stroke="#10B981" name="Approved" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding by Category</CardTitle>
                      <CardDescription>Trends in funding allocation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            dataKey="funding"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-trend-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AdminLayout>
  )
}
