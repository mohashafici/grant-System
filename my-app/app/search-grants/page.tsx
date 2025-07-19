"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  Heart,
  Bell,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import PublicNavbar from "@/components/public-navbar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const menuItems = [
  { href: "/search-grants", label: "Search Grants" },
  { href: "/grant-calendar", label: "Grant Calendar" },
  { href: "/application-help", label: "Application Help" },
  { href: "/resources", label: "Resources & Training" },
  { href: "/community", label: "Community & Forums" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SearchGrantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "all",
    fundingRange: "all",
    deadline: "all",
  })
  const [bookmarkedGrants, setBookmarkedGrants] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrant, setSelectedGrant] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState("deadline");
  const [applicantsMap, setApplicantsMap] = useState<{ [grantId: string]: number }>({});

  useEffect(() => {
    const fetchGrants = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/grants");
        if (!res.ok) throw new Error("Failed to fetch grants");
        let data = await res.json();
        // Only show active grants
        data = data.filter((g: any) => g.status === "Active");
        setGrants(data);
        // Fetch applicants for each grant
        const applicantsObj: { [grantId: string]: number } = {};
        await Promise.all(
          data.map(async (grant: any) => {
            try {
              const res = await fetch(`http://localhost:5000/api/proposals/grant/${grant._id}`);
              if (res.ok) {
                const proposals = await res.json();
                applicantsObj[grant._id] = proposals.length;
              } else {
                applicantsObj[grant._id] = 0;
              }
            } catch {
              applicantsObj[grant._id] = 0;
            }
          })
        );
        setApplicantsMap(applicantsObj);
      } catch (err: any) {
        setError(err.message || "Error fetching grants");
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  const toggleBookmark = (grantId: number) => {
    setBookmarkedGrants((prev) => (prev.includes(grantId) ? prev.filter((id) => id !== grantId) : [...prev, grantId]))
  }

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch =
      searchQuery === "" || 
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (grant.funder && grant.funder.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (grant.description && grant.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (grant.tags && grant.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesCategory = filters.category === "all" || grant.category === filters.category;
    // Funding range filter (example logic, adjust as needed)
    let matchesFunding = true;
    if (filters.fundingRange === "small") {
      matchesFunding = (grant.funding || 0) < 100000
    } else if (filters.fundingRange === "medium") {
      matchesFunding = (grant.funding || 0) >= 100000 && (grant.funding || 0) <= 500000
    } else if (filters.fundingRange === "large") {
      matchesFunding = (grant.funding || 0) > 500000
    }
    // Deadline filter (example: show only grants with deadline after today)
    let matchesDeadline = true;
    if (filters.deadline === "upcoming") {
      matchesDeadline = grant.deadline && new Date(grant.deadline) > new Date();
    }
    return matchesSearch && matchesCategory && matchesFunding && matchesDeadline;
  })

  const categories = [...new Set(grants.map((g) => g.category).filter(Boolean))]

  // Sorting logic
  const sortedGrants = [...filteredGrants].sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy === "funding") {
      // Try to parse funding as number, fallback to 0
      const getFunding = (g: any) => Number(g.funding) || parseFloat((g.amount || "").replace(/[^\d.]/g, "")) || 0;
      return getFunding(b) - getFunding(a);
    } else if (sortBy === "applicants") {
      return (b.applicants ?? 0) - (a.applicants ?? 0);
    } else if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {loading && (
          <div className="text-center py-12 text-gray-500">Loading grants...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-600 font-semibold">{error}</div>
        )}
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by keyword, funder, or discipline..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:w-auto w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filter Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Funding Range</Label>
                    <Select
                      value={filters.fundingRange}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, fundingRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any amount</SelectItem>
                        <SelectItem value="small">Under $100K</SelectItem>
                        <SelectItem value="medium">$100K - $500K</SelectItem>
                        <SelectItem value="large">Over $500K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Select
                      value={filters.deadline}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, deadline: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any deadline</SelectItem>
                        <SelectItem value="upcoming">Upcoming Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters({ category: "all", fundingRange: "all", deadline: "all" })
                    }
                  >
                    Clear Filters
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Save Search Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredGrants.length} of {grants.length} grants
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="applicants">Applicants</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grant Results */}
        <div className="grid gap-6">
          {sortedGrants.map((grant) => (
            <Card key={grant._id || grant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{grant.title}</h3>
                      <Badge className="bg-green-100 text-green-800">Open</Badge>
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{grant.funder}</p>
                    <p className="text-gray-600 mb-4">{grant.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Funding: </span>
                    <span className="ml-1 font-semibold">
                      {grant.funding ? `$${grant.funding.toLocaleString()}` : grant.amount || "-"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due: {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {grant.deadline ? `${Math.max(0, Math.ceil((new Date(grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left` : "-"}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(grant.tags) &&
                      grant.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedGrant(grant)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedGrant && selectedGrant._id === grant._id && (
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedGrant.title}</DialogTitle>
                          <DialogDescription>{selectedGrant.funder}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <span className="font-semibold">Description: </span>
                            <span>{selectedGrant.description}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold">Funding: </span>
                              <span>{selectedGrant.funding ? `$${selectedGrant.funding.toLocaleString()}` : selectedGrant.amount || "-"}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Deadline: </span>
                              <span>{selectedGrant.deadline ? new Date(selectedGrant.deadline).toLocaleDateString() : "-"}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Applicants: </span>
                              <span>-</span>
                            </div>
                            <div>
                              <span className="font-semibold">Category: </span>
                              <span>{selectedGrant.category || "-"}</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold">Requirements: </span>
                            <span>{selectedGrant.requirements || "-"}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Tags: </span>
                            {Array.isArray(selectedGrant.tags) && selectedGrant.tags.length > 0 ? (
                              selectedGrant.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs ml-1">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="ml-1">-</span>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredGrants.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No grants found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more opportunities.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilters({ category: "all", fundingRange: "all", deadline: "all" })
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredGrants.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Grants
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
