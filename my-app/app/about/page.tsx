import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Users, Target, Award, Globe, Heart, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Director of Research Programs",
      image: "/placeholder.svg?height=200&width=200&text=Dr.+Sarah+Mitchell",
      bio: "Leading researcher in AI and machine learning with 15+ years of experience in grant management.",
    },
    {
      name: "Prof. James Anderson",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=200&width=200&text=Prof.+James+Anderson",
      bio: "Former NASA scientist specializing in space technology and innovation funding strategies.",
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Head of Reviewer Relations",
      image: "/placeholder.svg?height=200&width=200&text=Dr.+Maria+Rodriguez",
      bio: "Expert in peer review processes with extensive experience in academic evaluation systems.",
    },
    {
      name: "Prof. David Chen",
      role: "Strategic Partnerships Director",
      image: "/placeholder.svg?height=200&width=200&text=Prof.+David+Chen",
      bio: "Building bridges between academia and industry to foster collaborative research initiatives.",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We maintain the highest standards in research evaluation and funding decisions.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Transparent, fair, and ethical practices guide all our operations.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Fostering partnerships between researchers, institutions, and industry.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Supporting groundbreaking research that pushes the boundaries of knowledge.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Funding research that addresses worldwide challenges and benefits humanity.",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Celebrating and rewarding exceptional research contributions.",
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
              <h1 className="text-xl font-semibold text-gray-900">About Us</h1>
              <p className="text-sm text-gray-600">Innovation Grant Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Research
            <span className="text-blue-600 block">Innovation Worldwide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to advancing scientific discovery and technological innovation by connecting visionary
            researchers with the funding they need to transform ideas into reality.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to research funding by providing a transparent, efficient, and fair platform that
                connects innovative researchers with grant opportunities. We strive to accelerate scientific progress
                and technological advancement for the benefit of society.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To be the world's leading platform for research grant management, fostering a global community of
                innovators who tackle humanity's greatest challenges through collaborative, cutting-edge research and
                development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Founded by researchers, for researchers - learn how we're transforming the grant application process
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-blue-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/placeholder.svg?height=400&width=500&text=Research+Team+Meeting"
                  alt="Research team meeting"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Founded in 2020</h3>
                <p className="text-gray-600 mb-4">
                  The Innovation Grant Portal was born from the frustration of researchers who experienced the
                  complexity and inefficiency of traditional grant application processes. Our founding team, comprised
                  of leading scientists and technology experts, recognized the need for a modern, streamlined approach
                  to research funding.
                </p>
                <p className="text-gray-600 mb-4">
                  Since our inception, we have successfully facilitated over $2.5 million in research funding,
                  supporting 150+ innovative projects across diverse fields including artificial intelligence, climate
                  science, biotechnology, and quantum computing.
                </p>
                <p className="text-gray-600">
                  Today, we continue to evolve our platform, incorporating feedback from our community of researchers,
                  reviewers, and institutional partners to create the most effective grant management system possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our mission and shape our approach to research funding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals leading our mission to transform research funding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="mb-16">
          <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">$2.5M+</div>
                <div className="text-blue-100">Total Funding Awarded</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">150+</div>
                <div className="text-blue-100">Projects Funded</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Partner Institutions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Researcher Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're a researcher seeking funding or an expert reviewer, become part of our mission to advance
              scientific discovery and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
