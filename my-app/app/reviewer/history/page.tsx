"use client"

import { useState, useEffect } from "react"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  FileText,
  Eye,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import ReviewerLayout from "@/components/layouts/ReviewerLayout"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

export default function ReviewHistoryPage() {
  useAuthRedirect()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [decisionFilter, setDecisionFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/reviews/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch reviews")
        const data = await res.json()
        const completed = data.filter((r: any) => r.status === "Completed")
        setReviews(completed)
      } catch (err: any) {
        setError(err.message || "Error fetching reviews")
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    const proposal = review.proposal || {}
    const matchesSearch =
      (proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.researcher?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.researcher?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.researcher?.institution?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDecision = decisionFilter === "all" || review.decision === decisionFilter
    const matchesCategory = categoryFilter === "all" || proposal.category === categoryFilter
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

  const totalReviews = reviews.length
  const approvedReviews = reviews.filter((r) => r.decision === "Approved").length
  const averageScore = (reviews.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0) / (totalReviews || 1)).toFixed(1)

  return (
    <ReviewerLayout active="history">
      <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
                <SidebarTrigger />
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Review History</h1>
      </header>
      <div className="space-y-6">
                <div>
          <p className="text-gray-600 ml-16">View your completed reviews and evaluations</p>
            </div>

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
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading reviews...</div>
                ) : error ? (
                  <div className="py-8 text-center text-red-500">{error}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposal Title</TableHead>
                        <TableHead>Researcher</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Review Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.map((review) => (
                        <TableRow key={review._id}>
                          <TableCell className="font-medium">{review.proposal?.title}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {review.proposal?.researcher
                                  ? `${review.proposal.researcher.firstName || ""} ${review.proposal.researcher.lastName || ""}`.trim() ||
                                    review.proposal.researcher.email ||
                                    "Unknown"
                                  : "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">{review.proposal?.researcher?.institution}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{review.proposal?.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : ''}
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
                          <TableCell>
                        <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
      </div>
    </ReviewerLayout>
  )
}
