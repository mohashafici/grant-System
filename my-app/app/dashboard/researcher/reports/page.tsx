"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
import {
  Home,
  FileText,
  Plus,
  Bell,
  User,
  Award,
  Calendar,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

const projectReports = [
  {
    id: 1,
    projectTitle: "Quantum Computing Applications",
    reportType: "Monthly Progress Report",
    dueDate: "2024-02-01",
    status: "Submitted",
    submissionDate: "2024-01-28",
    progress: 75,
    milestones: [
      { name: "Literature Review", completed: true },
      { name: "Algorithm Development", completed: true },
      { name: "Initial Testing", completed: false },
      { name: "Performance Analysis", completed: false },
    ],
  },
  {
    id: 2,
    projectTitle: "Quantum Computing Applications",
    reportType: "Quarterly Financial Report",
    dueDate: "2024-02-15",
    status: "Overdue",
    submissionDate: null,
    progress: 0,
    milestones: [],
  },
  {
    id: 3,
    projectTitle: "Quantum Computing Applications",
    reportType: "Annual Progress Report",
    dueDate: "2024-03-01",
    status: "Draft",
    submissionDate: null,
    progress: 30,
    milestones: [],
  },
]

function ResearcherSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Grant Portal</h2>
            <p className="text-xs text-muted-foreground">Researcher</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/proposals">
                    <FileText className="w-4 h-4" />
                    <span>My Proposals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/submit">
                    <Plus className="w-4 h-4" />
                    <span>Submit Proposal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/researcher/reports">
                    <FileText className="w-4 h-4" />
                    <span>Progress Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/notifications">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/profile">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function SubmitReportModal({ report, onClose }: { report: any; onClose: () => void }) {
  const [reportData, setReportData] = useState({
    executiveSummary: "",
    progressUpdate: "",
    challenges: "",
    nextSteps: "",
    budgetUpdate: "",
    milestoneStatus: "",
  })

  const handleSubmit = () => {
    console.log("Submitting report:", reportData)
    onClose()
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Submit {report.reportType}</DialogTitle>
        <DialogDescription>Project: {report.projectTitle}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-medium">Report Type</Label>
            <p className="text-sm text-gray-600">{report.reportType}</p>
          </div>
          <div>
            <Label className="font-medium">Due Date</Label>
            <p className="text-sm text-gray-600">{report.dueDate}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="executive-summary">Executive Summary *</Label>
            <Textarea
              id="executive-summary"
              placeholder="Provide a brief overview of progress and key achievements..."
              rows={4}
              value={reportData.executiveSummary}
              onChange={(e) => setReportData({ ...reportData, executiveSummary: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress-update">Progress Update *</Label>
            <Textarea
              id="progress-update"
              placeholder="Describe the work completed during this reporting period..."
              rows={6}
              value={reportData.progressUpdate}
              onChange={(e) => setReportData({ ...reportData, progressUpdate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges and Issues</Label>
            <Textarea
              id="challenges"
              placeholder="Describe any challenges encountered and how they were addressed..."
              rows={4}
              value={reportData.challenges}
              onChange={(e) => setReportData({ ...reportData, challenges: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-steps">Next Steps</Label>
            <Textarea
              id="next-steps"
              placeholder="Outline planned activities for the next reporting period..."
              rows={4}
              value={reportData.nextSteps}
              onChange={(e) => setReportData({ ...reportData, nextSteps: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-update">Budget Update</Label>
            <Textarea
              id="budget-update"
              placeholder="Provide an update on budget utilization and any variances..."
              rows={3}
              value={reportData.budgetUpdate}
              onChange={(e) => setReportData({ ...reportData, budgetUpdate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-status">Milestone Status</Label>
            <Textarea
              id="milestone-status"
              placeholder="Update the status of project milestones..."
              rows={3}
              value={reportData.milestoneStatus}
              onChange={(e) => setReportData({ ...reportData, milestoneStatus: e.target.value })}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload Supporting Files</p>
              <p className="text-sm text-gray-500 mb-4">Charts, graphs, publications, etc. (PDF, DOC, XLS)</p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Save as Draft
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Report
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Submitted":
      return "bg-green-100 text-green-800"
    case "Overdue":
      return "bg-red-100 text-red-800"
    case "Draft":
      return "bg-yellow-100 text-yellow-800"
    case "Due Soon":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Submitted":
      return <CheckCircle className="w-4 h-4" />
    case "Overdue":
      return <AlertTriangle className="w-4 h-4" />
    case "Draft":
      return <Clock className="w-4 h-4" />
    case "Due Soon":
      return <Clock className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ResearcherSidebar />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Progress Reports</h1>
                  <p className="text-gray-600">Track and submit project progress reports</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectReports.length}</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projectReports.filter((r) => r.status === "Submitted").length}
                  </div>
                  <p className="text-xs text-muted-foreground">On time submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {projectReports.filter((r) => r.status === "Overdue").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectReports.filter((r) => r.status === "Draft").length}</div>
                  <p className="text-xs text-muted-foreground">Being prepared</p>
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Required Reports</h2>
              </div>

              <div className="grid gap-6">
                {projectReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{report.reportType}</CardTitle>
                          <CardDescription>Project: {report.projectTitle}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium">Due Date</Label>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {report.dueDate}
                            </div>
                          </div>
                          {report.submissionDate && (
                            <div>
                              <Label className="font-medium">Submitted</Label>
                              <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {report.submissionDate}
                              </div>
                            </div>
                          )}
                        </div>

                        {report.progress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Completion Progress</span>
                              <span>{report.progress}%</span>
                            </div>
                            <Progress value={report.progress} className="h-2" />
                          </div>
                        )}

                        {report.milestones.length > 0 && (
                          <div>
                            <Label className="font-medium">Project Milestones</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {report.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      milestone.completed ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm">{milestone.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          {report.status === "Submitted" ? (
                            <>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline">
                                View Feedback
                              </Button>
                            </>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className={`${
                                    report.status === "Overdue"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Upload className="w-4 h-4 mr-1" />
                                  {report.status === "Draft" ? "Continue Report" : "Submit Report"}
                                </Button>
                              </DialogTrigger>
                              {selectedReport && (
                                <SubmitReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
                              )}
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reporting Guidelines */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Reporting Guidelines</CardTitle>
                <CardDescription>Important information about progress reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Report Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Submit reports by the specified due date</li>
                      <li>• Include detailed progress updates</li>
                      <li>• Provide budget utilization information</li>
                      <li>• Update milestone completion status</li>
                      <li>• Attach supporting documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Submission Process</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Reports can be saved as drafts</li>
                      <li>• Final submission requires all required fields</li>
                      <li>• Late submissions may affect future funding</li>
                      <li>• Contact support for deadline extensions</li>
                      <li>• Feedback will be provided within 5 business days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
