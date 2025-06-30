import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  ArrowLeft,
  Download,
  FileText,
  Video,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const templates = [
    {
      title: "Grant Application Template",
      description: "Comprehensive template with all required sections and formatting guidelines",
      type: "Word Document",
      size: "2.5 MB",
      downloads: 1250,
      category: "Application",
    },
    {
      title: "Budget Justification Template",
      description: "Detailed budget template with examples and calculation formulas",
      type: "Excel Spreadsheet",
      size: "1.8 MB",
      downloads: 980,
      category: "Budget",
    },
    {
      title: "Research Timeline Template",
      description: "Project timeline template with milestone tracking and Gantt chart",
      type: "Excel Spreadsheet",
      size: "1.2 MB",
      downloads: 756,
      category: "Planning",
    },
    {
      title: "Literature Review Template",
      description: "Structured template for organizing and presenting literature reviews",
      type: "Word Document",
      size: "1.5 MB",
      downloads: 642,
      category: "Research",
    },
  ]

  const guides = [
    {
      title: "Complete Application Guide",
      description: "Step-by-step guide to preparing a successful grant application",
      pages: 45,
      readTime: "30 min",
      category: "Application",
      featured: true,
    },
    {
      title: "Budget Planning Best Practices",
      description: "How to create realistic budgets and justify expenses effectively",
      pages: 28,
      readTime: "20 min",
      category: "Budget",
      featured: false,
    },
    {
      title: "Writing Compelling Research Proposals",
      description: "Tips for crafting engaging and persuasive research narratives",
      pages: 35,
      readTime: "25 min",
      category: "Writing",
      featured: true,
    },
    {
      title: "Collaboration and Team Building",
      description: "Building effective research teams and managing collaborations",
      pages: 22,
      readTime: "15 min",
      category: "Management",
      featured: false,
    },
    {
      title: "Ethics and Compliance Guide",
      description: "Understanding ethical requirements and compliance procedures",
      pages: 38,
      readTime: "25 min",
      category: "Compliance",
      featured: false,
    },
    {
      title: "Post-Award Management",
      description: "Managing funded projects, reporting, and milestone tracking",
      pages: 32,
      readTime: "20 min",
      category: "Management",
      featured: true,
    },
  ]

  const webinars = [
    {
      title: "Grant Writing Masterclass",
      presenter: "Dr. Sarah Mitchell",
      date: "March 15, 2024",
      duration: "90 min",
      attendees: 450,
      recording: true,
      upcoming: false,
    },
    {
      title: "Budget Planning Workshop",
      presenter: "Prof. James Anderson",
      date: "March 22, 2024",
      duration: "60 min",
      attendees: 320,
      recording: true,
      upcoming: false,
    },
    {
      title: "AI Research Funding Opportunities",
      presenter: "Dr. Lisa Zhang",
      date: "April 5, 2024",
      duration: "75 min",
      attendees: 0,
      recording: false,
      upcoming: true,
    },
    {
      title: "Collaborative Research Strategies",
      presenter: "Prof. Michael Chen",
      date: "April 12, 2024",
      duration: "60 min",
      attendees: 0,
      recording: false,
      upcoming: true,
    },
  ]

  const tools = [
    {
      title: "Application Checklist",
      description: "Interactive checklist to ensure your application is complete",
      type: "Interactive Tool",
      category: "Application",
    },
    {
      title: "Budget Calculator",
      description: "Calculate indirect costs and budget allocations automatically",
      type: "Calculator",
      category: "Budget",
    },
    {
      title: "Timeline Generator",
      description: "Create professional project timelines with milestones",
      type: "Generator",
      category: "Planning",
    },
    {
      title: "Collaboration Matcher",
      description: "Find potential collaborators based on research interests",
      type: "Matching Tool",
      category: "Networking",
    },
  ]

  const externalResources = [
    {
      title: "National Science Foundation",
      description: "Federal funding opportunities and research guidelines",
      url: "https://nsf.gov",
      category: "Funding",
    },
    {
      title: "Research Ethics Guidelines",
      description: "Comprehensive ethics guidelines for research conduct",
      url: "#",
      category: "Ethics",
    },
    {
      title: "Open Science Framework",
      description: "Tools and resources for open and reproducible research",
      url: "#",
      category: "Research",
    },
    {
      title: "Grant Writing Resources",
      description: "Additional grant writing tips and best practices",
      url: "#",
      category: "Writing",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Resources</h1>
              <p className="text-sm text-gray-600">Tools and guides for researchers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Research Resources
            <span className="text-blue-600 block">Tools for Success</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access comprehensive resources, templates, guides, and tools designed to help you prepare successful grant
            applications and manage funded research projects.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">Templates & Guides</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Video Tutorials</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">5K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="templates" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Application Templates
                </CardTitle>
                <CardDescription>Ready-to-use templates to streamline your grant application process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{template.type}</span>
                        <span>{template.size}</span>
                        <span>{template.downloads} downloads</span>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                  Comprehensive Guides
                </CardTitle>
                <CardDescription>
                  In-depth guides covering all aspects of grant applications and research management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map((guide, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow relative"
                    >
                      {guide.featured && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      <div className="mb-4">
                        <Badge variant="outline" className="mb-2">
                          {guide.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                        <p className="text-gray-600 text-sm">{guide.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {guide.pages} pages
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {guide.readTime}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Guide
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webinars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 text-blue-600 mr-2" />
                  Webinars & Training
                </CardTitle>
                <CardDescription>Live and recorded training sessions from grant writing experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Upcoming Webinars</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {webinars
                        .filter((w) => w.upcoming)
                        .map((webinar, index) => (
                          <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{webinar.title}</h4>
                                <p className="text-sm text-gray-600">by {webinar.presenter}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Upcoming</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {webinar.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {webinar.duration}
                              </span>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Register Now</Button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Recorded Sessions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {webinars
                        .filter((w) => !w.upcoming)
                        .map((webinar, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{webinar.title}</h4>
                                <p className="text-sm text-gray-600">by {webinar.presenter}</p>
                              </div>
                              <Badge variant="outline">Recorded</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <span>{webinar.attendees} attended</span>
                              <span>{webinar.duration}</span>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Watch Recording
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                  Interactive Tools
                </CardTitle>
                <CardDescription>Online tools to help you prepare and manage your grant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {tools.map((tool, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                        </div>
                        <Badge variant="outline">{tool.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">{tool.type}</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Launch Tool
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="external" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="w-5 h-5 text-blue-600 mr-2" />
                  External Resources
                </CardTitle>
                <CardDescription>
                  Curated links to valuable external resources and partner organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {externalResources.map((resource, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                        </div>
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Resource
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="mt-16">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need Additional Support?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Our support team is available to provide personalized assistance with your grant applications and
                research projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 bg-transparent"
                  >
                    View FAQ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
