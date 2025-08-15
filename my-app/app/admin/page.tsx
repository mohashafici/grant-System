"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { authStorage } from "@/lib/auth"

function ProposalViewModal({ proposal, onClose, reviewer }: { proposal: any; onClose: () => void; reviewer?: any }) {
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
      <DialogHeader className="space-y-2 sm:space-y-3">
        <DialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl break-words leading-tight">{proposal.title}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm md:text-base">
          Submitted by {proposal.researcher?.firstName} {proposal.researcher?.lastName} from {proposal.researcher?.institution}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Basic Information */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Proposal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Abstract</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4 md:pb-6">
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base break-words max-h-40 sm:max-h-48 overflow-y-auto">{proposal.abstract}</p>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        {(proposal.personnelCosts || proposal.equipmentCosts || proposal.materialsCosts || proposal.travelCosts || proposal.otherCosts) && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4 md:pb-6">
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
                      onClick={() => handleDownload(proposal.proposalDocument, 'Proposal Document')}
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
                      onClick={() => handleDownload(proposal.cvResume, 'CV Resume')}
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
                        onClick={() => handleDownload(doc, `Additional Document ${index + 1}`)}
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

        {/* Legacy Attachments (keeping for backward compatibility) */}
        {proposal.attachments && proposal.attachments.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Legacy Attachments</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="space-y-2">
                {proposal.attachments.map((attachment: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{attachment.split('/').pop()}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline" 
                      onClick={() => handleDownload(attachment, attachment.split('/').pop() || 'file')}
                      className="h-7 w-7 sm:h-8 sm:w-auto sm:px-2 sm:px-3 p-0"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline sm:ml-1">Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

// Mobile-friendly table component
function MobileProposalCard({ submission, onView, onAssign, reviewers }: { 
  submission: any; 
  onView: (submission: any) => void; 
  onAssign: (submission: any) => void;
  reviewers: any[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending Assignment":
        return "bg-red-100 text-red-800"
      case "Rejected":
        return "bg-gray-300 text-gray-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="mb-3 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 flex-1 mr-2">{submission.title}</h3>
          <Badge className={`${getStatusColor(submission.status)} text-xs whitespace-nowrap flex-shrink-0`}>
            {submission.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">Researcher:</span>
            <p className="font-medium">{submission.researcher?.firstName} {submission.researcher?.lastName}</p>
          </div>
          <div>
            <span className="text-gray-500">Institution:</span>
            <p className="font-medium truncate">{submission.researcher?.institution}</p>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium">{submission.dateSubmitted ? new Date(submission.dateSubmitted).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Funding:</span>
            <p className="font-semibold text-blue-600">${submission.funding?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onView(submission)
            }}
            className="flex-1 h-8 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          {submission.status === "Pending Assignment" && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 flex-1 h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onAssign(submission)
              }}
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Assign
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function AdminDashboard() {
  useAuthRedirect(["admin"])
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const [viewProposal, setViewProposal] = useState<any | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [reviewers, setReviewers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = authStorage.getToken()
      // Fetch all grants
      const grantsRes = await fetch(`${API_BASE_URL}/grants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const grants = await grantsRes.json()
      // Fetch all proposals for each grant
      let allProposals: any[] = []
      for (const grant of grants) {
        const proposalsRes = await fetch(`${API_BASE_URL}/proposals/grant/${grant._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (proposalsRes.ok) {
          const proposals = await proposalsRes.json()
          for (const proposal of proposals) {
            allProposals.push({ ...proposal, grantTitle: grant.title })
          }
        }
      }
      setProposals(allProposals)
      // Fetch reviewers
      const reviewersRes = await fetch(`${API_BASE_URL}/users/reviewers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (reviewersRes.ok) {
        setReviewers(await reviewersRes.json())
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Stats
  const totalProposals = proposals.length
  const approvedProposals = proposals.filter((p) => p.status === "Approved").length
  const pendingProposals = proposals.filter((p) => p.status === "Under Review" || p.status === "Pending Assignment").length
  const rejectedProposals = proposals.filter((p) => p.status === "Rejected").length
  const totalFunding = proposals
    .filter((p) => p.status === "Approved")
    .reduce((sum, p) => sum + (parseFloat(p.funding) || 0), 0)

  // Chart data
  const submissionsByMonth: Record<string, { submissions: number, approved: number }> = {}
  const categoryMap: Record<string, number> = {}
  proposals.forEach((p) => {
    // Submissions by month
    const date = p.dateSubmitted ? new Date(p.dateSubmitted) : null
    if (date) {
      const month = date.toLocaleString('default', { month: 'short' })
      if (!submissionsByMonth[month]) submissionsByMonth[month] = { submissions: 0, approved: 0 }
      submissionsByMonth[month].submissions++
      if (p.status === "Approved") submissionsByMonth[month].approved++
    }
    // Category data
    if (p.category) {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
    }
  })
  const submissionsData = Object.keys(submissionsByMonth).map(month => ({
    month,
    submissions: submissionsByMonth[month].submissions,
    approved: submissionsByMonth[month].approved,
  }))
  const categoryColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#E11D48"]
  const categoryData = Object.keys(categoryMap).map((cat, i) => ({
    name: cat,
    value: categoryMap[cat],
    color: categoryColors[i % categoryColors.length],
  }))

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending Assignment":
        return "bg-red-100 text-red-800"
      case "Rejected":
        return "bg-gray-300 text-gray-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewProposal = (submission: any) => {
    setViewProposal(submission)
  }

  const handleAssignReviewer = (submission: any) => {
    setSelectedSubmission(submission)
    toast({
      title: "Assign Reviewer",
      description: `Assigning reviewer to "${submission.title}"`,
    })
  }

  return (
    <AdminLayout active="dashboard" title="Admin Dashboard">
      <main className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-hidden">
        {/* Stats Cards - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-sm md:text-base font-medium">Total Proposals</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalProposals}</div>
              <p className="text-xs text-muted-foreground">Total proposals submitted</p>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-sm md:text-base font-medium">Approved</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{approvedProposals}</div>
              <p className="text-xs text-muted-foreground">Total approved proposals</p>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-sm md:text-base font-medium">Pending Review</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{pendingProposals}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment or review</p>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-sm md:text-base font-medium">Rejected</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{rejectedProposals}</div>
              <p className="text-xs text-muted-foreground">Total rejected proposals</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 p-2 sm:p-3 md:p-4 lg:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-0 pt-0">
              <CardTitle className="text-xs sm:text-sm md:text-base font-medium">Total Funding</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">${totalFunding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awarded this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Submissions</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Monthly proposal submissions and approvals</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#3B82F6" name="Submissions" />
                    <Bar dataKey="approved" fill="#10B981" name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Proposals by Category</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Distribution of research categories</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-4 lg:px-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Submissions - Mobile/Desktop responsive */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">All Submissions</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">Manage and assign reviewers to proposals</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 overflow-hidden">
            {/* Mobile View */}
            {isMobile ? (
              <div className="p-2 sm:p-3 md:p-4">
                {proposals.map((submission) => (
                  <MobileProposalCard
                    key={submission._id}
                    submission={submission}
                    onView={handleViewProposal}
                    onAssign={handleAssignReviewer}
                    reviewers={reviewers}
                  />
                ))}
                {/* Modal for mobile view */}
                {viewProposal && (
                  <Dialog open={!!viewProposal} onOpenChange={() => setViewProposal(null)}>
                    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
                      <ProposalViewModal
                        proposal={viewProposal}
                        reviewer={reviewers.find((r) => r._id === viewProposal.reviewer)}
                        onClose={() => setViewProposal(null)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              /* Desktop Table View */
              <div className="w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[20%]">Title</TableHead>
                      <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%]">Researcher</TableHead>
                      <TableHead className="hidden sm:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%]">Institution</TableHead>
                      <TableHead className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[12%]">Date</TableHead>
                      <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[12%]">Funding</TableHead>
                      <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[12%]">Status</TableHead>
                      <TableHead className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[12%]">Reviewer</TableHead>
                      <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[12%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 max-w-0">
                          <div className="truncate" title={submission.title}>
                          {submission.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{submission.researcher?.firstName}</span>
                            <span className="truncate">{submission.researcher?.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 max-w-0">
                          <div className="truncate" title={submission.researcher?.institution}>
                          {submission.researcher?.institution}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs md:text-sm whitespace-nowrap px-2 md:px-4 py-2 md:py-3">
                          {submission.dateSubmitted ? new Date(submission.dateSubmitted).toLocaleDateString() : ''}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600 text-xs md:text-sm whitespace-nowrap px-2 md:px-4 py-2 md:py-3">
                          ${submission.funding?.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-2 md:px-4 py-2 md:py-3">
                          <Badge className={`${getStatusColor(submission.status)} text-xs whitespace-nowrap`}>
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 max-w-0">
                          <div className="truncate">
                          {submission.reviewer
                            ? reviewers.find((r) => r._id === submission.reviewer)?.firstName + ' ' + reviewers.find((r) => r._id === submission.reviewer)?.lastName
                            : "Not assigned"}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 md:px-4 py-2 md:py-3">
                          <div className="flex flex-col gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setViewProposal(submission)}
                                  className="text-xs h-7 w-7 md:h-8 md:w-auto md:px-2 md:px-3 p-0"
                                >
                                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="hidden md:inline md:ml-1">View</span>
                                </Button>
                              </DialogTrigger>
                              {viewProposal && viewProposal._id === submission._id && (
                                <ProposalViewModal
                                  proposal={viewProposal}
                                  reviewer={reviewers.find((r) => r._id === viewProposal.reviewer)}
                                  onClose={() => setViewProposal(null)}
                                />
                              )}
                            </Dialog>
                            {submission.status === "Pending Assignment" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-xs h-7 w-7 md:h-8 md:w-auto md:px-2 md:px-3 p-0"
                                    onClick={() => setSelectedSubmission(submission)}
                                  >
                                    <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden md:inline md:ml-1">Assign</span>
                                  </Button>
                                </DialogTrigger>
                                {selectedSubmission && (
                                  <div>Assign functionality not implemented</div>
                                )}
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  )
} 