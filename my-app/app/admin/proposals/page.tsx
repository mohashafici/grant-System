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
  const [sortBy, setSortBy] = useState("dateSubmitted");
  const [sortOrder, setSortOrder] = useState("desc");
  const [scoreFilter, setScoreFilter] = useState("all");

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

  // Sort and filter proposals
  const getSortedAndFilteredProposals = () => {
    let filtered = proposals;

    // Apply score filter
    if (scoreFilter !== "all") {
      filtered = filtered.filter(proposal => {
        if (typeof proposal.recommendedScore !== 'number') return false;
        switch (scoreFilter) {
          case "excellent": return proposal.recommendedScore >= 80;
          case "good": return proposal.recommendedScore >= 60 && proposal.recommendedScore < 80;
          case "fair": return proposal.recommendedScore >= 40 && proposal.recommendedScore < 60;
          case "poor": return proposal.recommendedScore < 40;
          default: return true;
        }
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "recommendedScore":
          aValue = typeof a.recommendedScore === 'number' ? a.recommendedScore : -1;
          bValue = typeof b.recommendedScore === 'number' ? b.recommendedScore : -1;
          break;
        case "title":
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case "status":
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
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
  };

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
            <>
              {/* Sorting and Filtering Controls */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateSubmitted">Submission Date</SelectItem>
                      <SelectItem value="recommendedScore">Recommendation Score</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Filter by score:</Label>
                  <Select value={scoreFilter} onValueChange={setScoreFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="excellent">Excellent (80-100)</SelectItem>
                      <SelectItem value="good">Good (60-79)</SelectItem>
                      <SelectItem value="fair">Fair (40-59)</SelectItem>
                      <SelectItem value="poor">Poor (0-39)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Showing {getSortedAndFilteredProposals().length} of {proposals.length} proposals</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Researcher</TableHead>
                    <TableHead>Grant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">No proposals found.</TableCell>
                    </TableRow>
                  ) : (
                    getSortedAndFilteredProposals().map((proposal) => (
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
                          {typeof proposal.recommendedScore === 'number' ? (
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                proposal.recommendedScore >= 80 ? 'bg-green-500' :
                                proposal.recommendedScore >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className={`font-semibold ${
                                proposal.recommendedScore >= 80 ? 'text-green-700' :
                                proposal.recommendedScore >= 60 ? 'text-yellow-700' :
                                'text-red-700'
                              }`}>
                                {proposal.recommendedScore}/100
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not scored</span>
                          )}
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
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 