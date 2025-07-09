"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  FileText,
  Plus,
  Bell,
  User,
  Award,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
} from "lucide-react"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"

export default function ResearcherProfilePage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfileData(data)
      } catch (err: any) {
        setError(err.message || "Error fetching profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      setIsEditing(false)
    } catch (err) {
      alert("Error saving profile")
    }
  }

  const handleAddExpertise = () => {
    setProfileData({
      ...profileData,
      expertise: [...(profileData.expertise || []), ""],
    })
  }

  const handleRemoveExpertise = (index: number) => {
    setProfileData({
      ...profileData,
      expertise: (profileData.expertise || []).filter((_: any, i: number) => i !== index),
    })
  }

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...(profileData.expertise || [])]
    newExpertise[index] = value
    setProfileData({
      ...profileData,
      expertise: newExpertise,
    })
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading profile...</div>
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }
  if (!profileData) {
    return null
  }

  return (
    <ResearcherLayout active="profile" email={profileData.email} firstName={profileData.firstName}>
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="text-xl">
                    {profileData.firstName?.[0]}
                    {profileData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                    <Upload className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {profileData.firstName} {profileData.lastName}
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800">Verified Researcher</Badge>
                </div>
                <p className="text-lg text-gray-600 mb-2">{profileData.title}</p>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {profileData.institution}
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {profileData.department}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic contact and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName || ""}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName || ""}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email || ""}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone || ""}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your academic and professional background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={profileData.institution || ""}
                onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileData.department || ""}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ResearcherLayout>
  )
}
