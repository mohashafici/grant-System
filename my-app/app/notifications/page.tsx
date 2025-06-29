"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bell, CheckCircle, Clock, AlertCircle, Award, Home, FileText, Plus, User } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "success",
    category: "proposal",
    title: "Proposal submitted successfully",
    message: "Your proposal 'AI-Powered Medical Diagnosis System' has been submitted and is now under review.",
    timestamp: "2024-01-15 10:30 AM",
    read: false,
    actionUrl: "/dashboard/researcher/proposals",
    actionText: "View Proposal",
  },
  {
    id: 2,
    type: "info",
    category: "review",
    title: "Review completed",
    message:
      "Dr. Ahmed has completed the review for your proposal 'Sustainable Energy Storage Solutions'. The review score is 8.5/10.",
    timestamp: "2024-01-14 3:45 PM",
    read: false,
    actionUrl: "/dashboard/researcher/proposals",
    actionText: "View Review",
  },
  {
    id: 3,
    type: "success",
    category: "decision",
    title: "Grant decision: Approved",
    message:
      "Congratulations! Your proposal 'Quantum Computing Applications' has been approved for funding of $100,000.",
    timestamp: "2024-01-13 9:15 AM",
    read: true,
    actionUrl: "/dashboard/researcher/proposals",
    actionText: "Download Award Letter",
  },
  {
    id: 4,
    type: "warning",
    category: "deadline",
    title: "Deadline reminder",
    message:
      "The deadline for 'Healthcare Innovation Fund' is approaching in 5 days. Don't forget to submit your proposal.",
    timestamp: "2024-01-12 2:20 PM",
    read: true,
    actionUrl: "/grants",
    actionText: "View Grant",
  },
  {
    id: 5,
    type: "info",
    category: "opportunity",
    title: "New grant opportunity available",
    message: "A new grant 'Climate Change Research Initiative' is now open for applications. Funding up to $150,000.",
    timestamp: "2024-01-11 11:00 AM",
    read: true,
    actionUrl: "/grants",
    actionText: "Apply Now",
  },
  {
    id: 6,
    type: "error",
    category: "revision",
    title: "Proposal requires revision",
    message:
      "Your proposal 'Blockchain Security Research' needs revisions. Please check the reviewer comments and resubmit within 14 days.",
    timestamp: "2024-01-10 4:30 PM",
    read: true,
    actionUrl: "/dashboard/researcher/proposals",
    actionText: "Start Revision",
  },
  {
    id: 7,
    type: "info",
    category: "system",
    title: "Profile verification required",
    message: "Please verify your institutional email address to complete your profile setup.",
    timestamp: "2024-01-09 1:15 PM",
    read: false,
    actionUrl: "/dashboard/researcher/profile",
    actionText: "Verify Email",
  },
  {
    id: 8,
    type: "info",
    category: "reminder",
    title: "Monthly progress report due",
    message: "Your monthly progress report for the 'Quantum Computing Applications' project is due in 3 days.",
    timestamp: "2024-01-08 9:00 AM",
    read: true,
    actionUrl: "/dashboard/researcher/reports",
    actionText: "Submit Report",
  },
]

function NotificationsSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Grant Portal</h2>
            <p className="text-xs text-muted-foreground">Researcher</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/proposals">
                    <FileText className="w-4 h-4" />
                    <span>My Proposals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/submit">
                    <Plus className="w-4 h-4" />
                    <span>Submit Proposal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/notifications">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/profile">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "warning":
      return <Clock className="w-5 h-5 text-yellow-600" />
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-600" />
    default:
      return <Bell className="w-5 h-5 text-blue-600" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success":
      return "border-l-green-500 bg-green-50"
    case "warning":
      return "border-l-yellow-500 bg-yellow-50"
    case "error":
      return "border-l-red-500 bg-red-50"
    default:
      return "border-l-blue-500 bg-blue-50"
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <NotificationsSidebar />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">Stay updated with your grant activities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {unreadCount} unread
                </Badge>
                <Button variant="outline" size="sm">
                  Mark all as read
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
                All ({notifications.length})
              </Button>
              <Button variant="outline" size="sm">
                Proposals ({notifications.filter((n) => n.category === "proposal").length})
              </Button>
              <Button variant="outline" size="sm">
                Reviews ({notifications.filter((n) => n.category === "review").length})
              </Button>
              <Button variant="outline" size="sm">
                Deadlines ({notifications.filter((n) => n.category === "deadline").length})
              </Button>
              <Button variant="outline" size="sm">
                Opportunities ({notifications.filter((n) => n.category === "opportunity").length})
              </Button>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                    !notification.read ? "shadow-sm" : "opacity-75"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{notification.title}</span>
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500 mt-1">
                            {notification.timestamp}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700">{notification.message}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button size="sm" variant="outline">
                            Mark as read
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-gray-500">
                          Dismiss
                        </Button>
                      </div>
                      {notification.actionUrl && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href={notification.actionUrl}>{notification.actionText}</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
              </div>
            )}

            {/* Notification Settings */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Email Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Proposal status updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Review completions</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Deadline reminders</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">New grant opportunities</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Push Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Urgent updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Daily digest</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Weekly summary</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
