"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Home,
  FileText,
  Plus,
  Bell,
  User,
  Award,
  Settings,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Mail,
  Save,
} from "lucide-react"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"

function ResearcherSidebar() {
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
                <SidebarMenuButton asChild>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/researcher/settings">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
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

export default function ResearcherSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    proposalReminders: true,
    deadlineAlerts: true,
    reviewNotifications: true,
    darkMode: false,
    language: "en",
    timezone: "America/New_York",
    twoFactorAuth: false,
    profileVisibility: "public",
    autoSave: true,
  })

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Handle save logic here
  }

  return (
    <ResearcherLayout active="settings">
      <div className="flex min-h-screen bg-gray-50">
        <ResearcherSidebar />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600">Manage your account preferences and settings</p>
                </div>
              </div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Email Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">General email notifications</Label>
                          <Switch
                            id="email-notifications"
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="proposal-reminders">Proposal deadline reminders</Label>
                          <Switch
                            id="proposal-reminders"
                            checked={settings.proposalReminders}
                            onCheckedChange={(checked) => setSettings({ ...settings, proposalReminders: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="review-notifications">Review completion alerts</Label>
                          <Switch
                            id="review-notifications"
                            checked={settings.reviewNotifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, reviewNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="weekly-digest">Weekly digest</Label>
                          <Switch
                            id="weekly-digest"
                            checked={settings.weeklyDigest}
                            onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Push Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-notifications">Browser push notifications</Label>
                          <Switch
                            id="push-notifications"
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="deadline-alerts">Urgent deadline alerts</Label>
                          <Switch
                            id="deadline-alerts"
                            checked={settings.deadlineAlerts}
                            onCheckedChange={(checked) => setSettings({ ...settings, deadlineAlerts: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="w-5 h-5 mr-2" />
                    Appearance & Display
                  </CardTitle>
                  <CardDescription>Customize how the application looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark mode</Label>
                      <p className="text-sm text-gray-500">Use dark theme for better viewing in low light</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings({ ...settings, language: value })}
                      >
                        <SelectTrigger>
                          <Globe className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription>Manage your account security and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-factor authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile visibility</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to all users</SelectItem>
                        <SelectItem value="researchers">Researchers only - Visible to other researchers</SelectItem>
                        <SelectItem value="private">Private - Only visible to you</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Password & Authentication</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Manage Connected Devices
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Update Email Address
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Application Preferences
                  </CardTitle>
                  <CardDescription>Customize your application experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save">Auto-save drafts</Label>
                      <p className="text-sm text-gray-500">Automatically save your work as you type</p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>Manage your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Privacy Policy
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ResearcherLayout>
  )
}
