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
import { useToast } from "@/hooks/use-toast"
import { FileText, User, History, Eye, Award, Star, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, DollarSign } from "lucide-react"
import ReviewerLayout from "@/components/layouts/ReviewerLayout"

function ReviewModal({ review, onClose, onSubmit }: { review: any; onClose: () => void; onSubmit: (reviewData: any) => void }) {
  const [reviewData, setReviewData] = useState({
    innovationScore: "",
    impactScore: "",
    feasibilityScore: "",
    comments: "",
    decision: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitReview = async () => {
    if (!reviewData.decision || !reviewData.innovationScore || !reviewData.impactScore || !reviewData.feasibilityScore || !reviewData.comments) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return;
    }
    
    setSubmitting(true);
    try {
      const score = (parseInt(reviewData.innovationScore) + parseInt(reviewData.impactScore) + parseInt(reviewData.feasibilityScore)) / 3;
      await onSubmit({
        ...reviewData,
        score: score.toFixed(1)
      });
      toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted",
      })
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Review Proposal: {review.proposal?.title}</DialogTitle>
        <DialogDescription>
          Submitted by {review.proposal?.researcher?.firstName} {review.proposal?.researcher?.lastName}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Funding Requested</Label>
                <p className="text-lg font-semibold text-blue-600">${review.proposal?.funding?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-medium">Category</Label>
                <p>{review.proposal?.category}</p>
              </div>
            </div>
            <div>
              <Label className="font-medium">Abstract</Label>
              <p className="text-sm text-gray-600 mt-1">{review.proposal?.abstract}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Innovation Score (1-10)</Label>
              <Select
                value={reviewData.innovationScore}
                onValueChange={(value) => setReviewData({ ...reviewData, innovationScore: value })}
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
              <Label>Impact Score (1-10)</Label>
              <Select
                value={reviewData.impactScore}
                onValueChange={(value) => setReviewData({ ...reviewData, impactScore: value })}
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
              <Label>Feasibility Score (1-10)</Label>
              <Select
                value={reviewData.feasibilityScore}
                onValueChange={(value) => setReviewData({ ...reviewData, feasibilityScore: value })}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Detailed Comments</Label>
              <Textarea
                placeholder="Provide detailed feedback on the proposal..."
                rows={6}
                value={reviewData.comments}
                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Final Decision</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Revisions Requested">Revisions Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function ReviewerDashboard() {
  const [assignedReviews, setAssignedReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const { toast } = useToast()

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
        setAssignedReviews(data)
      } catch (err: any) {
        setError(err.message || "Error fetching assigned reviews")
        toast({
          title: "Error",
          description: "Failed to load assigned reviews",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAssigned()
  }, [toast])

  const handleSubmitReview = async (reviewData: any) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/reviews/${selectedReview.proposal._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      
      // Refresh the reviews list
      const refreshRes = await fetch("http://localhost:5000/api/reviews/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setAssignedReviews(data)
      }
    } catch (err: any) {
      console.error("Error submitting review:", err)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const pendingReviews = assignedReviews.filter(review => review.status === "Pending")
  const completedReviews = assignedReviews.filter(review => review.status === "Completed")

  return (
    <ReviewerLayout active="dashboard">
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Reviews assigned to you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Reviews submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedReviews.length > 0 
                  ? (completedReviews.reduce((acc, review) => acc + parseFloat(review.score || 0), 0) / completedReviews.length).toFixed(1)
                  : "0.0"
                }
              </div>
              <p className="text-xs text-muted-foreground">Out of 10 points</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading assigned reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* Pending Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>Proposals awaiting your review and evaluation</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending reviews at the moment.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposal Title</TableHead>
                        <TableHead>Researcher</TableHead>
                        <TableHead>Funding Requested</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReviews.map((review) => (
                        <TableRow key={review._id}>
                          <TableCell className="font-medium">{review.proposal?.title}</TableCell>
                          <TableCell>
                            {review.proposal?.researcher?.firstName} {review.proposal?.researcher?.lastName}
                          </TableCell>
                          <TableCell>${review.proposal?.funding?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="w-4 h-4 mr-1" /> Pending
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => setSelectedReview(review)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              {selectedReview && selectedReview._id === review._id && (
                                <ReviewModal
                                  review={selectedReview}
                                  onClose={() => setSelectedReview(null)}
                                  onSubmit={handleSubmitReview}
                                />
                              )}
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Completed Reviews */}
            {completedReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Completed Reviews</CardTitle>
                  <CardDescription>Reviews you have submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proposal Title</TableHead>
                        <TableHead>Researcher</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Review Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedReviews.map((review) => (
                        <TableRow key={review._id}>
                          <TableCell className="font-medium">{review.proposal?.title}</TableCell>
                          <TableCell>
                            {review.proposal?.researcher?.firstName} {review.proposal?.researcher?.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              review.decision === "Approved" ? "bg-green-100 text-green-800" :
                              review.decision === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-orange-100 text-orange-800"
                            }>
                              {review.decision}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              {review.score}/10
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </ReviewerLayout>
  )
}
