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
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { authStorage } from "@/lib/auth"

function ProposalViewModal({ proposal, onClose, reviewer }: { proposal: any; onClose: () => void; reviewer?: any }) {
  return (
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
      <DialogHeader className="space-y-2 sm:space-y-3">
        <DialogTitle className="text-base sm:text-lg md:text-xl break-words">{proposal.title}</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm md:text-base">
          Submitted by {proposal.researcher?.firstName} {proposal.researcher?.lastName} from {proposal.researcher?.institution}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
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
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">Abstract</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base break-words max-h-40 sm:max-h-48 overflow-y-auto">{proposal.abstract}</p>
          </CardContent>
        </Card>
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm">Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function AdminDashboard() {
  useAuthRedirect(["admin"])
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const [viewProposal, setViewProposal] = useState<any | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [reviewers, setReviewers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>

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
    toast({
      title: "View Proposal",
      description: `Viewing details for "${submission.title}"`,
    })
  }

  return (
    <AdminLayout active="dashboard" title="Admin Dashboard">
             <main className="p-3 sm:p-4 md:p-6 w-full overflow-hidden">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs md:text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xl md:text-2xl font-bold">{totalProposals}</div>
              <p className="text-xs text-muted-foreground">Total proposals submitted</p>
            </CardContent>
          </Card>
          <Card className="p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs md:text-sm font-medium">Approved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xl md:text-2xl font-bold">{approvedProposals}</div>
              <p className="text-xs text-muted-foreground">Total approved proposals</p>
            </CardContent>
          </Card>
          <Card className="p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xl md:text-2xl font-bold">{pendingProposals}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment or review</p>
            </CardContent>
          </Card>
          <Card className="p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs md:text-sm font-medium">Rejected</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xl md:text-2xl font-bold">{rejectedProposals}</div>
              <p className="text-xs text-muted-foreground">Total rejected proposals</p>
            </CardContent>
          </Card>
          <Card className="p-4 md:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-xs md:text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="text-xl md:text-2xl font-bold">${totalFunding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awarded this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Submissions</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Monthly proposal submissions and approvals</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#3B82F6" name="Submissions" />
                    <Bar dataKey="approved" fill="#10B981" name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Proposals by Category</CardTitle>
              <CardDescription className="text-xs sm:text-sm md:text-base">Distribution of research categories</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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

                 {/* All Submissions Table */}
         <Card className="overflow-hidden">
           <CardHeader className="pb-3 md:pb-4">
             <CardTitle className="text-lg md:text-xl">All Submissions</CardTitle>
             <CardDescription className="text-sm md:text-base">Manage and assign reviewers to proposals</CardDescription>
           </CardHeader>
           <CardContent className="p-0 md:p-6 overflow-hidden">
            <div className="w-full overflow-hidden">
              <div className="w-full">
                <Table className="w-full">
                                     <TableHeader>
                     <TableRow>
                       <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[20%]">Title</TableHead>
                       <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[20%] sm:w-[15%]">Researcher</TableHead>
                       <TableHead className="hidden sm:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%]">Institution</TableHead>
                       <TableHead className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Date</TableHead>
                       <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[20%]">Funding</TableHead>
                       <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[10%]">Status</TableHead>
                       <TableHead className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Reviewer</TableHead>
                       <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%] sm:w-[15%]">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {proposals.map((submission) => (
                      <TableRow key={submission._id}>
                                               <TableCell className="font-medium text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                         {submission.title}
                       </TableCell>
                       <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                         <div className="flex flex-col">
                           <span className="truncate">{submission.researcher?.firstName}</span>
                           <span className="truncate">{submission.researcher?.lastName}</span>
                         </div>
                       </TableCell>
                       <TableCell className="hidden sm:table-cell text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                         {submission.researcher?.institution}
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
                       <TableCell className="hidden lg:table-cell text-xs md:text-sm truncate px-2 md:px-4 py-2 md:py-3">
                         {submission.reviewer
                           ? reviewers.find((r) => r._id === submission.reviewer)?.firstName + ' ' + reviewers.find((r) => r._id === submission.reviewer)?.lastName
                           : "Not assigned"}
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
            </div>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  )
} 