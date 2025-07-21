"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  Settings,
  Users,
  FileText,
  Bell,
  Award,
  Send,
  Plus,
  Eye,
  Edit,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import { SidebarTrigger } from "@/components/ui/sidebar";

const notifications = [
  {
    id: 1,
    title: "Grant Application Deadline Reminder",
    message: "The deadline for Technology Innovation Grant applications is approaching in 7 days.",
    type: "deadline",
    recipients: "All Researchers",
    status: "Sent",
    sentDate: "2024-01-20",
    sentTo: 156,
    opened: 142,
    clicked: 89,
  },
  {
    id: 2,
    title: "New Review Assignments Available",
    message: "You have been assigned 3 new proposals for review. Please complete by February 15th.",
    type: "assignment",
    recipients: "Selected Reviewers",
    status: "Sent",
    sentDate: "2024-01-18",
    sentTo: 12,
    opened: 11,
    clicked: 8,
  },
  {
    id: 3,
    title: "System Maintenance Notification",
    message: "The grant portal will undergo scheduled maintenance on January 25th from 2-4 AM EST.",
    type: "system",
    recipients: "All Users",
    status: "Draft",
    sentDate: null,
    sentTo: 0,
    opened: 0,
    clicked: 0,
  },
  {
    id: 4,
    title: "Quarterly Report Available",
    message: "The Q1 2024 grant evaluation report is now available for download in your dashboard.",
    type: "report",
    recipients: "Administrators",
    status: "Scheduled",
    sentDate: "2024-01-25",
    sentTo: 0,
    opened: 0,
    clicked: 0,
  },
]

const templates = [
  {
    id: 1,
    name: "Deadline Reminder",
    subject: "Grant Application Deadline Approaching",
    category: "deadline",
    lastUsed: "2024-01-20",
  },
  {
    id: 2,
    name: "Review Assignment",
    subject: "New Proposals Assigned for Review",
    category: "assignment",
    lastUsed: "2024-01-18",
  },
  {
    id: 3,
    name: "System Maintenance",
    subject: "Scheduled System Maintenance",
    category: "system",
    lastUsed: "2024-01-10",
  },
  {
    id: 4,
    name: "Welcome New User",
    subject: "Welcome to the Grant Portal",
    category: "welcome",
    lastUsed: "2024-01-15",
  },
]

function CreateNotificationModal({ onClose }: { onClose: () => void }) {
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "",
    recipients: "",
    sendNow: false,
    scheduleDate: "",
  })

  const handleSubmit = () => {
    console.log("Creating notification:", notificationData)
    onClose()
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Notification</DialogTitle>
        <DialogDescription>Send a notification to users</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-title">Title</Label>
          <Input
            id="notification-title"
            placeholder="Enter notification title"
            value={notificationData.title}
            onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-type">Type</Label>
          <Select
            value={notificationData.type}
            onValueChange={(value) => setNotificationData({ ...notificationData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline Reminder</SelectItem>
              <SelectItem value="assignment">Review Assignment</SelectItem>
              <SelectItem value="system">System Update</SelectItem>
              <SelectItem value="report">Report Available</SelectItem>
              <SelectItem value="general">General Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-recipients">Recipients</Label>
          <Select
            value={notificationData.recipients}
            onValueChange={(value) => setNotificationData({ ...notificationData, recipients: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="researchers">All Researchers</SelectItem>
              <SelectItem value="reviewers">All Reviewers</SelectItem>
              <SelectItem value="admins">All Administrators</SelectItem>
              <SelectItem value="custom">Custom Selection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-message">Message</Label>
          <Textarea
            id="notification-message"
            placeholder="Enter notification message"
            rows={4}
            value={notificationData.message}
            onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-now"
              checked={notificationData.sendNow}
              onCheckedChange={(checked) => setNotificationData({ ...notificationData, sendNow: checked })}
            />
            <Label htmlFor="send-now">Send immediately</Label>
          </div>

          {!notificationData.sendNow && (
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Schedule for later</Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={notificationData.scheduleDate}
                onChange={(e) => setNotificationData({ ...notificationData, scheduleDate: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            {notificationData.sendNow ? "Send Now" : "Schedule"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function NotificationDetailsModal({ notification, onClose }: { notification: any; onClose: () => void }) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{notification.title}</DialogTitle>
        <DialogDescription>
          {notification.status === "Sent" ? `Sent on ${notification.sentDate}` : `Status: ${notification.status}`}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{notification.message}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Type:</span>
                <Badge className="ml-2" variant="outline">
                  {notification.type}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Recipients:</span>
                <span className="ml-2">{notification.recipients}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge
                  className={`ml-2 ${
                    notification.status === "Sent"
                      ? "bg-green-100 text-green-800"
                      : notification.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {notification.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {notification.status === "Sent" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Sent to:</span>
                  <span className="ml-2 text-2xl font-bold text-blue-600">{notification.sentTo}</span>
                </div>
                <div>
                  <span className="font-medium">Opened:</span>
                  <span className="ml-2 text-lg font-semibold text-green-600">
                    {notification.opened} ({Math.round((notification.opened / notification.sentTo) * 100)}%)
                  </span>
                </div>
                <div>
                  <span className="font-medium">Clicked:</span>
                  <span className="ml-2 text-lg font-semibold text-purple-600">
                    {notification.clicked} ({Math.round((notification.clicked / notification.sentTo) * 100)}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function AdminNotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4" />
      case "assignment":
        return <FileText className="w-4 h-4" />
      case "system":
        return <AlertCircle className="w-4 h-4" />
      case "report":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <AdminLayout active="notifications">
      <header className="bg-white border-b px-6 py-4 shadow-sm w-full mb-4 flex items-center">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Notifications</h1>
      </header>

          <main className="p-6">
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-6">
                {/* Notifications Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {notifications.filter((n) => n.status === "Sent").length}
                      </div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {notifications.filter((n) => n.status === "Scheduled").length}
                      </div>
                      <p className="text-xs text-muted-foreground">Pending delivery</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">91%</div>
                      <p className="text-xs text-muted-foreground">Average open rate</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">58%</div>
                      <p className="text-xs text-muted-foreground">Average click rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Notifications List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Manage sent and scheduled notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>To: {notification.recipients}</span>
                                {notification.sentDate && <span>Sent: {notification.sentDate}</span>}
                                {notification.status === "Sent" && (
                                  <span>
                                    {notification.opened}/{notification.sentTo} opened
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(notification.status)}>{notification.status}</Badge>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedNotification(notification)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                {selectedNotification && (
                                  <NotificationDetailsModal
                                    notification={selectedNotification}
                                    onClose={() => setSelectedNotification(null)}
                                  />
                                )}
                              </Dialog>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>Pre-built templates for common notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div key={template.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Last used: {template.lastUsed}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                Use Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure system notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">Send notifications via email</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-500">Send browser push notifications</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Send urgent notifications via SMS</p>
                        </div>
                        <Checkbox />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Default Sender Name</Label>
                        <Input defaultValue="Grant Portal System" />
                      </div>
                      <div className="space-y-2">
                        <Label>Default Sender Email</Label>
                        <Input defaultValue="noreply@grantportal.com" />
                      </div>
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AdminLayout>
  )
}
