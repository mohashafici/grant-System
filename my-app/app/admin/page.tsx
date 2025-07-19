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

// function AssignReviewerModal({ submission, onClose }: { submission: any; onClose: () => void }) {
//   const [selectedReviewer, setSelectedReviewer] = useState("")
//   const [submitting, setSubmitting] = useState(false)
//   const { toast } = useToast()

//   const handleAssign = async () => {
//     if (!selectedReviewer) {
//       toast({
//         title: "Validation Error",
//         description: "Please select a reviewer",
//         variant: "destructive",
//       })
//       return
//     }

//     setSubmitting(true)
//     try {
//       // TODO: Connect to backend to assign reviewer
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000))
      
//       toast({
//         title: "Reviewer Assigned",
//         description: `Reviewer has been successfully assigned to "${submission.title}"`,
//       })
//       onClose()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to assign reviewer. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>Assign Reviewer</DialogTitle>
//         <DialogDescription>Assign a reviewer to: {submission.title}</DialogDescription>
//       </DialogHeader>
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label>Select Reviewer</Label>
//           <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a reviewer" />
//             </SelectTrigger>
//             <SelectContent>
//               {/* Reviewers should be fetched from the backend */}
//               {/* For now, we'll use a static list */}
//               {/* Replace this with actual reviewer data */}
//               {/* {reviewers.map((reviewer) => (
//                 <SelectItem key={reviewer.id} value={reviewer.id.toString()}>
//                   {reviewer.name} - {reviewer.expertise} (Workload: {reviewer.workload})
//                 </SelectItem>
//               ))} */}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex space-x-3">
//           <Button 
//             onClick={handleAssign} 
//             className="bg-blue-600 hover:bg-blue-700"
//             disabled={submitting}
//           >
//             {submitting ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Assigning...
//               </>
//             ) : (
//               "Assign Reviewer"
//             )}
//           </Button>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </DialogContent>
//   )
// }

function ProposalViewModal({ proposal, onClose, reviewer }: { proposal: any; onClose: () => void; reviewer?: any }) {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{proposal.title}</DialogTitle>
        <DialogDescription>
          Submitted by {proposal.researcher?.firstName} {proposal.researcher?.lastName} from {proposal.researcher?.institution}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{proposal.abstract}</p>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminDashboard() {
  useAuthRedirect(["admin"])
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const [viewProposal, setViewProposal] = useState<any | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [reviewers, setReviewers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      // Fetch all grants
      const grantsRes = await fetch("http://localhost:5000/api/grants", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const grants = await grantsRes.json()
      // Fetch all proposals for each grant
      let allProposals: any[] = []
      for (const grant of grants) {
        const proposalsRes = await fetch(`http://localhost:5000/api/proposals/grant/${grant._id}`, {
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
      const reviewersRes = await fetch("http://localhost:5000/api/users/reviewers", {
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
    // TODO: Implement view proposal functionality
  }

  return (
    <AdminLayout active="dashboard">
      <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProposals}</div>
              <p className="text-xs text-muted-foreground">Total proposals submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedProposals}</div>
              <p className="text-xs text-muted-foreground">Total approved proposals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProposals}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment or review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedProposals}</div>
              <p className="text-xs text-muted-foreground">Total rejected proposals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFunding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awarded this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>Monthly proposal submissions and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={submissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#3B82F6" name="Submissions" />
                  <Bar dataKey="approved" fill="#10B981" name="Approved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposals by Category</CardTitle>
              <CardDescription>Distribution of research categories</CardDescription>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* All Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>Manage and assign reviewers to proposals</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposal Title</TableHead>
                  <TableHead>Researcher</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium">{submission.title}</TableCell>
                    <TableCell>
                      {submission.researcher?.firstName} {submission.researcher?.lastName}
                    </TableCell>
                    <TableCell>{submission.researcher?.institution}</TableCell>
                    <TableCell>{submission.dateSubmitted ? new Date(submission.dateSubmitted).toLocaleDateString() : ''}</TableCell>
                    <TableCell className="font-semibold text-blue-600">${submission.funding?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {submission.reviewer
                        ? reviewers.find((r) => r._id === submission.reviewer)?.firstName + ' ' + reviewers.find((r) => r._id === submission.reviewer)?.lastName
                        : "Not assigned"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setViewProposal(submission)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
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
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <UserPlus className="w-4 h-4 mr-1" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            {selectedSubmission && (
                              <AssignReviewerModal
                                submission={selectedSubmission}
                                onClose={() => setSelectedSubmission(null)}
                              />
                            )}
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  )
} 