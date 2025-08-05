"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
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
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { PageSkeleton } from "@/components/ui/loading-skeleton"

// TypeScript interfaces for better type safety
interface Report {
  _id: string;
  title: string;
  generatedDate: string;
  period: string;
  totalProposals: number;
  totalFunding: number;
  approved: number;
  rejected: number;
  status: string;
  averageScore?: number;
}

interface MonthlyData {
  month: string;
  applications: number;
  approved: number;
  rejected: number;
  funding: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ReviewerPerformance {
  id: string;
  name: string;
  reviews: number;
  totalAssigned: number;
  avgTime: number;
  onTimeRate: number;
}

interface UserStats {
  id: string;
  name: string;
  applications: number;
  approved: number;
  funding: number;
}

interface GrantStats {
  id: string;
  title: string;
  applications: number;
  approved: number;
  funding: number;
  status: string;
  deadline: string;
}

function ReportDetailsModal({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
      <DialogHeader className="space-y-2 sm:space-y-3">
        <DialogTitle className="text-base sm:text-lg md:text-xl">{report.title}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm md:text-base">
          Generated on {report.generatedDate} • Period: {report.period}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 sm:space-y-6">
        {/* Report Summary */}
        <Card className="p-3 sm:p-4 md:p-6">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4">
            <CardTitle className="text-sm sm:text-base md:text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <span className="font-medium text-xs sm:text-sm">Total Proposals:</span>
                <span className="ml-1 sm:ml-2 text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{report.totalProposals}</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="font-medium text-xs sm:text-sm">Total Funding:</span>
                <span className="ml-1 sm:ml-2 text-lg sm:text-xl md:text-2xl font-bold text-green-600">{report.totalFunding}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center p-2 sm:p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{report.approved}</div>
                <div className="text-xs sm:text-sm text-green-700">Approved</div>
              </div>
              <div className="text-center p-2 sm:p-3 md:p-4 bg-red-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{report.rejected}</div>
                <div className="text-xs sm:text-sm text-red-700">Rejected</div>
              </div>
              <div className="text-center p-2 sm:p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{report.totalProposals - report.approved - report.rejected}</div>
                <div className="text-xs sm:text-sm text-blue-700">Pending</div>
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
                  ${report.approved > 0 ? Math.round(report.totalFunding / report.approved).toLocaleString() : '0'}
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
  useAuthRedirect()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
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

  // Dynamic data states
  const [evaluationReports, setEvaluationReports] = useState<Report[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [reviewerPerformance, setReviewerPerformance] = useState<ReviewerPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [exportLoading, setExportLoading] = useState(false)
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [grantStats, setGrantStats] = useState<GrantStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Optimized data fetching with caching
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const token = authStorage.getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Fetch all data in parallel for better performance
      const [evalRes, analyticsRes, perfRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reports/evaluation`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/reports/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/reports/reviewer-performance`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!evalRes.ok) throw new Error("Failed to fetch evaluation reports")
      if (!analyticsRes.ok) throw new Error("Failed to fetch analytics")
      if (!perfRes.ok) throw new Error("Failed to fetch reviewer performance")

      const [evalData, analyticsData, perfData] = await Promise.all([
        evalRes.json(),
        analyticsRes.json(),
        perfRes.json()
      ]);

      setEvaluationReports(evalData)
      setMonthlyData(analyticsData.monthlyData || [])
      setCategoryData(analyticsData.categoryData || [])
      setReviewerPerformance(perfData || [])
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }, [API_BASE_URL])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const token = authStorage.getToken();
      const [users, grants] = await Promise.all([
        fetch(`${API_BASE_URL}/reports/user-stats?year=${year}&month=${month}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        }).then(res => res.json()),
        fetch(`${API_BASE_URL}/reports/grant-stats?year=${year}&month=${month}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        }).then(res => res.json()),
      ]);
      setUserStats(users);
      setGrantStats(grants);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [API_BASE_URL, year, month]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      const token = authStorage.getToken()
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
      const token = authStorage.getToken()
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

  if (loading) {
    return (
      <AdminLayout active="reports" title="Reports & Analytics">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout active="reports" title="Reports & Analytics">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center text-red-600 text-sm">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="reports" title="Reports & Analytics">
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Comprehensive insights into grant application trends and performance</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex gap-2">
              <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                <SelectTrigger className="w-20 sm:w-24 md:w-32 text-xs sm:text-sm md:text-base h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                <SelectTrigger className="w-24 sm:w-32 md:w-40 text-xs sm:text-sm md:text-base h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, idx) => (
                    <SelectItem key={idx + 1} value={(idx + 1).toString()}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              disabled={exportLoading}
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {exportLoading ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Key Metrics - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <Card className="p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Proposals</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{totalProposals}</p>
                </div>
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Approved</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{totalApproved}</p>
                </div>
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{totalRejected}</p>
                </div>
                <XCircle className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Funding</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">${totalFunding.toLocaleString()}</p>
                </div>
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Active Grants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{activeGrants}</p>
                </div>
                <Award className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 p-2 sm:p-3 md:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Closed Grants</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{closedGrants}</p>
                </div>
                <Award className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="applications" className="space-y-3 sm:space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="applications" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">Applications</TabsTrigger>
            <TabsTrigger value="funding" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">Funding</TabsTrigger>
            <TabsTrigger value="reviewers" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">Reviewers</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">Users</TabsTrigger>
            <TabsTrigger value="grants" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">Grants</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
                <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">Submissions by Month</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">Monthly application submission trends</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#3b82f6" name="Total" />
                      <Bar dataKey="approved" fill="#10b981" name="Approved" />
                      <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
                <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">Research Domain by Category</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">Distribution across research categories</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 60 : 100}
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

          <TabsContent value="funding" className="space-y-3 sm:space-y-4">
            <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                <CardTitle className="text-sm sm:text-base md:text-lg">Funding Trends</CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">Monthly funding allocation and application volume</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
                    <YAxis yAxisId="left" fontSize={isMobile ? 10 : 12} />
                    <YAxis yAxisId="right" orientation="right" fontSize={isMobile ? 10 : 12} />
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
                      strokeWidth={isMobile ? 2 : 3}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="applications"
                      stroke="#ef4444"
                      strokeWidth={isMobile ? 2 : 3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviewers" className="space-y-3 sm:space-y-4">
            <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                <CardTitle className="text-sm sm:text-base md:text-lg">Reviewer Performance</CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">Review completion and scoring metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 sm:space-y-4">
                  {/* Mobile Card View */}
                  {isMobile ? (
                    <div className="space-y-3 p-2">
                      {reviewerPerformance.map((reviewer) => (
                        <div key={reviewer.id} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900">{reviewer.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {reviewer.reviews}/{reviewer.totalAssigned}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completed:</span>
                              <span className="font-medium text-blue-600">{reviewer.reviews}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Assigned:</span>
                              <span className="font-medium text-gray-700">{reviewer.totalAssigned}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Avg Time:</span>
                              <span className="font-medium text-orange-600">{reviewer.avgTime}d</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">On-Time:</span>
                              <span className="font-medium text-green-600">{reviewer.onTimeRate}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Desktop Table View */
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] sm:min-w-[800px] md:min-w-[900px] text-xs sm:text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Reviewer</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Reviews Completed</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Total Assigned</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Avg Time (days)</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">On-Time Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reviewerPerformance.map((reviewer) => (
                            <TableRow key={reviewer.id}>
                              <TableCell className="font-medium text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{reviewer.name}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{reviewer.reviews}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{reviewer.totalAssigned}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{reviewer.avgTime}d</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{reviewer.onTimeRate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Reviewer Performance Chart */}
                  <div className="mt-3 sm:mt-6">
                    <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
                      <BarChart data={reviewerPerformance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" fontSize={isMobile ? 10 : 12} />
                        <YAxis dataKey="name" type="category" width={isMobile ? 80 : 100} fontSize={isMobile ? 10 : 12} />
                        <Tooltip />
                        <Bar dataKey="reviews" fill="#3b82f6" name="Reviews Completed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        <TabsContent value="users" className="space-y-3 sm:space-y-4">
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">User Activity (Monthly)</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Applications, approvals, and funding by user</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {statsLoading ? (
                <div className="py-4 sm:py-8 text-center text-gray-500 text-xs sm:text-sm">Loading user stats...</div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  {isMobile ? (
                    <div className="space-y-3 p-2">
                      {userStats.map((user) => (
                        <div key={user.id} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900">{user.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {user.applications} apps
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approved:</span>
                              <span className="font-medium text-green-600">{user.approved}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Funding:</span>
                              <span className="font-medium text-blue-600">${user.funding?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Desktop Table View */
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] sm:min-w-[800px] md:min-w-[900px] text-xs sm:text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">User</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Applications</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Approved</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Funding</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userStats.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{user.name}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{user.applications}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{user.approved}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">${user.funding?.toLocaleString()}</TableCell>
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
        </TabsContent>
        <TabsContent value="grants" className="space-y-3 sm:space-y-4">
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">Grant Performance (Monthly)</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Applications, approvals, and funding by grant</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {statsLoading ? (
                <div className="py-4 sm:py-8 text-center text-gray-500 text-xs sm:text-sm">Loading grant stats...</div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  {isMobile ? (
                    <div className="space-y-3 p-2">
                      {grantStats.map((grant) => (
                        <div key={grant.id} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{grant.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {grant.applications} apps
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approved:</span>
                              <span className="font-medium text-green-600">{grant.approved}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Funding:</span>
                              <span className="font-medium text-blue-600">${grant.funding?.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Status:</span>
                              <Badge 
                                variant={grant.status === 'Active' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {grant.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Desktop Table View */
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] sm:min-w-[800px] md:min-w-[900px] text-xs sm:text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Grant</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Applications</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Approved</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">Funding</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grantStats.map((grant) => (
                            <TableRow key={grant.id}>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{grant.title}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{grant.applications}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{grant.approved}</TableCell>
                              <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">${grant.funding?.toLocaleString()}</TableCell>
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
        </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
