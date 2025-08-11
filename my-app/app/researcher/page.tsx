"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import ResearcherLayout from "@/components/layouts/ResearcherLayout";
import { authStorage } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  User,
  Building,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ResearcherDashboardPage() {
  useAuthRedirect();
  const [proposals, setProposals] = useState<any[]>([]);
  const [grants, setGrants] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = authStorage.getToken();

        // Fetch user profile
        setProfileLoading(true);
        const profileRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData);
          // console.log("Fetched user profile:", profileData)
        } else {
          setUserProfile(null);
        }
        setProfileLoading(false);

        // Fetch proposals
        const proposalsRes = await fetch(`${API_BASE_URL}/proposals/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!proposalsRes.ok) throw new Error("Failed to fetch proposals");
        const proposalsData = await proposalsRes.json();
        setProposals(proposalsData);

        // Fetch grants - ensure it's always an array
        try {
          const grantsRes = await fetch(`${API_BASE_URL}/grants`);
          if (grantsRes.ok) {
            const grantsData = await grantsRes.json();
            setGrants(Array.isArray(grantsData) ? grantsData : []);
          } else {
            console.error("Failed to fetch grants:", grantsRes.status);
            setGrants([]);
          }
        } catch (grantsError) {
          console.error("Error fetching grants:", grantsError);
          setGrants([]);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
        // Ensure grants is still an array even if there's an error
        setGrants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stats - ensure grants is always an array before filtering
  const totalProposals = proposals.length;
  const totalGrants = Array.isArray(grants) ? grants.filter((g) => g.status === "Active").length : 0;
  const approvedCount = proposals.filter((p) => p.status === "Approved").length;
  const underReviewCount = proposals.filter((p) => p.status === "Under Review").length;
  const rejectedCount = proposals.filter((p) => p.status === "Rejected").length;
  const totalFunding = proposals
    .filter((p) => p.status === "Approved")
    .reduce((sum, p) => sum + (typeof p.funding === "number" ? p.funding : parseFloat((p.funding || "0").replace(/[^\d.]/g, ""))), 0);
  const grantsFunding = Array.isArray(grants) ? grants.reduce((sum, g) => sum + (typeof g.funding === "number" ? g.funding : parseFloat((g.funding || "0").replace(/[^\d.]/g, ""))), 0) : 0;

  // Recent activity placeholder
  const getProposalTimestamp = (p: any): number => {
    const source = p?.updatedAt || p?.dateUpdated || p?.reviewStartedAt || p?.dateSubmitted;
    const ts = source ? new Date(source).getTime() : 0;
    return Number.isFinite(ts) ? ts : 0;
  };

  const formatTimeAgo = (ts: number): string => {
    if (!ts) return "-";
    const diffMs = Date.now() - ts;
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  };

  const latestApproved = [...proposals]
    .filter((p) => p.status === "Approved")
    .sort((a, b) => getProposalTimestamp(b) - getProposalTimestamp(a))[0];

  const latestUnderReview = [...proposals]
    .filter((p) => p.status === "Under Review")
    .sort((a, b) => getProposalTimestamp(b) - getProposalTimestamp(a))[0];

  const latestSubmitted = [...proposals]
    .sort((a, b) => (new Date(b?.dateSubmitted || 0).getTime()) - (new Date(a?.dateSubmitted || 0).getTime()))[0];

  const recentActivity = [
    {
      type: "Grant Approved",
      desc: latestApproved?.title || "-",
      amount: latestApproved?.funding || "-",
      time: formatTimeAgo(getProposalTimestamp(latestApproved)),
      color: "bg-green-500",
    },
    {
      type: "Review Started",
      desc: latestUnderReview?.title || "-",
      time: formatTimeAgo(getProposalTimestamp(latestUnderReview)),
      color: "bg-yellow-500",
    },
    {
      type: "Application Submitted",
      desc: latestSubmitted?.title || "-",
      time: formatTimeAgo(new Date(latestSubmitted?.dateSubmitted || 0).getTime()),
      color: "bg-blue-500",
    },
  ];

  // Get user's full name
  const getUserName = () => {
    if (profileLoading) return "...";
    if (userProfile && userProfile.firstName && userProfile.lastName) {
      return `Dr. ${userProfile.firstName} ${userProfile.lastName}`;
    }
    return "Dr.";
  };

  if (loading) {
    return (
      <ResearcherLayout>
        <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
      </ResearcherLayout>
    );
  }

  if (error) {
    return (
      <ResearcherLayout>
        <div className="p-8 text-center text-red-500">
          Error: {error}
          <Button
            onClick={() => window.location.reload()}
            className="ml-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </ResearcherLayout>
    );
  }

  return (
    <ResearcherLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {getUserName()}!</h1>
              <p className="text-blue-100">
                Track your research proposals and discover new funding opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProposals}</div>
              <p className="text-xs text-muted-foreground">
                {approvedCount} approved, {underReviewCount} under review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Grants</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGrants}</div>
              <p className="text-xs text-muted-foreground">
                Active funding opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFunding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From approved proposals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProposals > 0 ? Math.round((approvedCount / totalProposals) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Proposal approval rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Proposal Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Proposal Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{approvedCount}</span>
                  <Progress
                    value={totalProposals > 0 ? (approvedCount / totalProposals) * 100 : 0}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span>Under Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{underReviewCount}</span>
                  <Progress
                    value={totalProposals > 0 ? (underReviewCount / totalProposals) * 100 : 0}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Rejected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{rejectedCount}</span>
                  <Progress
                    value={totalProposals > 0 ? (rejectedCount / totalProposals) * 100 : 0}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.desc}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount && activity.amount !== "-" && (
                      <p className="font-medium text-green-600">${activity.amount}</p>
                    )}
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <a href="/researcher/submit">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit New Proposal
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/researcher/grants">
                  <Award className="w-4 h-4 mr-2" />
                  Browse Grants
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResearcherLayout>
  );
}