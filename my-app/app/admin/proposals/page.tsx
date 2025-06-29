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

// Proposal View Modal Component
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
          <Card className="border-2 border-blue-400 bg-blue-50 my-6">
            <CardHeader>
              <CardTitle className="text-blue-900">System Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <span className="text-blue-800">
                  System Recommended Score: <span className="font-bold">{proposal.recommendedScore}/100</span>
                </span>
                <span className="text-blue-800">
                  System Recommendation: <span className="font-bold">{proposal.recommendation}</span>
                </span>
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

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [viewProposal, setViewProposal] = useState<any | null>(null);

  // Fetch proposals and reviewers
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // Fetch all grants first
        const grantsRes = await fetch("http://localhost:5000/api/grants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!grantsRes.ok) throw new Error("Failed to fetch grants");
        const grants = await grantsRes.json();
        // Fetch proposals for each grant
        const allProposals: any[] = [];
        for (const grant of grants) {
          const proposalsRes = await fetch(`http://localhost:5000/api/proposals/grant/${grant._id}`, {
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
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/reviewers", {
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

  // Assign reviewer handler
  const handleAssignReviewer = async () => {
    if (!selectedProposal || !selectedReviewer) return;
    setAssigning(true);
    setAssignError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/proposals/${selectedProposal._id}/assign-reviewer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewerId: selectedReviewer }),
      });
      if (!res.ok) throw new Error("Failed to assign reviewer");
      // Refresh proposals
      setSelectedProposal(null);
      setSelectedReviewer("");
      // Re-fetch proposals
      setLoading(true);
      const grantsRes = await fetch("http://localhost:5000/api/grants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const grants = await grantsRes.json();
      const allProposals: any[] = [];
      for (const grant of grants) {
        const proposalsRes = await fetch(`http://localhost:5000/api/proposals/grant/${grant._id}`, {
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
      setAssignError(err.message || "Error assigning reviewer");
    } finally {
      setAssigning(false);
      setLoading(false);
    }
  };

  // Get reviewer name by ID
  const getReviewerName = (reviewerId: string) => {
    const reviewer = reviewers.find(r => r._id === reviewerId);
    return reviewer ? (reviewer.firstName + ' ' + reviewer.lastName).trim() || reviewer.email : 'Unknown';
  };

  return (
    <AdminLayout active="proposals">
      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>View and manage all proposals submitted for all grants.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading proposals...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Researcher</TableHead>
                  <TableHead>Grant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">No proposals found.</TableCell>
                  </TableRow>
                ) : (
                  proposals.map((proposal) => (
                    <TableRow key={proposal._id}>
                      <TableCell className="font-medium">{proposal.title}</TableCell>
                      <TableCell>{proposal.researcher && (proposal.researcher.firstName || proposal.researcher.lastName)
                        ? `${proposal.researcher.firstName || ''} ${proposal.researcher.lastName || ''}`.trim()
                        : proposal.researcher && proposal.researcher.email
                          ? proposal.researcher.email
                          : proposal.researcher}</TableCell>
                      <TableCell>{proposal.grantTitle}</TableCell>
                      <TableCell>
                        <Badge className={
                          proposal.status === "Approved" ? "bg-green-100 text-green-800" :
                          proposal.status === "Rejected" ? "bg-red-100 text-red-800" :
                          proposal.status === "Needs Revision" ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }>
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {proposal.reviewer ? (
                          <span className="text-sm text-gray-600">{getReviewerName(proposal.reviewer)}</span>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>{proposal.dateSubmitted ? new Date(proposal.dateSubmitted).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setViewProposal(proposal)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            {viewProposal && viewProposal._id === proposal._id && (
                              <ProposalViewModal
                                proposal={viewProposal}
                                onClose={() => setViewProposal(null)}
                              />
                            )}
                          </Dialog>

                          {!proposal.reviewer && proposal.status === "Under Review" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => { setSelectedProposal(proposal); setSelectedReviewer(""); }}
                                >
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  Assign Reviewer
                                </Button>
                              </DialogTrigger>
                              {selectedProposal && selectedProposal._id === proposal._id && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Assign Reviewer</DialogTitle>
                                    <DialogDescription>
                                      Assign a reviewer to: <span className="font-semibold">{proposal.title}</span>
                                    </DialogDescription>
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
                                            <SelectItem key={reviewer._id} value={reviewer._id}>
                                              {reviewer.firstName} {reviewer.lastName} - {reviewer.email}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {assignError && <div className="text-red-500 text-sm">{assignError}</div>}
                                    <div className="flex space-x-3">
                                      <Button 
                                        onClick={handleAssignReviewer} 
                                        className="bg-blue-600 hover:bg-blue-700" 
                                        disabled={assigning || !selectedReviewer}
                                      >
                                        {assigning ? "Assigning..." : "Assign Reviewer"}
                                      </Button>
                                      <Button variant="outline" onClick={() => setSelectedProposal(null)}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                          )}

                          {proposal.reviewer && (
                            <Button size="sm" variant="outline" disabled>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Assigned
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 