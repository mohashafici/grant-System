"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, DollarSign, Clipboard } from "lucide-react";
import ResearcherLayout from "@/components/layouts/ResearcherLayout";

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Draft":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProposalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/proposals/mine/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch proposal details");
        const data = await res.json();
        setProposal(data);
      } catch (err: any) {
        setError(err.message || "Error fetching proposal details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProposal();
  }, [id]);

  return (
    <ResearcherLayout>
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">Back</Button>
        <Card>
          <CardHeader>
            <CardTitle>{proposal?.title || "Proposal Details"}</CardTitle>
            <CardDescription>Proposal Details and Status Information</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : proposal ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proposal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(proposal.status)}`}>{proposal.status}</Badge>
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
                      {proposal.deadline && (
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-2">{new Date(proposal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      {proposal.dateSubmitted && (
                        <div>
                          <span className="font-medium">Submitted:</span>
                          <span className="ml-2">{new Date(proposal.dateSubmitted).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
                        {proposal.additionalDocuments && proposal.additionalDocuments.length > 0 && proposal.additionalDocuments.map((doc: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">Additional Document {idx + 1}</span>
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Proposal not found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResearcherLayout>
  );
} 