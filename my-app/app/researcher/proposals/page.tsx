"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Eye,
  Edit,
  Trash2,
  Award,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle,
  Clipboard,
} from "lucide-react"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"

// function ResearcherSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader className="border-b">
//         <div className="flex items-center space-x-3 p-2">
//           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//             <Award className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h2 className="font-semibold">Grant Portal</h2>
//             <p className="text-xs text-muted-foreground">Researcher</p>
//           </div>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/researcher">
//                     <Home className="w-4 h-4" />
//                     <span>Home</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild isActive>
//                   <Link href="/researcher/proposals">
//                     <FileText className="w-4 h-4" />
//                     <span>My Proposals</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/researcher/submit">
//                     <Plus className="w-4 h-4" />
//                     <span>Submit Proposal</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/notifications">
//                     <Bell className="w-4 h-4" />
//                     <span>Notifications</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/researcher/profile">
//                     <User className="w-4 h-4" />
//                     <span>Profile</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }

function ProposalDetailsModal({ proposal, onClose }: { proposal: any; onClose: () => void }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{proposal.title}</DialogTitle>
        <DialogDescription>Proposal Details and Status Information</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Proposal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={`ml-2 ${getStatusColor(proposal.status)}`}>
                  {getStatusIcon(proposal.status)} {proposal.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <span className="ml-2">{proposal.category}</span>
              </div>
              {proposal.grantTitle && (
                <div>
                  <span className="font-medium">Grant:</span>
                  <span className="ml-2">{proposal.grantTitle}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Funding Requested:</span>
                <span className="ml-2 text-blue-600 font-semibold">${proposal.funding?.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Deadline:</span>
                <span className="ml-2">{new Date(proposal.deadline).toLocaleDateString()}</span>
              </div>
              {proposal.dateSubmitted && (
                <div>
                  <span className="font-medium">Submitted:</span>
                  <span className="ml-2">{new Date(proposal.dateSubmitted).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card> */}
            {/* <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader> */}
            {/* <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{proposal.progress}%</span>
                </div>
                <Progress value={proposal.progress} className="h-3" />
                <div className="text-sm text-gray-600">
                  {proposal.progress === 100 ? "Proposal completed and submitted" : "Proposal in progress"}
                </div>
              </div>
            </CardContent> */}
          {/* </Card> */}
        </div>

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
                  <span className="font-medium">Personnel Costs:</span>
                  <span className="ml-2">${proposal.personnelCosts?.toLocaleString() || "0"}</span>
                </div>
                <div>
                  <span className="font-medium">Equipment:</span>
                  <span className="ml-2">${proposal.equipmentCosts?.toLocaleString() || "0"}</span>
                </div>
                <div>
                  <span className="font-medium">Materials & Supplies:</span>
                  <span className="ml-2">${proposal.materialsCosts?.toLocaleString() || "0"}</span>
                </div>
                <div>
                  <span className="font-medium">Travel:</span>
                  <span className="ml-2">${proposal.travelCosts?.toLocaleString() || "0"}</span>
                </div>
                <div>
                  <span className="font-medium">Other Costs:</span>
                  <span className="ml-2">${proposal.otherCosts?.toLocaleString() || "0"}</span>
                </div>
                <div className="font-medium text-blue-600">
                  <span>Total Budget:</span>
                  <span className="ml-2">${proposal.funding?.toLocaleString()}</span>
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
                      onClick={() => window.open(proposal.proposalDocument, '_blank')}
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
                      onClick={() => window.open(proposal.cvResume, '_blank')}
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
                        onClick={() => window.open(doc, '_blank')}
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

        {proposal.status === "Needs Revision" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">Reviewer Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-yellow-700">The proposal shows promise but requires the following revisions:</p>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>Provide more detailed methodology section</li>
                  <li>Include risk assessment and mitigation strategies</li>
                  <li>Clarify budget allocation for equipment</li>
                  <li>Add timeline with specific milestones</li>
                </ul>
                <div className="pt-3">
                  <Button className="bg-yellow-600 hover:bg-yellow-700">Start Revision</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          {/* <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
          </div> */}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Needs Revision":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return "✅"
    case "Rejected":
      return "❌"
    case "Under Review":
      return "⏳"
    case "Needs Revision":
      return "🔄"
    default:
      return "📄"
  }
}

export default function ResearcherProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [grants, setGrants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProposal, setSelectedProposal] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE_URL}/proposals/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch proposals")
        const data = await res.json()
        setProposals(data)
      } catch (err: any) {
        setError(err.message || "Error fetching proposals")
      } finally {
        setLoading(false)
      }
    }
    const fetchGrants = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/grants`);
        const data = await res.json();
        setGrants(data);
      } catch {
        setGrants([]);
      }
    };
    fetchProposals();
    fetchGrants();
  }, [])

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/proposals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to delete proposal")
      const data = await res.json()
      setProposals(proposals.filter((p) => p._id !== id))
    } catch (err: any) {
      setError(err.message || "Error deleting proposal")
    }
  }

  // Helper to get grant title from id
  const getGrantTitle = (proposal: any) => {
    if (proposal.grantTitle) return proposal.grantTitle;
    if (proposal.grant) {
      const found = grants.find((g) => g._id === proposal.grant);
      return found ? found.title : proposal.grant;
    }
    return "-";
  };

  return (
    <ResearcherLayout active="proposals">
      <main className="p-6">
        <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-gray-900 ml-4">My Proposals</h1>
        </header>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              {/* <SelectItem value="Needs Revision">Needs Revision</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal._id || proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <Clipboard className="w-4 h-4 text-gray-400" />
                    </div>
                    <CardDescription>
                      Grant: {getGrantTitle(proposal)}
                      {/* Deadline: {proposal.deadline} */}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(proposal.status)}>
                      {getStatusIcon(proposal.status)} {proposal.status}
                    </Badge>
                    <span className="text-lg font-semibold text-blue-600">{proposal.funding}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{proposal.progress}%</span>
                    </div>
                    <Progress value={proposal.progress} className="h-2" />
                  </div> */}

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedProposal(proposal)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      {selectedProposal && (
                        <ProposalDetailsModal
                          proposal={selectedProposal}
                          onClose={() => setSelectedProposal(null)}
                        />
                      )}
                    </Dialog>

                    {proposal.status === "Approved" && (
                      <div className="bg-green-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center text-green-800 mb-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="font-medium">Congratulations! Your proposal has been approved for funding.</span>
                        </div>
                        <p className="text-sm text-green-700 mb-2">You will receive an official award letter and next steps soon.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't created any proposals yet."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/researcher/submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Proposal
                </Link>
              </Button>
            )}
          </div>
        )}
      </main>
    </ResearcherLayout>
  )
}
