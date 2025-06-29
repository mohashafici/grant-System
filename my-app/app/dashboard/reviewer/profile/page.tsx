"use client"

import { useState, useEffect } from "react"
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

const staticProfileData = {
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
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    location: "",
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
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalReviews: 0,
    averageScore: 0,
    approvalRate: 0,
    specializations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Fetch user profile
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const userData = await res.json();
        setProfile(userData);

        // Fetch review stats
        const res2 = await fetch("http://localhost:5000/api/reviews/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviews = await res2.json();
        const completed = reviews.filter((r: any) => r.status === "Completed");
        const totalReviews = completed.length;
        const averageScore = totalReviews
          ? (completed.reduce((sum: number, r: any) => sum + (parseFloat(r.score) || 0), 0) / totalReviews).toFixed(1)
          : 0;
        const approved = completed.filter((r: any) => r.decision === "Approved").length;
        const approvalRate = totalReviews ? Math.round((approved / totalReviews) * 100) : 0;
        setStats({
          totalReviews,
          averageScore,
          approvalRate,
          specializations: [], // Add logic if you want to store this
        });
      } catch (err: any) {
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-center text-gray-500">Profile not found.</div>;

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
                    <AvatarImage src={profile.profileImage ? `http://localhost:5000/uploads/${profile.profileImage}` : "/placeholder.svg"} alt={profile.firstName + ' ' + profile.lastName} />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName?.[0]}{profile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-xl text-gray-600 mb-2">{profile.role === 'reviewer' ? 'Reviewer' : profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}</p>
                    <p className="text-lg text-blue-600 mb-4">
                      {profile.institution} {profile.department && <>• {profile.department}</>}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {profile.email}
                      </div>
                      {/* Add phone/location if you add to user model */}
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
                  <div className="text-2xl font-bold">{stats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">Completed reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageScore}</div>
                  <p className="text-xs text-muted-foreground">Out of 10</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                  <p className="text-xs text-muted-foreground">Proposals approved</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Specializations</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.specializations.length}</div>
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
                    <p className="text-gray-700 leading-relaxed">{profile.bio || "No bio provided."}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Areas of Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {/* You can add expertise to user model and map here if needed */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Review Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {/* You can add specializations to user model and map here if needed */}
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
                      {staticProfileData.education.map((edu, index) => (
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
                      {staticProfileData.experience.map((exp, index) => (
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
                      {staticProfileData.publications.map((pub, index) => (
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
                      {staticProfileData.awards.map((award, index) => (
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
