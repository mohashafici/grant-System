"use client";
import { useState } from "react";
import { BookOpen, Menu, X, Target, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import PublicNavbar from "@/components/public-navbar";

const menuItems = [
  { href: "/search-grants", label: "Search Grants" },
  { href: "/grant-calendar", label: "Grant Calendar" },
  { href: "/application-help", label: "Application Help" },
  { href: "/resources", label: "Resources & Training" },
  { href: "/community", label: "Community & Forums" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const values = [
  {
    title: "Integrity",
    description: "We uphold the highest standards of integrity in all our actions.",
    icon: BookOpen, // or any other icon from lucide-react
  },
  {
    title: "Collaboration",
    description: "We work together, across boundaries, to meet the needs of our community.",
    icon: Users, // import Users from lucide-react
  },
  {
    title: "Innovation",
    description: "We foster creativity and embrace new ideas to drive progress.",
    icon: Lightbulb, // already imported
  },
  // Add more values as needed
];

const teamMembers = [
  {
    name: "Mohamed Shafici Abdirahmaan",
    role: "Lead Full Stack Developer",
    image: "/placeholder-user.jpg",
    bio: "Mohamed architected and built the core backend and frontend systems for the grant platform.",
  },
  {
    name: "Abdirisaaq Calas Ali",
    role: "UI/UX Designer & Frontend Engineer",
    image: "/placeholder-user.jpg",
    bio: "Abdirisaaq designed the user experience and implemented the responsive UI for all user roles.",
  },
  {
    name: "Mohammed Abdi Ali",
    role: "DevOps & Security Engineer",
    image: "/placeholder-user.jpg",
    bio: "Mohammed set up CI/CD, cloud infrastructure, and ensured platform security and reliability.",
  },
  {
    name: " Abdishakuur Mohamed",
    role: "Product Manager & QA Lead",
    image: "/placeholder-user.jpg",
    bio: "Abdishakuur coordinated development, managed requirements, and led testing for a robust launch.",
  },
];

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />

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
                  src="/me.jpeg?height=700&width=500&text=Research+Team+Meeting"
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
                    src={member.image}
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
