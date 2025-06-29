"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  FileText,
  User,
  History,
  Eye,
  Award,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from "lucide-react"
import { ReviewerSidebar } from "@/components/ui/sidebar"

const reviewHistory = [
  {
    id: 1,
    title: "AI-Powered Medical Diagnosis System",
    researcher: "Dr. Sarah Johnson",
    institution: "Stanford University",
    category: "Technology",
    reviewDate: "2024-01-15",
    submissionDate: "2024-01-01",
    decision: "Approved",
    score: 8.5,
    funding: "$75,000",
    comments: "Excellent research proposal with strong methodology and clear objectives.",
    innovationScore: 9,
    impactScore: 8,
    feasibilityScore: 8,
  },
  {
    id: 2,
    title: "Sustainable Energy Storage Solutions",
    researcher: "Prof. Michael Chen",
    institution: "MIT",
    category: "Environment",
    reviewDate: "2024-01-10",
    submissionDate: "2023-12-20",
    decision: "Approved",
    score: 7.8,
    funding: "$50,000",
    comments: "Solid research approach with good potential for environmental impact.",
    innovationScore: 8,
    impactScore: 8,
    feasibilityScore: 7,
  },
  {
    id: 3,
    title: "Quantum Computing Applications",
    researcher: "Dr. Emily Rodriguez",
    institution: "Caltech",
    category: "Technology",
    reviewDate: "2024-01-05",
    submissionDate: "2023-12-15",
    decision: "Rejected",
    score: 5.2,
    funding: "$100,000",
    comments: "Ambitious project but lacks sufficient preliminary data and feasibility analysis.",
    innovationScore: 7,
    impactScore: 6,
    feasibilityScore: 3,
  },
  {
    id: 4,
    title: "Climate Change Modeling",
    researcher: "Dr. James Wilson",
    institution: "UC Berkeley",
    category: "Environment",
    reviewDate: "2023-12-20",
    submissionDate: "2023-12-01",
    decision: "Revisions Requested",
    score: 6.8,
    funding: "$60,000",
    comments: "Good foundation but needs more detailed methodology and timeline.",
    innovationScore: 7,
    impactScore: 7,
    feasibilityScore: 6,
  },
  {
    id: 5,
    title: "Blockchain Security Research",
    researcher: "Prof. Lisa Zhang",
    institution: "Harvard University",
    category: "Technology",
    reviewDate: "2023-12-15",
    submissionDate: "2023-11-30",
    decision: "Approved",
    score: 8.2,
    funding: "$45,000",
    comments: "Well-structured research with clear deliverables and timeline.",
    innovationScore: 8,
    impactScore: 8,
    feasibilityScore: 9,
  },
]

const monthlyReviews = [
  { month: "Sep", reviews: 2, avgScore: 7.5 },
  { month: "Oct", reviews: 3, avgScore: 7.8 },
  { month: "Nov", reviews: 1, avgScore: 8.2 },
  { month: "Dec", reviews: 4, avgScore: 7.1 },
  { month: "Jan", reviews: 3, avgScore: 7.5 },
]

function ReviewDetailsModal({ review, onClose }: { review: any; onClose: () => void }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Review Details: {review.title}</DialogTitle>
        <DialogDescription>
          Reviewed on {review.reviewDate} • {review.researcher} from {review.institution}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Overall Score:</span>
                <span className="ml-2 text-2xl font-bold text-blue-600">{review.score}/10</span>
              </div>
              <div>
                <span className="font-medium">Decision:</span>
                <Badge
                  className={`ml-2 ${
                    review.decision === "Approved"
                      ? "bg-green-100 text-green-800"
                      : review.decision === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {review.decision === "Approved" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : review.decision === "Rejected" ? (
                    <XCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {review.decision}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="font-medium">Innovation:</span>
                <span className="ml-2">{review.innovationScore}/10</span>
              </div>
              <div>
                <span className="font-medium">Impact:</span>
                <span className="ml-2">{review.impactScore}/10</span>
              </div>
              <div>
                <span className="font-medium">Feasibility:</span>
                <span className="ml-2">{review.feasibilityScore}/10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Category:</span>
                <Badge className="ml-2">{review.category}</Badge>
              </div>
              <div>
                <span className="font-medium">Funding Requested:</span>
                <span className="ml-2 font-semibold text-blue-600">{review.funding}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Submission Date:</span>
                <span className="ml-2">{review.submissionDate}</span>
              </div>
              <div>
                <span className="font-medium">Review Date:</span>
                <span className="ml-2">{review.reviewDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{review.comments}</p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function ReviewHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [decisionFilter, setDecisionFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState(null)

  const filteredReviews = reviewHistory.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDecision = decisionFilter === "all" || review.decision === decisionFilter
    const matchesCategory = categoryFilter === "all" || review.category === categoryFilter
    return matchesSearch && matchesDecision && matchesCategory
  })

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Revisions Requested":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalReviews = reviewHistory.length
  const approvedReviews = reviewHistory.filter((r) => r.decision === "Approved").length
  const averageScore = (reviewHistory.reduce((sum, r) => sum + r.score, 0) / totalReviews).toFixed(1)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ReviewerSidebar active="history" />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review History</h1>
                  <p className="text-gray-600">Your completed reviews and performance metrics</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReviews}</div>
                  <p className="text-xs text-muted-foreground">Completed reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvedReviews}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((approvedReviews / totalReviews) * 100)}% approval rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}</div>
                  <p className="text-xs text-muted-foreground">Out of 10</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Reviews completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Review Activity</CardTitle>
                  <CardDescription>Number of reviews completed each month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyReviews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reviews" fill="#3B82F6" name="Reviews" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Scores Trend</CardTitle>
                  <CardDescription>Your average review scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyReviews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#10B981" strokeWidth={2} name="Avg Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews by title, researcher, or institution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Revisions Requested">Revisions Requested</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Review History Table */}
            <Card>
              <CardHeader>
                <CardTitle>Review History</CardTitle>
                <CardDescription>
                  Showing {filteredReviews.length} of {totalReviews} reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proposal Title</TableHead>
                      <TableHead>Researcher</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.title}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{review.researcher}</div>
                            <div className="text-sm text-gray-500">{review.institution}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{review.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {review.reviewDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg font-bold text-blue-600">{review.score}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDecisionColor(review.decision)}>
                            {review.decision === "Approved" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : review.decision === "Rejected" ? (
                              <XCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {review.decision}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">{review.funding}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            {selectedReview && (
                              <ReviewDetailsModal review={selectedReview} onClose={() => setSelectedReview(null)} />
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
