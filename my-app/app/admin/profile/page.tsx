"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save } from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useToast } from "@/hooks/use-toast"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    institution: "",
    department: "",
    email: "",
    password: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile(data)
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          institution: data.institution || "",
          department: data.department || "",
          email: data.email || "",
          password: "",
        })
      } catch (err: any) {
        setError(err.message || "Error fetching profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      const updated = await res.json()
      setProfile(updated)
      setIsEditing(false)
      toast({ title: "Profile updated!", description: "Your profile was updated successfully." })
    } catch (err: any) {
      toast({ title: "Profile update failed", description: err.message || "Error saving profile", variant: "destructive" })
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!profile) return <div className="p-8 text-center text-gray-500">Profile not found.</div>

  return (
    <AdminLayout active="profile">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profileImage ? `http://localhost:5000/uploads/${profile.profileImage}` : "/placeholder.svg"} alt={profile.firstName + ' ' + profile.lastName} />
                  <AvatarFallback className="text-2xl">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-xl text-gray-600 mb-2">Admin</p>
                  <p className="text-lg text-blue-600 mb-4">
                    {profile.institution} {profile.department && <>• {profile.department}</>}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      {profile.email}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editable fields */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Institution</Label>
                  <Input
                    type="text"
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Department</Label>
                  <Input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                {isEditing ? (
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
} 