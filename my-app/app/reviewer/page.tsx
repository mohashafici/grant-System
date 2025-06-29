"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ReviewerSidebar,
} from "@/components/ui/sidebar"
import { FileText, User, History, Eye, Award, Star, CheckCircle, XCircle } from "lucide-react"

const reviewHistory = [
  {
    id: 1,
    title: "Climate Change Modeling",
    researcher: "Dr. James Wilson",
    reviewDate: "2024-01-05",
    decision: "Approved",
    score: 8.5,
  },
  {
    id: 2,
    title: "Blockchain Security Research",
    researcher: "Prof. Lisa Zhang",
    reviewDate: "2023-12-20",
    decision: "Rejected",
    score: 5.2,
  },
]

function ReviewModal({ proposal, onClose }: { proposal: any; onClose: () => void }) {
  const [reviewData, setReviewData] = useState({
    innovation: "",
    impact: "",
    feasibility: "",
    comments: "",
    decision: "",
  })

  const handleSubmitReview = () => {
    console.log("Submitting review:", reviewData)
    onClose()
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Review Proposal: {proposal.title}</DialogTitle>
        <DialogDescription>
          Submitted by {proposal.researcher} from {proposal.institution}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Proposal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Funding Requested</Label>
                <p className="text-lg font-semibold text-blue-600">{proposal.funding}</p>
              </div>
              <div>
                <Label className="font-medium">Submission Date</Label>
                <p>{proposal.submissionDate}</p>
              </div>
            </div>
            <div>
              <Label className="font-medium">Abstract</Label>
              <p className="text-sm text-gray-600 mt-1">
                This research proposes to develop an AI-powered medical diagnosis system that leverages machine learning
                algorithms to improve diagnostic accuracy and reduce healthcare costs...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="innovation">Innovation Score (1-10)</Label>
              <Select
                value={reviewData.innovation}
                onValueChange={(value) => setReviewData({ ...reviewData, innovation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate innovation level" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} - {i < 3 ? "Poor" : i < 6 ? "Fair" : i < 8 ? "Good" : "Excellent"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact Score (1-10)</Label>
              <Select
                value={reviewData.impact}
                onValueChange={(value) => setReviewData({ ...reviewData, impact: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate potential impact" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} - {i < 3 ? "Low" : i < 6 ? "Medium" : i < 8 ? "High" : "Very High"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feasibility">Feasibility Score (1-10)</Label>
              <Select
                value={reviewData.feasibility}
                onValueChange={(value) => setReviewData({ ...reviewData, feasibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate feasibility" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} - {i < 3 ? "Unlikely" : i < 6 ? "Possible" : i < 8 ? "Likely" : "Very Likely"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="comments">Detailed Comments</Label>
              <Textarea
                id="comments"
                placeholder="Provide detailed feedback on the proposal..."
                rows={6}
                value={reviewData.comments}
                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Decision */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Final Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recommendation</Label>
                <Select
                  value={reviewData.decision}
                  onValueChange={(value) => setReviewData({ ...reviewData, decision: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="revise">Request Revisions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleSubmitReview}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!reviewData.decision}
                >
                  Submit Review
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}

export default function ReviewerDashboard() {
  const [assignedProposals, setAssignedProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedProposal, setSelectedProposal] = useState(null)

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/reviews/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch assigned reviews")
        const data = await res.json()
        setAssignedProposals(data)
      } catch (err: any) {
        setError(err.message || "Error fetching assigned reviews")
      } finally {
        setLoading(false)
      }
    }
    fetchAssigned()
  }, [])

  // Stats
  const assignedCount = assignedProposals.length
  const completedCount = assignedProposals.filter((p) => p.status === "Completed").length
  const avgScore = assignedProposals.length
    ? (
        assignedProposals.reduce((sum, p) => sum + (p.score || 0), 0) / assignedProposals.length
      ).toFixed(1)
    : "-"

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ReviewerSidebar active="assigned" />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reviewer Dashboard</h1>
                  <p className="text-gray-600">Welcome back, Prof. David Martinez</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignedCount}</div>
                  <p className="text-xs text-muted-foreground">{assignedCount - completedCount} pending completion</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <p className="text-xs text-muted-foreground">This quarter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgScore}</div>
                  <p className="text-xs text-muted-foreground">Out of 10</p>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Proposals Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Assigned Proposals</CardTitle>
                <CardDescription>Review and evaluate research proposals assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-12 text-center text-gray-500">Loading assigned proposals...</div>
                ) : error ? (
                  <div className="py-12 text-center text-red-600">{error}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposal Title</TableHead>
                        <TableHead>Researcher</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Funding</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedProposals.map((proposal) => (
                        <TableRow key={proposal._id}>
                          <TableCell className="font-medium">{proposal.title}</TableCell>
                          <TableCell>{proposal.researcherName || proposal.researcher}</TableCell>
                          <TableCell>{proposal.institution || "-"}</TableCell>
                          <TableCell>{proposal.submissionDate ? proposal.submissionDate.slice(0, 10) : "-"}</TableCell>
                          <TableCell className="font-semibold text-blue-600">{proposal.funding ? `$${proposal.funding.toLocaleString()}` : "-"}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(proposal.priority || "Medium")}>{proposal.priority || "Medium"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setSelectedProposal(proposal)}
                                  >
                                    Review
                                  </Button>
                                </DialogTrigger>
                                {selectedProposal && (
                                  <ReviewModal proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />
                                )}
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Recent Review History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Review History</CardTitle>
                <CardDescription>Your recently completed reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewHistory.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-gray-600">by {review.researcher}</p>
                        <p className="text-xs text-gray-500">Reviewed on {review.reviewDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{review.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <Badge
                          className={
                            review.decision === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {review.decision === "Approved" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {review.decision}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
