"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bell,
  Filter,
  Download,
  Clock,
  DollarSign,
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

export default function GrantCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrant, setSelectedGrant] = useState<any | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchGrants = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/grants`);
        if (!res.ok) throw new Error("Failed to fetch grants");
        let data = await res.json();
        // Only show active grants
        data = data.filter((g: any) => g.status === "Active");
        setGrants(data);
      } catch (err: any) {
        setError(err.message || "Error fetching grants");
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "closing-soon":
        return "bg-red-100 text-red-800"
      case "open":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: "bg-purple-100 text-purple-800",
      Environment: "bg-green-100 text-green-800",
      Health: "bg-red-100 text-red-800",
      Education: "bg-blue-100 text-blue-800",
      Agriculture: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const getGrantsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return grants.filter((grant) => {
      if (!grant.deadline) return false;
      const grantDate = new Date(grant.deadline);
      const grantDateStr = `${grantDate.getFullYear()}-${String(grantDate.getMonth() + 1).padStart(2, "0")}-${String(grantDate.getDate()).padStart(2, "0")}`;
      return grantDateStr === dateStr;
    });
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayGrants = getGrantsForDate(day)
      const isToday =
        new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 ${isToday ? "bg-blue-50" : "bg-white"} hover:bg-gray-50`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
          <div className="space-y-1">
            {dayGrants.slice(0, 2).map((grant) => (
              <Dialog key={grant._id || grant.id}>
                <DialogTrigger asChild>
                  <div
                    className={`text-xs p-1 rounded truncate cursor-pointer ${getStatusColor("open")}`}
                    title={`${grant.title} - ${grant.funder}`}
                    onClick={() => setSelectedGrant(grant)}
                  >
                    {grant.title}
                  </div>
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
                          <span className="font-semibold">Category: </span>
                          <span>{selectedGrant.category || "-"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Requirements: </span>
                          <span>{selectedGrant.requirements || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            ))}
            {dayGrants.length > 2 && <div className="text-xs text-gray-500">+{dayGrants.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grant Calendar
            <span className="text-blue-600 block">Never Miss a Deadline</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay organized with our comprehensive grant calendar. Track application deadlines, set reminders, and plan
            your research funding strategy.
          </p>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button variant="outline" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-semibold text-gray-900 min-w-[200px] text-center">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-4 text-center font-medium text-gray-700 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">{renderCalendarGrid()}</div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Grants closing in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show 5 upcoming (active) and 2 closed grants */}
                  {[
                    ...grants
                      .filter((grant) => grant.deadline && new Date(grant.deadline) > new Date())
                      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                      .slice(0, 5),
                    ...grants
                      .filter((grant) => grant.status === "Closed")
                      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
                      .slice(0, 2),
                  ].map((grant) => (
                    <Dialog key={grant._id || grant.id}>
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm cursor-pointer"
                          onClick={() => setSelectedGrant(grant)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{grant.title}</h3>
                              <Badge className={getStatusColor(grant.status || "open")}>{grant.status || "Open"}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {grant.funder && <span>{grant.funder}</span>}
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {grant.funding ? `$${grant.funding.toLocaleString()}` : grant.amount || "-"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "-"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              View
                            </Button>
                          </div>
                        </div>
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
                                <span className="font-semibold">Category: </span>
                                <span>{selectedGrant.category || "-"}</span>
                              </div>
                              <div>
                                <span className="font-semibold">Requirements: </span>
                                <span>{selectedGrant.requirements || "-"}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Opening</span>
                  <span className="font-semibold text-green-600">12 grants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Closing</span>
                  <span className="font-semibold text-red-600">8 grants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Funding</span>
                  <span className="font-semibold text-blue-600">$45M</span>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm text-gray-600">Open for applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-sm text-gray-600">Closing soon (≤7 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-sm text-gray-600">Opening soon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Email Reminders */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 text-blue-600 mr-2" />
                  Email Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get notified about upcoming deadlines and new opportunities.
                </p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">7 days before deadline</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">3 days before deadline</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">New grants in my field</span>
                  </label>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
