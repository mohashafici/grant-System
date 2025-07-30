"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, UserCheck, Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

// Proposal View Modal Component
function ProposalViewModal({ proposal, onClose }: { proposal: any; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
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
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Proposal Document</p>
                          <p className="text-sm text-gray-500">Main proposal file</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {proposal.cvResume && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">CV/Resume</p>
                          <p className="text-sm text-gray-500">Researcher's CV</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {proposal.additionalDocuments && proposal.additionalDocuments.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Additional Documents</p>
                      {proposal.additionalDocuments.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="font-medium">{doc.name || `Document ${index + 1}`}</p>
                              <p className="text-sm text-gray-500">Additional file</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
    </Dialog>
  );
}

export default function AdminProposalsPage() {
  useAuthRedirect(["admin"])
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [viewProposal, setViewProposal] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState("dateSubmitted");
  const [sortOrder, setSortOrder] = useState("desc");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch proposals and reviewers
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError("");
      try {
        const token = authStorage.getToken();
        // Fetch all grants first
        const grantsRes = await fetch(`${API_BASE_URL}/grants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!grantsRes.ok) throw new Error("Failed to fetch grants");
        const grants = await grantsRes.json();
        // Fetch proposals for each grant
        const allProposals: any[] = [];
        for (const grant of grants) {
          const proposalsRes = await fetch(`${API_BASE_URL}/proposals/grant/${grant._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (proposalsRes.ok) {
            const proposals = await proposalsRes.json();
            for (const proposal of proposals) {
              allProposals.push({ ...proposal, grantTitle: grant.title });
            }
          }
        }
        setProposals(allProposals);
      } catch (err: any) {
        setError(err.message || "Error fetching proposals");
      } finally {
        setLoading(false);
      }
    };
    const fetchReviewers = async () => {
      try {
        const token = authStorage.getToken();
        const res = await fetch(`${API_BASE_URL}/users/reviewers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reviewers");
        const data = await res.json();
        setReviewers(data);
      } catch {
        setReviewers([]);
      }
    };
    fetchProposals();
    fetchReviewers();
  }, []);

  // Sort and filter proposals
  const getSortedAndFilteredProposals = () => {
    let filtered = proposals;

    // Sort proposals
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "researcher":
          aValue = `${a.researcher?.firstName || ""} ${a.researcher?.lastName || ""}`.toLowerCase();
          bValue = `${b.researcher?.firstName || ""} ${b.researcher?.lastName || ""}`.toLowerCase();
          break;
        case "status":
          aValue = a.status?.toLowerCase() || "";
          bValue = b.status?.toLowerCase() || "";
          break;
        case "category":
          aValue = a.category?.toLowerCase() || "";
          bValue = b.category?.toLowerCase() || "";
          break;
        case "funding":
          aValue = parseFloat(a.funding) || 0;
          bValue = parseFloat(b.funding) || 0;
          break;
        case "dateSubmitted":
        default:
          aValue = new Date(a.dateSubmitted || 0).getTime();
          bValue = new Date(b.dateSubmitted || 0).getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleAssignReviewer = async () => {
    if (!selectedProposal || !selectedReviewer) {
      setAssignError("Please select both a proposal and a reviewer");
      return;
    }

    setAssigning(true);
    setAssignError("");
    try {
      const token = authStorage.getToken();
      const res = await fetch(`${API_BASE_URL}/proposals/${selectedProposal._id}/assign-reviewer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewerId: selectedReviewer }),
      });

      if (!res.ok) throw new Error("Failed to assign reviewer");

      // Update the proposal in the local state
      setProposals(prev => prev.map(p => 
        p._id === selectedProposal._id 
          ? { ...p, reviewer: selectedReviewer }
          : p
      ));

      setSelectedProposal(null);
      setSelectedReviewer("");
      alert("Reviewer assigned successfully!");
    } catch (err: any) {
      setAssignError(err.message || "Error assigning reviewer");
    } finally {
      setAssigning(false);
    }
  };

  const getReviewerName = (reviewerId: string) => {
    const reviewer = reviewers.find(r => r._id === reviewerId);
    return reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "Unknown";
  };

  const sortedProposals = getSortedAndFilteredProposals();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading proposals...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Manage Proposals</h1>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateSubmitted">Submission Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="funding">Funding Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortOrder">Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing {sortedProposals.length} of {proposals.length} proposals
              </p>
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Researcher</TableHead>
                <TableHead>Grant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProposals.map((proposal) => (
                <TableRow key={proposal._id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {proposal.title}
                  </TableCell>
                  <TableCell>
                    {proposal.researcher?.firstName} {proposal.researcher?.lastName}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {proposal.grantTitle}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      proposal.status === "Approved" ? "default" :
                      proposal.status === "Rejected" ? "destructive" :
                      proposal.status === "Under Review" ? "secondary" :
                      "outline"
                    }>
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{proposal.category}</TableCell>
                  <TableCell>${proposal.funding?.toLocaleString()}</TableCell>
                  <TableCell>
                    {proposal.reviewer ? getReviewerName(proposal.reviewer) : "Not assigned"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewProposal(proposal)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!proposal.reviewer && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProposal(proposal)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Assign Reviewer Modal */}
        {selectedProposal && (
          <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Reviewer</DialogTitle>
                <DialogDescription>
                  Assign a reviewer to "{selectedProposal.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reviewer">Select Reviewer</Label>
                  <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {reviewers.map((reviewer) => (
                        <SelectItem key={reviewer._id} value={reviewer._id}>
                          {reviewer.firstName} {reviewer.lastName} - {reviewer.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {assignError && (
                  <p className="text-red-600 text-sm">{assignError}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProposal(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignReviewer}
                    disabled={assigning || !selectedReviewer}
                  >
                    {assigning ? "Assigning..." : "Assign Reviewer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* View Proposal Modal */}
        {viewProposal && (
          <ProposalViewModal
            proposal={viewProposal}
            onClose={() => setViewProposal(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
} 