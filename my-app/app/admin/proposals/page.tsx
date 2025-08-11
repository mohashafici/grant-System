"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, UserCheck, Download, FileText, Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

interface Proposal {
  _id: string;
  title: string;
  abstract: string;
  category: string;
  status: string;
  funding: number;
  dateSubmitted: string;
  deadline?: string;
  grantTitle: string;
  researcher: {
    firstName: string;
    lastName: string;
    institution: string;
  };
  reviewer?: string;
  attachments?: string[];
  // Budget breakdown fields
  personnelCosts?: number;
  equipmentCosts?: number;
  materialsCosts?: number;
  travelCosts?: number;
  otherCosts?: number;
  // Document fields
  proposalDocument?: string;
  cvResume?: string;
  additionalDocuments?: string[];
}

interface Reviewer {
  _id: string;
  firstName: string;
  lastName: string;
  expertise: string;
}

// Mobile-friendly proposal card component
function MobileProposalCard({ proposal, onView, onAssign, getReviewerName, reviewers }: {
  proposal: Proposal;
  onView: (proposal: Proposal) => void;
  onAssign: (proposal: Proposal) => void;
  getReviewerName: (reviewerId: string) => string;
  reviewers: Reviewer[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending Assignment":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="mb-3 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">{proposal.title}</h3>
          </div>
          <Badge className={`${getStatusColor(proposal.status)} text-xs whitespace-nowrap flex-shrink-0`}>
            {proposal.status}
          </Badge>
        </div>

        {/* Researcher and Grant */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">Researcher:</span>
            <p className="font-medium">{proposal.researcher?.firstName} {proposal.researcher?.lastName}</p>
          </div>
          <div>
            <span className="text-gray-500">Grant:</span>
            <p className="font-medium truncate">{proposal.grantTitle}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">Category:</span>
            <p className="font-medium">{proposal.category}</p>
          </div>
          <div>
            <span className="text-gray-500">Funding:</span>
            <p className="font-semibold text-blue-600">${proposal.funding?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium">{proposal.dateSubmitted ? new Date(proposal.dateSubmitted).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Reviewer:</span>
            <p className="font-medium">{proposal.reviewer ? getReviewerName(proposal.reviewer) : "Not assigned"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onView(proposal)}
            className="flex-1 h-8 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          {!proposal.reviewer && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssign(proposal)}
              className="flex-1 h-8 text-xs"
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

// Proposal View Modal Component
function ProposalViewModal({ proposal, onClose }: { proposal: Proposal; onClose: () => void }) {
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
    <Dialog open={true} onOpenChange={onClose}>
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
                  {proposal.attachments.map((attachment, index) => (
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
    </Dialog>
  );
}

export default function AdminProposalsPage() {
  useAuthRedirect()
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null);
  const [sortBy, setSortBy] = useState("dateSubmitted");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
        const allProposals: Proposal[] = [];
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
  const getSortedAndFilteredProposals = useCallback(() => {
    let filtered = proposals;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(proposal => 
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.researcher?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.researcher?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.grantTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
          aValue = parseFloat(a.funding.toString()) || 0;
          bValue = parseFloat(b.funding.toString()) || 0;
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
  }, [proposals, sortBy, sortOrder, searchTerm]);

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

  const sortedProposals = useMemo(() => getSortedAndFilteredProposals(), [getSortedAndFilteredProposals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout active="proposals" title="Manage Proposals">
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-hidden">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Manage Proposals</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Review and assign proposals to reviewers</p>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filters - Mobile optimized */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Search proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm md:text-base h-9 sm:h-10"
                />
              </div>

              {/* Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
                  <Label htmlFor="sortBy" className="text-xs sm:text-sm">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
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
                  <Label htmlFor="sortOrder" className="text-xs sm:text-sm">Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
                  <p className="text-xs sm:text-sm text-gray-600">
                Showing {sortedProposals.length} of {proposals.length} proposals
              </p>
            </div>
          </div>
        </div>
          </CardContent>
        </Card>

        {/* Proposals List - Mobile/Desktop responsive */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-2 sm:px-3 md:px-4 lg:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">All Proposals</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">Review and manage submitted proposals</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Loading proposals...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                {isMobile ? (
                  <div className="p-2 sm:p-3 md:p-4">
                    {sortedProposals.map((proposal) => (
                      <MobileProposalCard
                        key={proposal._id}
                        proposal={proposal}
                        onView={setViewProposal}
                        onAssign={setSelectedProposal}
                        getReviewerName={getReviewerName}
                        reviewers={reviewers}
                      />
                    ))}
                  </div>
                ) : (
                  /* Desktop Table View */
                  <div className="w-full overflow-x-auto">
                    <Table className="w-full text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[25%] sm:w-[30%]">Title</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[20%] sm:w-[15%]">Researcher</TableHead>
                          <TableHead className="hidden sm:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%]">Grant</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[15%] sm:w-[10%]">Status</TableHead>
                          <TableHead className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Category</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Funding</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%]">Reviewer</TableHead>
                          <TableHead className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 w-[10%] sm:w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {sortedProposals.map((proposal) => (
                <TableRow key={proposal._id}>
                            <TableCell className="font-medium max-w-xs truncate text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                    {proposal.title}
                  </TableCell>
                            <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                    {proposal.researcher?.firstName} {proposal.researcher?.lastName}
                  </TableCell>
                            <TableCell className="hidden sm:table-cell max-w-xs truncate text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                    {proposal.grantTitle}
                  </TableCell>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                    <Badge variant={
                      proposal.status === "Approved" ? "default" :
                      proposal.status === "Rejected" ? "destructive" :
                      proposal.status === "Under Review" ? "secondary" :
                      "outline"
                              } className="text-xs whitespace-nowrap">
                      {proposal.status}
                    </Badge>
                  </TableCell>
                            <TableCell className="hidden md:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{proposal.category}</TableCell>
                            <TableCell className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">${proposal.funding?.toLocaleString()}</TableCell>
                            <TableCell className="hidden lg:table-cell text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">
                    {proposal.reviewer ? getReviewerName(proposal.reviewer) : "Not assigned"}
                  </TableCell>
                            <TableCell className="px-2 md:px-4 py-2 md:py-3">
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewProposal(proposal)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      {!proposal.reviewer && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProposal(proposal)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Assign Reviewer Modal */}
        {selectedProposal && (
          <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-md p-3 sm:p-4 md:p-6">
              <DialogHeader className="space-y-2 sm:space-y-3">
                <DialogTitle className="text-base sm:text-lg md:text-xl">Assign Reviewer</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm md:text-base">
                  Assign a reviewer to "{selectedProposal.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reviewer" className="text-xs sm:text-sm md:text-base">Select Reviewer</Label>
                  <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base h-9 sm:h-10">
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
                  <p className="text-red-600 text-xs sm:text-sm">{assignError}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProposal(null)}
                    className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignReviewer}
                    disabled={assigning || !selectedReviewer}
                    className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
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