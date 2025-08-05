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
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { authStorage } from "@/lib/auth"

// TypeScript interfaces
interface Review {
  _id: string;
  proposal: {
    _id: string;
    title: string;
    funding: number;
    category: string;
    abstract: string;
    status: string;
    grantTitle: string;
    dateSubmitted: string;
    deadline: string;
    personnelCosts?: number;
    equipmentCosts?: number;
    materialsCosts?: number;
    travelCosts?: number;
    otherCosts?: number;
    proposalDocument?: string;
    cvResume?: string;
    additionalDocuments?: string[];
    researcher: {
      firstName: string;
      lastName: string;
      institution: string;
    };
  };
  status: string;
  decision?: string;
  reviewDate?: string;
}

function ReviewModal({ review, onClose, onSubmit }: { review: Review; onClose: () => void; onSubmit: (reviewData: any) => void }) {
  const [reviewData, setReviewData] = useState({
    comments: "",
    decision: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitReview = async () => {
    if (!reviewData.decision || !reviewData.comments) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        ...reviewData
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
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 mx-auto">
      <DialogHeader className="space-y-2 sm:space-y-3">
        <DialogTitle className="text-base sm:text-lg md:text-xl break-words">Review Proposal: {review.proposal?.title}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm md:text-base">
          Submitted by {review.proposal?.researcher?.firstName} {review.proposal?.researcher?.lastName}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Proposal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Funding Requested</Label>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-600 break-words">${review.proposal?.funding?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Category</Label>
                <p className="text-xs sm:text-sm md:text-base break-words">{review.proposal?.category}</p>
              </div>
            </div>
            <div>
              <Label className="font-medium text-xs sm:text-sm md:text-base">Abstract</Label>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 leading-relaxed break-words max-h-32 sm:max-h-40 overflow-y-auto">{review.proposal?.abstract}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Review Comments</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm md:text-base">Detailed Comments</Label>
              <Textarea
                placeholder="Provide detailed feedback on the proposal..."
                rows={3}
                className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-xs sm:text-sm resize-none"
                value={reviewData.comments}
                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Final Decision</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm md:text-base">Recommendation</Label>
              <Select
                value={reviewData.decision}
                onValueChange={(value) => setReviewData({ ...reviewData, decision: value })}
              >
                <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                  <SelectValue placeholder="Select your recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Submitting...</span>
                <span className="sm:hidden">Submit...</span>
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
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 mx-auto">
      <DialogHeader className="space-y-2 sm:space-y-3">
        <DialogTitle className="text-base sm:text-lg md:text-xl break-words">{proposal.title}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm md:text-base">
          Submitted by {proposal.researcher?.firstName} {proposal.researcher?.lastName} from {proposal.researcher?.institution}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Basic Information */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Proposal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Status</Label>
                <Badge className="mt-1 text-xs sm:text-sm">{proposal.status}</Badge>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Category</Label>
                <p className="mt-1 text-xs sm:text-sm md:text-base break-words">{proposal.category}</p>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Funding Requested</Label>
                <p className="mt-1 text-sm sm:text-base md:text-lg font-semibold text-blue-600 break-words">${proposal.funding?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Grant</Label>
                <p className="mt-1 text-xs sm:text-sm md:text-base break-words">{proposal.grantTitle}</p>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Submission Date</Label>
                <p className="mt-1 text-xs sm:text-sm md:text-base">{proposal.dateSubmitted ? new Date(proposal.dateSubmitted).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <Label className="font-medium text-xs sm:text-sm md:text-base">Deadline</Label>
                <p className="mt-1 text-xs sm:text-sm md:text-base">{proposal.deadline ? new Date(proposal.deadline).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Abstract */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Abstract</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base break-words max-h-40 sm:max-h-48 overflow-y-auto">{proposal.abstract}</p>
          </CardContent>
        </Card>
        {/* Budget Breakdown */}
        {(proposal.personnelCosts || proposal.equipmentCosts || proposal.materialsCosts || proposal.travelCosts || proposal.otherCosts) && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm md:text-base">Personnel Costs</Label>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">${proposal.personnelCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm md:text-base">Equipment</Label>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">${proposal.equipmentCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm md:text-base">Materials & Supplies</Label>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">${proposal.materialsCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm md:text-base">Travel</Label>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">${proposal.travelCosts?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm md:text-base">Other Costs</Label>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">${proposal.otherCosts?.toLocaleString() || "0"}</p>
                </div>
                <div className="font-medium text-blue-600">
                  <Label className="text-xs sm:text-sm md:text-base">Total Budget</Label>
                  <p className="mt-1 text-sm sm:text-base md:text-lg">${proposal.funding?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Uploaded Documents */}
        {(proposal.proposalDocument || proposal.cvResume || (proposal.additionalDocuments && proposal.additionalDocuments.length > 0)) && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="space-y-2 sm:space-y-3">
                {proposal.proposalDocument && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border rounded-lg gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm md:text-base">Proposal Document</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(proposal.proposalDocument, '_blank')}
                      className="w-full sm:w-auto h-8 sm:h-9 text-xs"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
                {proposal.cvResume && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border rounded-lg gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm md:text-base">CV/Resume</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(proposal.cvResume, '_blank')}
                      className="w-full sm:w-auto h-8 sm:h-9 text-xs"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
                {proposal.additionalDocuments && proposal.additionalDocuments.length > 0 && (
                  proposal.additionalDocuments.map((doc: string, index: number) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border rounded-lg gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <span className="font-medium text-xs sm:text-sm md:text-base">Additional Document {index + 1}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc, '_blank')}
                        className="w-full sm:w-auto h-8 sm:h-9 text-xs"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm">
            Close
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

// Mobile Review Card Component
function MobileReviewCard({ review, onView, onReview }: { 
  review: Review; 
  onView: (proposal: any) => void; 
  onReview: (review: Review) => void; 
}) {
  return (
    <Card className="mb-4 border shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight text-gray-900 mb-1 line-clamp-2">
                {review.proposal?.title}
              </h3>
              <p className="text-xs text-gray-500">
                {review.proposal?.researcher?.firstName} {review.proposal?.researcher?.lastName}
              </p>
            </div>
            <Badge className={`ml-2 flex-shrink-0 text-xs ${
              review.status === "Pending" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-green-100 text-green-800"
            }`}>
              {review.status === "Pending" ? (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="hidden xs:inline">Pending</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="hidden xs:inline">Completed</span>
                </>
              )}
            </Badge>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Funding:</span>
              <p className="font-medium text-blue-600">${review.proposal?.funding?.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>
              <p className="font-medium truncate">{review.proposal?.category}</p>
            </div>
            {review.decision && (
              <div className="col-span-2">
                <span className="text-gray-500">Decision:</span>
                <Badge className={`ml-2 text-xs ${
                  review.decision === "Approved" ? "bg-green-100 text-green-800" :
                  review.decision === "Rejected" ? "bg-red-100 text-red-800" :
                  "bg-orange-100 text-orange-800"
                }`}>
                  {review.decision}
                </Badge>
              </div>
            )}
            {review.reviewDate && (
              <div className="col-span-2">
                <span className="text-gray-500">Review Date:</span>
                <p className="font-medium">{new Date(review.reviewDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(review.proposal)}
              className="flex-1 h-9 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {review.status === "Pending" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onReview(review)}
                className="flex-1 h-9 text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReviewerDashboardPage() {
  useAuthRedirect()
  const { toast } = useToast()

  const [assignedReviews, setAssignedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [viewProposal, setViewProposal] = useState<any | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true)
      setError("")
      try {
        const token = authStorage.getToken()
        const res = await fetch(`${API_BASE_URL}/reviews/assigned`, {
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
      if (!selectedReview || !selectedReview.proposal) {
        throw new Error("No review selected")
      }
      const token = authStorage.getToken()
      const res = await fetch(`${API_BASE_URL}/reviews/${selectedReview.proposal._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      
      // Refresh the reviews list
      const refreshRes = await fetch(`${API_BASE_URL}/reviews/assigned`, {
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
      <header className="bg-white border-b px-3 sm:px-4 md:px-6 py-3 md:py-4 shadow-sm w-full mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Reviewer Dashboard</h1>
      </header>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base ml-0 md:ml-16">Review and evaluate research proposals</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card className="p-3 sm:p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-xs md:text-sm font-medium">Total Assigned</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{assignedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Reviews assigned to you</p>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-xs md:text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-xs md:text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{completedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Reviews submitted</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-xs sm:text-sm md:text-base">Loading assigned reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 sm:py-8 text-red-600 text-xs sm:text-sm md:text-base">{error}</div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Pending Reviews */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Pending Reviews</CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">Proposals awaiting your review and evaluation</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <p className="text-xs sm:text-sm md:text-base">No pending reviews at the moment.</p>
                  </div>
                ) : isMobile ? (
                  // Mobile Card View
                  <div className="space-y-3">
                    {pendingReviews.map((review) => (
                      <MobileReviewCard
                        key={review._id}
                        review={review}
                        onView={(proposal) => setViewProposal(proposal)}
                        onReview={(review) => setSelectedReview(review)}
                      />
                    ))}
                  </div>
                ) : (
                  // Desktop Table View
                  <div className="w-full overflow-hidden">
                    <div className="w-full">
                      <Table className="w-full text-xs sm:text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[30%]">Proposal Title</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[20%]">Researcher</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Funding</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%] sm:w-[10%]">Status</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                          <TableBody>
                            {pendingReviews.map((review) => (
                              <TableRow key={review._id}>
                                <TableCell className="font-medium text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                                  {review.proposal?.title}
                                </TableCell>
                                <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                                  <div className="flex flex-col">
                                    <span className="truncate">{review.proposal?.researcher?.firstName}</span>
                                    <span className="truncate">{review.proposal?.researcher?.lastName}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">${review.proposal?.funding?.toLocaleString()}</TableCell>
                                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                                  <Badge className="bg-blue-100 text-blue-800 text-xs whitespace-nowrap">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" /> 
                                    <span className="hidden sm:inline">Pending</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => setViewProposal(review.proposal)}
                                          className="text-xs h-8 md:h-9 px-2 md:px-3"
                                        >
                                          <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                          <span className="hidden sm:inline">View</span>
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="default"
                                          onClick={() => setSelectedReview(review)}
                                          className="text-xs h-8 md:h-9 px-2 md:px-3"
                                        >
                                    <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                          <span className="hidden sm:inline">Review</span>
                                        </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Reviews */}
            {completedReviews.length > 0 && (
              <Card>
                <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Completed Reviews</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">Reviews you have submitted</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {isMobile ? (
                    // Mobile Card View
                    <div className="space-y-3">
                      {completedReviews.map((review) => (
                        <MobileReviewCard
                          key={review._id}
                          review={review}
                          onView={(proposal) => setViewProposal(proposal)}
                          onReview={(review) => setSelectedReview(review)}
                        />
                      ))}
                    </div>
                  ) : (
                    // Desktop Table View
                  <div className="w-full overflow-hidden">
                    <div className="w-full">
                      <Table className="w-full text-xs sm:text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[30%]">Proposal Title</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[20%]">Researcher</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Decision</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%] sm:w-[10%]">Review Date</TableHead>
                            <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[15%]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                          <TableBody>
                            {completedReviews.map((review) => (
                              <TableRow key={review._id}>
                                <TableCell className="font-medium text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                                  {review.proposal?.title}
                                </TableCell>
                                <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                                  <div className="flex flex-col">
                                    <span className="truncate">{review.proposal?.researcher?.firstName}</span>
                                    <span className="truncate">{review.proposal?.researcher?.lastName}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                                  <Badge className={
                                    review.decision === "Approved" ? "bg-green-100 text-green-800 text-xs whitespace-nowrap" :
                                    review.decision === "Rejected" ? "bg-red-100 text-red-800 text-xs whitespace-nowrap" :
                                    "bg-orange-100 text-orange-800 text-xs whitespace-nowrap"
                                  }>
                                    {review.decision}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                                  {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => setViewProposal(review.proposal)}
                                        className="text-xs h-8 md:h-9 px-2 md:px-3"
                                      >
                                        <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                        <span className="hidden sm:inline">View</span>
                                      </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Modals - Outside conditional rendering for proper display */}
        {viewProposal && (
          <Dialog open={!!viewProposal} onOpenChange={() => setViewProposal(null)}>
            <ProposalViewModal
              proposal={viewProposal}
              onClose={() => setViewProposal(null)}
            />
          </Dialog>
        )}
        
        {selectedReview && selectedReview !== null && (
          <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
            <ReviewModal
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
              onSubmit={handleSubmitReview}
            />
          </Dialog>
        )}
      </div>
    </ReviewerLayout>
  )
}