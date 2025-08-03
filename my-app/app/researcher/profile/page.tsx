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
import { authStorage } from "@/lib/auth"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

export default function ResearcherProfilePage() {
  useAuthRedirect(["researcher"])
  const [profileData, setProfileData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const token = authStorage.getToken()
        const res = await fetch(`${API_BASE_URL}/users/me`, {
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
      const token = authStorage.getToken()
      const res = await fetch(`${API_BASE_URL}/users/me`, {
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
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8 px-2">
        <header className="w-full max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </header>
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0">
          <CardContent className="pt-8 pb-10 px-8 flex flex-col items-center w-full">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <Avatar className="w-28 h-28 shadow-md border-4 border-white">
                  <AvatarImage src="/placeholder.svg?height=112&width=112" alt="Profile" />
                  <AvatarFallback className="text-2xl">
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
              <h2 className="text-2xl font-bold text-gray-900 text-center">Dr. {profileData.firstName} {profileData.lastName}</h2>
              <Badge className="bg-blue-100 text-blue-800 mt-2">Verified Researcher</Badge>
              <p className="text-md text-gray-600 mt-1">{profileData.title}</p>
              <div className="flex flex-wrap justify-center gap-4 text-gray-600 mt-2">
                <span className="flex items-center"><Building className="w-4 h-4 mr-1" />{profileData.institution}</span>
                <span className="flex items-center"><GraduationCap className="w-4 h-4 mr-1" />{profileData.department}</span>
                        </div>
                      </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={profileData.firstName || ""} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} disabled={!isEditing} />
                  </div>
                  <div className="flex flex-col">
                      <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={profileData.lastName || ""} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} disabled={!isEditing} />
                  </div>
                  <div className="flex flex-col">
                      <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileData.email || ""} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} disabled={!isEditing} />
                    </div>
                  <div className="flex flex-col">
                      <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={profileData.phone || ""} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} disabled={!isEditing} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Professional Information</h3>
                  <div className="space-y-2">
                  <div className="flex flex-col">
                    <Label htmlFor="institution">Institution</Label>
                    <Input id="institution" value={profileData.institution || ""} onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })} disabled={!isEditing} />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={profileData.department || ""} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} disabled={!isEditing} />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={profileData.title || ""} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </div>
            {/* Expertise Section */}
            <div className="w-full mt-8">
              <h3 className="text-lg font-semibold mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {(profileData.expertise || []).map((exp: string, idx: number) => (
                  <Badge key={idx} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {exp}
                    {isEditing && (
                      <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveExpertise(idx)}>&times;</button>
                    )}
                  </Badge>
                ))}
                {isEditing && (
                  <Button size="sm" variant="outline" className="px-2 py-1 text-xs" onClick={handleAddExpertise}>+ Add</Button>
                )}
              </div>
            </div>
            {/* Save/Cancel Buttons */}
            {isEditing ? (
              <div className="flex justify-end w-full mt-8 gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              </div>
            ) : (
              <div className="flex justify-end w-full mt-8">
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
              </div>
            )}
                </CardContent>
              </Card>
      </div>
    </ResearcherLayout>
  )
}
