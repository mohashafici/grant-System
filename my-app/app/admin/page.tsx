"use client"

import { useState } from "react"
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

const submissionsData = [
  { month: "Jan", submissions: 45, approved: 12 },
  { month: "Feb", submissions: 52, approved: 15 },
  { month: "Mar", submissions: 38, approved: 10 },
  { month: "Apr", submissions: 61, approved: 18 },
  { month: "May", submissions: 55, approved: 16 },
  { month: "Jun", submissions: 48, approved: 14 },
]

const categoryData = [
  { name: "Technology", value: 35, color: "#3B82F6" },
  { name: "Healthcare", value: 28, color: "#10B981" },
  { name: "Environment", value: 22, color: "#F59E0B" },
  { name: "Social Sciences", value: 15, color: "#EF4444" },
]

const allSubmissions = [
  {
    id: 1,
    title: "AI-Powered Medical Diagnosis System",
    researcher: "Dr. Sarah Johnson",
    institution: "Stanford University",
    submissionDate: "2024-01-15",
    funding: "$75,000",
    status: "Under Review",
    reviewer: "Prof. David Martinez",
  },
  {
    id: 2,
    title: "Sustainable Energy Storage Solutions",
    researcher: "Prof. Michael Chen",
    institution: "MIT",
    submissionDate: "2024-01-20",
    funding: "$50,000",
    status: "Pending Assignment",
    reviewer: null,
  },
  {
    id: 3,
    title: "Quantum Computing Applications",
    researcher: "Dr. Emily Rodriguez",
    institution: "Caltech",
    submissionDate: "2024-01-10",
    funding: "$100,000",
    status: "Approved",
    reviewer: "Dr. Lisa Zhang",
  },
]

const reviewers = [
  { id: 1, name: "Prof. David Martinez", expertise: "AI & Machine Learning", workload: 3 },
  { id: 2, name: "Dr. Lisa Zhang", expertise: "Computer Science", workload: 2 },
  { id: 3, name: "Prof. Robert Kim", expertise: "Environmental Science", workload: 1 },
  { id: 4, name: "Dr. Maria Santos", expertise: "Healthcare Technology", workload: 4 },
]

function AssignReviewerModal({ submission, onClose }: { submission: any; onClose: () => void }) {
  const [selectedReviewer, setSelectedReviewer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleAssign = async () => {
    if (!selectedReviewer) {
      toast({
        title: "Validation Error",
        description: "Please select a reviewer",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // TODO: Connect to backend to assign reviewer
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Reviewer Assigned",
        description: `Reviewer has been successfully assigned to "${submission.title}"`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign reviewer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Assign Reviewer</DialogTitle>
        <DialogDescription>Assign a reviewer to: {submission.title}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select Reviewer</Label>
          <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a reviewer" />
            </SelectTrigger>
            <SelectContent>
              {reviewers.map((reviewer) => (
                <SelectItem key={reviewer.id} value={reviewer.id.toString()}>
                  {reviewer.name} - {reviewer.expertise} (Workload: {reviewer.workload})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={handleAssign} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              "Assign Reviewer"
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function AdminDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending Assignment":
        return "bg-red-100 text-red-800"
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
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">27% approval rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.1M</div>
              <p className="text-xs text-muted-foreground">Awarded this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Submission Trends</CardTitle>
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
                    label={({ name, value }) => `${name}: ${value}%`}
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
                {allSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.title}</TableCell>
                    <TableCell>{submission.researcher}</TableCell>
                    <TableCell>{submission.institution}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell className="font-semibold text-blue-600">{submission.funding}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    </TableCell>
                    <TableCell>{submission.reviewer || "Not assigned"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProposal(submission)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
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