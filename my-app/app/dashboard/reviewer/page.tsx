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
import { FileText, User, History, Eye, Award, Star, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, DollarSign, Download } from "lucide-react"
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

// Add ProposalViewModal for reviewers (copied from admin, with recommendation section)
function ProposalViewModal({ proposal, onClose }: { proposal: any; onClose: () => void }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{proposal.title}</DialogTitle>
        <DialogDescription>
          Submitted by {proposal.researcher?.firstName} {proposal.researcher?.lastName} from {proposal.researcher?.institution}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Status</Label>
                <Badge className="mt-1">{proposal.status}</Badge>
              </div>
              <div>
                <Label className="font-medium">Category</Label>
                <p className="mt-1">{proposal.category}</p>
              </div>
              <div>
                <Label className="font-medium">Funding Requested</Label>
                <p className="mt-1 text-lg font-semibold text-blue-600">${proposal.funding?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-medium">Grant</Label>
                <p className="mt-1">{proposal.grantTitle}</p>
              </div>
              <div>
                <Label className="font-medium">Submission Date</Label>
                <p className="mt-1">{proposal.dateSubmitted ? new Date(proposal.dateSubmitted).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <Label className="font-medium">Deadline</Label>
                <p className="mt-1">{proposal.deadline ? new Date(proposal.deadline).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Abstract */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{proposal.abstract}</p>
          </CardContent>
        </Card>
        {/* Budget Breakdown */}
        {(proposal.personnelCosts || proposal.equipmentCosts || proposal.materialsCosts || proposal.travelCosts || proposal.otherCosts) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Personnel Costs</Label>
                  <p className="mt-1">${proposal.personnelCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium">Equipment</Label>
                  <p className="mt-1">${proposal.equipmentCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium">Materials & Supplies</Label>
                  <p className="mt-1">${proposal.materialsCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium">Travel</Label>
                  <p className="mt-1">${proposal.travelCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium">Other Costs</Label>
                  <p className="mt-1">${proposal.otherCosts?.toLocaleString() || "0"}</p>
                </div>
                <div className="font-medium text-blue-600">
                  <Label>Total Budget</Label>
                  <p className="mt-1 text-lg">${proposal.funding?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Uploaded Documents */}
        {(proposal.proposalDocument || proposal.cvResume || (proposal.additionalDocuments && proposal.additionalDocuments.length > 0)) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proposal.proposalDocument && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Proposal Document</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`http://localhost:5000/uploads/${proposal.proposalDocument}`, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                {proposal.cvResume && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-medium">CV/Resume</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`http://localhost:5000/uploads/${proposal.cvResume}`, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                {proposal.additionalDocuments && proposal.additionalDocuments.length > 0 && (
                  proposal.additionalDocuments.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Additional Document {index + 1}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`http://localhost:5000/uploads/${doc}`, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {/* System Recommendation Section */}
        {(typeof proposal.recommendedScore === 'number' && proposal.recommendation) && (
          <Card className="border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 my-6">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                AI-Powered Recommendation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Score */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div>
                  <h4 className="font-semibold text-gray-800">Overall Recommendation Score</h4>
                  <p className="text-sm text-gray-600">Based on comprehensive analysis of multiple criteria</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    proposal.recommendedScore >= 80 ? 'text-green-600' :
                    proposal.recommendedScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {proposal.recommendedScore}/100
                  </div>
                  <div className={`text-sm font-medium ${
                    proposal.recommendedScore >= 80 ? 'text-green-700' :
                    proposal.recommendedScore >= 60 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {proposal.recommendedScore >= 80 ? 'Excellent' :
                     proposal.recommendedScore >= 60 ? 'Good' :
                     proposal.recommendedScore >= 40 ? 'Fair' : 'Poor'}
                  </div>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Score Breakdown</span>
                  <span className="text-gray-500">{proposal.recommendedScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      proposal.recommendedScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      proposal.recommendedScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${proposal.recommendedScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommendation Summary */}
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-2">AI Recommendation</h4>
                <p className="text-gray-700 leading-relaxed">{proposal.recommendation}</p>
              </div>

              {/* Scoring Criteria Info */}
              <div className="p-4 bg-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Scoring Criteria</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>• Keyword Relevance</div>
                  <div>• Budget Feasibility</div>
                  <div>• Content Quality</div>
                  <div>• Structure & Format</div>
                  <div>• Domain Alignment</div>
                  <div>• Technical Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
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
  const [viewProposal, setViewProposal] = useState<any | null>(null)
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
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setViewProposal(review.proposal)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                {viewProposal && review.proposal && viewProposal._id === review.proposal._id && (
                                  <ProposalViewModal
                                    proposal={viewProposal}
                                    onClose={() => setViewProposal(null)}
                                  />
                                )}
                              </Dialog>
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
                            </div>
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
                        <TableHead>Actions</TableHead>
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
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setViewProposal(review.proposal)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                {viewProposal && review.proposal && viewProposal._id === review.proposal._id && (
                                  <ProposalViewModal
                                    proposal={viewProposal}
                                    onClose={() => setViewProposal(null)}
                                  />
                                )}
                              </Dialog>
                            </div>
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
