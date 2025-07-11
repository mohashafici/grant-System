"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, FileText, Clock, CheckCircle, DollarSign, Calendar, User, Clipboard } from "lucide-react"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { SidebarTrigger } from "@/components/ui/sidebar"

const getStatusColor = (status: string) => {
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

export default function ResearcherDashboardPage() {
  useAuthRedirect(["researcher"])
  const [proposals, setProposals] = useState<any[]>([])
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/proposals/mine", {
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
        const res = await fetch("http://localhost:5000/api/grants");
        const data = await res.json();
        setGrants(data);
      } catch {
        setGrants([]);
      }
    };
    fetchProposals();
    fetchGrants();
  }, [])

  // Stats
  const totalProposals = proposals.length;
  const totalGrants = grants.length;
  const approvedCount = proposals.filter((p) => p.status === "Approved").length;
  const underReviewCount = proposals.filter((p) => p.status === "Under Review").length;
  const rejectedCount = proposals.filter((p) => p.status === "Rejected").length;
  const totalFunding = proposals
    .filter((p) => p.status === "Approved")
    .reduce((sum, p) => sum + (typeof p.funding === "number" ? p.funding : parseFloat((p.funding || "0").replace(/[^\d.]/g, ""))), 0);
  const grantsFunding = grants.reduce((sum, g) => sum + (typeof g.funding === "number" ? g.funding : parseFloat((g.funding || "0").replace(/[^\d.]/g, ""))), 0);

  // Recent activity placeholder
  const recentActivity = [
    {
      type: "Grant Approved",
      desc: proposals.find((p) => p.status === "Approved")?.title || "-",
      amount: proposals.find((p) => p.status === "Approved")?.funding || "-",
      time: "2 days ago",
      color: "bg-green-500",
    },
    {
      type: "Review Started",
      desc: proposals.find((p) => p.status === "Under Review")?.title || "-",
      time: "1 week ago",
      color: "bg-yellow-500",
    },
    {
      type: "Application Submitted",
      desc: proposals[0]?.title || "-",
      time: "2 weeks ago",
      color: "bg-blue-500",
    },
  ]

  return (
    <ResearcherLayout>
      <div className="space-y-6">
        <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Welcome back, Dr.</h1>
        </header>
        {/* Welcome Section */}
        <div>
          <p className="text-gray-600 ml-16">Manage your research grant applications and track their progress</p>
        </div>

      {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Grants</p>
                  <p className="text-2xl font-bold text-green-600">{totalGrants}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                  <p className="text-2xl font-bold text-blue-600">{totalProposals}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Grants</p>
                  <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
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
                  <p className="text-2xl font-bold text-blue-600">${totalFunding.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
          </CardContent>
        </Card>
      </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Proposals</CardTitle>
                  <CardDescription>Your latest grant submissions</CardDescription>
                </div>
                <Link href="/researcher/submit">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Proposal
          </Button>
                </Link>
              </CardHeader>
              <CardContent>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading proposals...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
                  <div className="space-y-4">
            {proposals.slice(0, 4).map((proposal) => (
                      <div key={proposal._id || proposal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                              <Clipboard className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                        {typeof proposal.funding === "number"
                          ? `$${proposal.funding.toLocaleString()}`
                          : proposal.funding}
                      </span>
                              {proposal.dateSubmitted && (
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(proposal.dateSubmitted).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                        </div>
                        {proposal.status === "Draft" && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Completion Progress</span>
                              <span className="text-gray-900">{proposal.progress || 0}%</span>
                            </div>
                            <Progress value={proposal.progress || 0} className="h-2" />
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          
                        </div>
                    </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/researcher/submit">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Proposal
                  </Button>
                </Link>
                <Link href="/researcher/proposals">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    View All Proposals
                  </Button>
                </Link>
                <Link href="/researcher/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-xs text-gray-600">{activity.desc}{activity.amount ? ` - $${activity.amount}` : ""}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </ResearcherLayout>
  )
}
