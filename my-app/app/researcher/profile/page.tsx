"use client"

import { useState } from "react"
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
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@stanford.edu",
    phone: "+1 (555) 123-4567",
    title: "Associate Professor",
    department: "Computer Science",
    institution: "Stanford University",
    address: "353 Jane Stanford Way, Stanford, CA 94305",
    bio: "Dr. Sarah Johnson is an Associate Professor in the Computer Science Department at Stanford University. Her research focuses on artificial intelligence, machine learning, and their applications in healthcare. She has published over 50 peer-reviewed papers and has been awarded multiple grants for her innovative research.",
    expertise: ["Artificial Intelligence", "Machine Learning", "Healthcare Technology", "Data Science"],
    education: [
      { degree: "Ph.D. in Computer Science", institution: "MIT", year: "2015" },
      { degree: "M.S. in Computer Science", institution: "Carnegie Mellon University", year: "2011" },
      { degree: "B.S. in Computer Engineering", institution: "UC Berkeley", year: "2009" },
    ],
    orcid: "0000-0002-1825-0097",
    website: "https://cs.stanford.edu/~sjohnson",
    linkedin: "https://linkedin.com/in/sarahjohnsoncs",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    console.log("Saving profile:", profileData)
    setIsEditing(false)
    // Handle save logic here
  }

  const handleAddExpertise = () => {
    setProfileData({
      ...profileData,
      expertise: [...profileData.expertise, ""],
    })
  }

  const handleRemoveExpertise = (index: number) => {
    setProfileData({
      ...profileData,
      expertise: profileData.expertise.filter((_, i) => i !== index),
    })
  }

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...profileData.expertise]
    newExpertise[index] = value
    setProfileData({
      ...profileData,
      expertise: newExpertise,
    })
  }

  return (
    <ResearcherLayout active="profile">
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600">Manage your personal and professional information</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                        <AvatarFallback className="text-xl">
                          {profileData.firstName[0]}
                          {profileData.lastName[0]}
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
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={profileData.institution}
                      onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your research background and expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about your research background and interests..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <div className="space-y-2">
                      {profileData.expertise.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={area}
                            onChange={(e) => handleExpertiseChange(index, e.target.value)}
                            disabled={!isEditing}
                            placeholder="Enter area of expertise"
                          />
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveExpertise(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={handleAddExpertise} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expertise Area
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orcid">ORCID ID</Label>
                      <Input
                        id="orcid"
                        value={profileData.orcid}
                        onChange={(e) => setProfileData({ ...profileData, orcid: e.target.value })}
                        disabled={!isEditing}
                        placeholder="0000-0000-0000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://your-website.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your academic background and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {edu.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Publications */}
              <Card>
                <CardHeader>
                  <CardTitle>Publications & Research Output</CardTitle>
                  <CardDescription>Your recent publications and research contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Machine Learning Applications in Medical Diagnosis: A Comprehensive Review",
                        journal: "Journal of Medical AI",
                        year: "2024",
                        type: "Journal Article",
                        citations: 15,
                      },
                      {
                        title: "Improving Healthcare Outcomes with AI-Powered Decision Support Systems",
                        journal: "International Conference on AI in Healthcare",
                        year: "2023",
                        type: "Conference Paper",
                        citations: 8,
                      },
                      {
                        title: "Ethical Considerations in AI-Driven Medical Research",
                        journal: "AI Ethics Quarterly",
                        year: "2023",
                        type: "Journal Article",
                        citations: 22,
                      },
                    ].map((pub, index) => (
                      <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{pub.title}</h4>
                          <p className="text-sm text-gray-600">{pub.journal}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary">{pub.type}</Badge>
                            <span className="text-xs text-gray-500">{pub.year}</span>
                            <span className="text-xs text-gray-500">{pub.citations} citations</span>
                          </div>
                        </div>
                        {isEditing && (
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Publication
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Research Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Research Interests & Keywords</CardTitle>
                  <CardDescription>Your primary research areas and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Research Keywords</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Artificial Intelligence",
                          "Machine Learning",
                          "Healthcare Technology",
                          "Medical Diagnosis",
                          "Deep Learning",
                          "Computer Vision",
                          "Natural Language Processing",
                          "Data Science",
                        ].map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {keyword}
                            {isEditing && <button className="ml-1 text-blue-600 hover:text-blue-800">×</button>}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button size="sm" variant="outline" className="h-6">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="research-statement">Research Statement</Label>
                      <Textarea
                        id="research-statement"
                        value="My research focuses on developing AI-powered solutions for healthcare challenges, particularly in medical diagnosis and treatment optimization. I am passionate about creating ethical and explainable AI systems that can improve patient outcomes while maintaining transparency and trust."
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Describe your research focus and goals..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaborations & Networks */}
              <Card>
                <CardHeader>
                  <CardTitle>Collaborations & Professional Networks</CardTitle>
                  <CardDescription>Your research collaborations and professional affiliations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Current Collaborations</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          { name: "Dr. Michael Chen", institution: "MIT", project: "AI Ethics in Healthcare" },
                          { name: "Prof. Lisa Zhang", institution: "Harvard", project: "Medical Image Analysis" },
                        ].map((collab, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{collab.name}</div>
                              <div className="text-sm text-gray-600">{collab.institution}</div>
                              <div className="text-xs text-gray-500">{collab.project}</div>
                            </div>
                            {isEditing && (
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button size="sm" variant="outline" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Collaboration
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium">Professional Memberships</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          "IEEE Computer Society",
                          "ACM",
                          "American Medical Informatics Association",
                          "International Society for AI in Medicine",
                        ].map((membership, index) => (
                          <Badge key={index} variant="outline">
                            {membership}
                            {isEditing && <button className="ml-1 text-gray-600 hover:text-gray-800">×</button>}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button size="sm" variant="outline" className="h-6">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics & Performance</CardTitle>
                  <CardDescription>Your activity summary and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4</div>
                      <div className="text-sm text-gray-600">Total Proposals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$100K</div>
                      <div className="text-sm text-gray-600">Total Funding</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">2</div>
                      <div className="text-sm text-gray-600">Years Active</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Success Rate</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={25} className="flex-1" />
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Profile Completeness</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={85} className="flex-1" />
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                    </div>
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
