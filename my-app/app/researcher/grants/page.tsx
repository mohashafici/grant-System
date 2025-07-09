"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ResearcherLayout from "@/components/layouts/ResearcherLayout";

function getStatusColor(status) {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-800";
    case "Closing Soon":
      return "bg-orange-100 text-orange-800";
    case "Closed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "Open":
      return <CheckCircle className="w-4 h-4" />;
    case "Closing Soon":
      return <AlertCircle className="w-4 h-4" />;
    case "Closed":
      return <Clock className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

export default function BrowseGrants() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  useEffect(() => {
    const fetchGrants = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/grants");
        const data = await res.json();
        setGrants(data);
      } catch {
        setGrants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  // Dynamic categories from grants
  const categories = [
    { value: "all", label: "All Categories" },
    ...Array.from(new Set(grants.map((g) => g.category))).map((cat) => ({ value: cat, label: cat })),
  ];

  const filteredGrants = grants.filter((grant) => {
    const matchesCategory = selectedCategory === "all" || grant.category === selectedCategory;
    const matchesSearch =
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grant.description && grant.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (grant.organization && grant.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApply = (grantId) => {
    // You can add real apply logic here
    setIsApplyDialogOpen(false);
  };

  return (
    <ResearcherLayout active="grants">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Available Grants</h1>
          <p className="text-gray-600">Discover funding opportunities for your research projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Grants</p>
                  <p className="text-2xl font-bold text-green-600">{grants.filter((g) => g.status === "Open").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${grants.reduce((sum, g) => sum + (g.funding || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Applications</p>
                  <p className="text-2xl font-bold text-purple-600">{grants.filter((g) => g.applied).length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search grants by title, description, or organization..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grants List */}
        <div className="space-y-4">
          {filteredGrants.map((grant) => (
            <Card key={grant._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
                      {grant.applied && <Badge className="bg-blue-100 text-blue-800">Applied</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{grant.organization}</p>
                    <p className="text-gray-700 mb-3 line-clamp-2">{grant.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {grant.funding ? `$${grant.funding.toLocaleString()}` : "N/A"}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "N/A"}
                      </span>
                      {grant.duration && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {grant.duration}
                        </span>
                      )}
                      {grant.applications && (
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {grant.applications} applicants
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{grant.category}</Badge>
                    <Badge className={getStatusColor(grant.status)}>
                      {getStatusIcon(grant.status)}
                      <span className="ml-1">{grant.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedGrant(grant)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span>{selectedGrant?.title}</span>
                            <Badge className={getStatusColor(selectedGrant?.status || "")}>{selectedGrant?.status}</Badge>
                          </DialogTitle>
                          <DialogDescription>{selectedGrant?.organization}</DialogDescription>
                        </DialogHeader>

                        {selectedGrant && (
                          <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList>
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="requirements">Requirements</TabsTrigger>
                              <TabsTrigger value="details">Details</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div>
                                <Label className="font-semibold">Description</Label>
                                <p className="text-sm text-gray-600 mt-1">{selectedGrant.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Funding Amount</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.funding ? `$${selectedGrant.funding.toLocaleString()}` : "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Project Duration</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.duration || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Application Deadline</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.deadline ? new Date(selectedGrant.deadline).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Project Start Date</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.projectStart || "N/A"}</p>
                                </div>
                              </div>

                              {selectedGrant.fundingAreas && (
                                <div>
                                  <Label className="font-semibold">Funding Areas</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedGrant.fundingAreas.map((area, index) => (
                                      <Badge key={index} variant="outline">
                                        {area}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="requirements" className="space-y-4">
                              <div>
                                <Label className="font-semibold">Eligibility Requirements</Label>
                                <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600">
                                  {Array.isArray(selectedGrant?.requirements) && selectedGrant.requirements.length > 0 ? (
                                    selectedGrant.requirements.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))
                                  ) : (
                                    <li>No requirements listed.</li>
                                  )}
                                </ul>
                              </div>
                              <div>
                                <Label className="font-semibold">Eligibility</Label>
                                <p className="text-sm text-gray-600 mt-1">{selectedGrant?.eligibility || "N/A"}</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Contact Email</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.contactEmail || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Current Applications</Label>
                                  <p className="text-sm text-gray-600">{selectedGrant.applications ? `${selectedGrant.applications} submitted` : "N/A"}</p>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center space-x-2">
                    {grant.applied ? (
                      <Button variant="outline" size="sm" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href={`/researcher/submit?grantId=${grant._id}`}>
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGrants.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No grants found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all available grants.</p>
            </CardContent>
          </Card>
        )}
        {loading && (
          <div className="text-center text-gray-500 py-12">Loading grants...</div>
        )}
      </div>
    </ResearcherLayout>
  );
}