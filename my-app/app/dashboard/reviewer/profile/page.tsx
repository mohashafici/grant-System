"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  FileText,
  User,
  History,
  Award,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Star,
  Settings,
} from "lucide-react"
import { ReviewerSidebar } from "@/components/ui/sidebar"

const profileData = {
  name: "Prof. David Martinez",
  title: "Professor of Artificial Intelligence",
  institution: "MIT",
  department: "Computer Science & Artificial Intelligence Laboratory",
  email: "d.martinez@mit.edu",
  phone: "+1 (617) 555-0123",
  location: "Cambridge, MA",
  joinDate: "September 2021",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Professor Martinez is a leading researcher in artificial intelligence and machine learning with over 15 years of experience in academia and industry. His research focuses on deep learning, natural language processing, and AI ethics.",
  expertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "AI Ethics",
    "Neural Networks",
    "Data Science",
  ],
  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Stanford University",
      year: "2008",
      focus: "Machine Learning and Artificial Intelligence",
    },
    {
      degree: "M.S. in Computer Science",
      institution: "Carnegie Mellon University",
      year: "2004",
      focus: "Computer Science",
    },
    {
      degree: "B.S. in Computer Engineering",
      institution: "UC Berkeley",
      year: "2002",
      focus: "Computer Engineering",
    },
  ],
  experience: [
    {
      position: "Professor",
      institution: "MIT",
      period: "2015 - Present",
      description: "Leading research in AI and machine learning, teaching graduate courses.",
    },
    {
      position: "Associate Professor",
      institution: "MIT",
      period: "2010 - 2015",
      description: "Research and teaching in computer science and AI.",
    },
    {
      position: "Research Scientist",
      institution: "Google Research",
      period: "2008 - 2010",
      description: "Developed machine learning algorithms for search and recommendation systems.",
    },
  ],
  publications: [
    {
      title: "Deep Learning Approaches to Natural Language Understanding",
      journal: "Nature Machine Intelligence",
      year: "2023",
      citations: 245,
    },
    {
      title: "Ethical Considerations in AI Decision Making",
      journal: "AI & Society",
      year: "2023",
      citations: 189,
    },
    {
      title: "Transformer Networks for Multi-Modal Learning",
      journal: "ICML 2022",
      year: "2022",
      citations: 567,
    },
  ],
  awards: [
    {
      title: "Outstanding Reviewer Award",
      organization: "National Science Foundation",
      year: "2023",
    },
    {
      title: "Excellence in Teaching Award",
      organization: "MIT",
      year: "2022",
    },
    {
      title: "Best Paper Award",
      organization: "ICML Conference",
      year: "2021",
    },
  ],
  reviewStats: {
    totalReviews: 47,
    averageScore: 7.8,
    approvalRate: 68,
    specializations: ["AI/ML", "Computer Science", "Data Science"],
  },
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    bio: profileData.bio,
    phone: profileData.phone,
    location: profileData.location,
  })

  const handleSubmit = () => {
    console.log("Updating profile:", formData)
    onClose()
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Update your profile information</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function ReviewerProfilePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ReviewerSidebar active="profile" />
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600">Manage your reviewer profile and information</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <EditProfileModal onClose={() => {}} />
              </Dialog>
            </div>
          </header>

          <main className="p-6">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
                    <p className="text-xl text-gray-600 mb-2">{profileData.title}</p>
                    <p className="text-lg text-blue-600 mb-4">
                      {profileData.institution} • {profileData.department}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {profileData.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profileData.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Reviewer since {profileData.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.reviewStats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">Completed reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.reviewStats.averageScore}</div>
                  <p className="text-xs text-muted-foreground">Out of 10</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.reviewStats.approvalRate}%</div>
                  <p className="text-xs text-muted-foreground">Proposals approved</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Specializations</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.reviewStats.specializations.length}</div>
                  <p className="text-xs text-muted-foreground">Areas of expertise</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="awards">Awards</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Areas of Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileData.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Review Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileData.reviewStats.specializations.map((spec, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profileData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h3 className="font-semibold text-lg">{edu.degree}</h3>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                          <p className="text-gray-600">{edu.year}</p>
                          <p className="text-sm text-gray-500 mt-1">{edu.focus}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profileData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <h3 className="font-semibold text-lg">{exp.position}</h3>
                          <p className="text-green-600 font-medium">{exp.institution}</p>
                          <p className="text-gray-600">{exp.period}</p>
                          <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Publications</CardTitle>
                    <CardDescription>Selected recent publications and research papers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.publications.map((pub, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h3 className="font-semibold text-lg mb-2">{pub.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {pub.journal} • {pub.year}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              {pub.citations} citations
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="awards" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Awards & Recognition</CardTitle>
                    <CardDescription>Professional awards and recognition received</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.awards.map((award, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Award className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{award.title}</h3>
                            <p className="text-gray-600">{award.organization}</p>
                            <p className="text-sm text-gray-500">{award.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
