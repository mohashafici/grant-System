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
import { useToast } from "@/hooks/use-toast"

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
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState<any | null>(null)
  const { toast } = useToast()

  // Dynamic data states
  const [evaluationReports, setEvaluationReports] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [reviewerPerformance, setReviewerPerformance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [exportLoading, setExportLoading] = useState(false)
  const [userStats, setUserStats] = useState([]);
  const [grantStats, setGrantStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch evaluation reports
        const evalRes = await fetch(`${API_BASE_URL}/reports/evaluation`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!evalRes.ok) throw new Error("Failed to fetch evaluation reports")
        const evalData = await evalRes.json()
        setEvaluationReports(evalData)

        // Fetch analytics
        const analyticsRes = await fetch(`${API_BASE_URL}/reports/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics")
        const analyticsData = await analyticsRes.json()
        setMonthlyData(analyticsData.monthlyData || [])
        setCategoryData(analyticsData.categoryData || [])

        // Fetch reviewer performance
        const perfRes = await fetch(`${API_BASE_URL}/reports/reviewer-performance`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!perfRes.ok) throw new Error("Failed to fetch reviewer performance")
        const perfData = await perfRes.json()
        setReviewerPerformance(perfData || [])
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setStatsLoading(true);
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API_BASE_URL}/reports/user-stats?year=${year}&month=${month}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_BASE_URL}/reports/grant-stats?year=${year}&month=${month}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([users, grants]) => {
      setUserStats(users);
      setGrantStats(grants);
    }).finally(() => setStatsLoading(false));
  }, [year, month]);

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

  const handleGenerateReport = async () => {
    setGenerating(true)
    setReport(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month, year }),
      })
      if (!res.ok) throw new Error("Failed to generate report")
      const data = await res.json()
      setReport(data)
      toast({
        title: "Report Generated",
        description: `Monthly report for ${year}-${month.toString().padStart(2, "0")}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleExportReport = async () => {
    setExportLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/reports/export?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to export report")
      
      // Create blob and download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `grant-report-${year}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Report exported",
        description: `Grant report for ${year} has been downloaded.`,
      })
    } catch (err: any) {
      toast({
        title: "Export failed",
        description: err.message || "Failed to export report",
      })
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-lg">Loading reports...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  // Key metrics - calculate from actual data with better error handling
  const totalProposals = monthlyData.reduce((sum, m) => sum + (m.applications || 0), 0);
  const totalApproved = monthlyData.reduce((sum, m) => sum + (m.approved || 0), 0);
  const totalRejected = monthlyData.reduce((sum, m) => sum + (m.rejected || 0), 0);
  const totalFunding = monthlyData.reduce((sum, m) => sum + (m.funding || 0), 0);
  const activeReviewers = reviewerPerformance.length;
  
  // Calculate average review time more robustly
  const reviewersWithTime = reviewerPerformance.filter(r => r.avgTime > 0);
  const avgReviewTime = reviewersWithTime.length > 0 ? 
    Math.round(reviewersWithTime.reduce((sum, r) => sum + (r.avgTime || 0), 0) / reviewersWithTime.length) : 0;

  // Add month names for selector
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Calculate activeGrants and closedGrants for the selected month from grantStats
  const selectedStartDate = new Date(year, month - 1, 1);
  const selectedEndDate = new Date(year, month, 1);
  const activeGrants = grantStats.filter(g => g.status !== 'Closed' && new Date(g.deadline) >= selectedStartDate).length;
  const closedGrants = grantStats.filter(g => g.status === 'Closed' && new Date(g.deadline) < selectedEndDate).length;

  return (
    <AdminLayout active="reports">
      <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Reports</h1>
      </header>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into grant application trends and performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2025</SelectItem>
                <SelectItem value="2023">2024</SelectItem>
                <SelectItem value="2022">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((name, idx) => (
                  <SelectItem key={idx + 1} value={idx + 1}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              disabled={exportLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {exportLoading ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Proposals</p>
                  <p className="text-2xl font-bold">{totalProposals}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{totalApproved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">{totalRejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold">${totalFunding.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Grants</p>
                  <p className="text-2xl font-bold">{activeGrants}</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Closed Grants</p>
                  <p className="text-2xl font-bold">{closedGrants}</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="reviewers">Reviewers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="grants">Grants</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>submissons by Month</CardTitle>
                  <CardDescription>Monthly application submission trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#3b82f6" name="Total" />
                      <Bar dataKey="approved" fill="#10b981" name="Approved" />
                      <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research domain by Category</CardTitle>
                  <CardDescription>Distribution across research categories</CardDescription>
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
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funding Trends</CardTitle>
                <CardDescription>Monthly funding allocation and application volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "funding" ? `$${(value as number).toLocaleString()}` : value,
                        name === "funding" ? "Funding" : "Applications",
                      ]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="funding"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="applications"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviewers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reviewer Performance</CardTitle>
                <CardDescription>Review completion and scoring metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Reviewer Performance Table */}
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reviewer</TableHead>
                          <TableHead>Reviews Completed</TableHead>
                          <TableHead>Total Assigned</TableHead>
                          <TableHead>Avg Score</TableHead>
                          <TableHead>Avg Time (days)</TableHead>
                          <TableHead>On-Time Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviewerPerformance.map((reviewer) => (
                          <TableRow key={reviewer.id}>
                            <TableCell className="font-medium">{reviewer.name}</TableCell>
                            <TableCell>{reviewer.reviews}</TableCell>
                            <TableCell>{reviewer.totalAssigned}</TableCell>
                            <TableCell>{reviewer.averageScore}/10</TableCell>
                            <TableCell>{reviewer.avgTime}d</TableCell>
                            <TableCell>{reviewer.onTimeRate}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Reviewer Performance Chart */}
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={reviewerPerformance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="reviews" fill="#3b82f6" name="Reviews Completed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Activity (Monthly)</CardTitle>
                <CardDescription>Applications, approvals, and funding by user</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading user stats...</div>
                ) : (
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead>Funding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userStats.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.applications}</TableCell>
                          <TableCell>{user.approved}</TableCell>
                          <TableCell>${user.funding?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grant Performance (Monthly)</CardTitle>
                <CardDescription>Applications, approvals, and funding by grant</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading grant stats...</div>
                ) : (
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grant</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead>Funding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grantStats.map((grant) => (
                        <TableRow key={grant.id}>
                          <TableCell>{grant.title}</TableCell>
                          <TableCell>{grant.applications}</TableCell>
                          <TableCell>{grant.approved}</TableCell>
                          <TableCell>${grant.funding?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
