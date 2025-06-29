"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, Users, Search, Filter, Award } from "lucide-react"

const allGrants = [
  {
    id: 1,
    title: "AI Innovation Research Grant 2024",
    description:
      "Supporting breakthrough research in artificial intelligence and machine learning applications for healthcare, education, and industry transformation.",
    deadline: "March 15, 2024",
    funding: "$50,000",
    category: "Technology",
    applicants: 45,
    requirements: "PhD in Computer Science or related field, 3+ years research experience",
    status: "Open",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions Fund",
    description:
      "Funding renewable energy research and clean technology development projects that address climate change and environmental sustainability.",
    deadline: "April 20, 2024",
    funding: "$75,000",
    category: "Environment",
    applicants: 32,
    requirements: "Masters in Environmental Science, Engineering, or related field",
    status: "Open",
  },
  {
    id: 3,
    title: "Healthcare Innovation Initiative",
    description:
      "Supporting medical research and healthcare technology advancement initiatives that improve patient outcomes and healthcare delivery.",
    deadline: "May 10, 2024",
    funding: "$100,000",
    category: "Healthcare",
    applicants: 28,
    requirements: "MD, PhD in Medical Sciences, or equivalent qualification",
    status: "Open",
  },
  {
    id: 4,
    title: "Social Impact Research Program",
    description:
      "Funding research projects that address social challenges and promote community development through innovative solutions.",
    deadline: "June 15, 2024",
    funding: "$40,000",
    category: "Social Sciences",
    applicants: 22,
    requirements: "PhD in Social Sciences, Psychology, or related field",
    status: "Open",
  },
  {
    id: 5,
    title: "Educational Technology Advancement",
    description:
      "Supporting research and development of educational technologies that enhance learning outcomes and accessibility.",
    deadline: "February 28, 2024",
    funding: "$60,000",
    category: "Education",
    applicants: 38,
    requirements: "Masters in Education, Educational Technology, or related field",
    status: "Closing Soon",
  },
  {
    id: 6,
    title: "Quantum Computing Research Initiative",
    description:
      "Advanced research in quantum computing applications, algorithms, and hardware development for next-generation computing.",
    deadline: "January 30, 2024",
    funding: "$120,000",
    category: "Technology",
    applicants: 15,
    requirements: "PhD in Physics, Computer Science, or Mathematics",
    status: "Closed",
  },
]

export default function GrantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [fundingFilter, setFundingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredGrants = allGrants.filter((grant) => {
    const matchesSearch =
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || grant.category === categoryFilter
    const matchesFunding =
      fundingFilter === "all" ||
      (fundingFilter === "low" && Number.parseInt(grant.funding.replace(/[$,]/g, "")) < 50000) ||
      (fundingFilter === "medium" &&
        Number.parseInt(grant.funding.replace(/[$,]/g, "")) >= 50000 &&
        Number.parseInt(grant.funding.replace(/[$,]/g, "")) < 100000) ||
      (fundingFilter === "high" && Number.parseInt(grant.funding.replace(/[$,]/g, "")) >= 100000)
    const matchesStatus = statusFilter === "all" || grant.status === statusFilter

    return matchesSearch && matchesCategory && matchesFunding && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Closing Soon":
        return "bg-yellow-100 text-yellow-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800"
      case "Healthcare":
        return "bg-green-100 text-green-800"
      case "Environment":
        return "bg-emerald-100 text-emerald-800"
      case "Social Sciences":
        return "bg-purple-100 text-purple-800"
      case "Education":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Grant Opportunities</h1>
                <p className="text-sm text-gray-600">Discover funding for your research</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild className="bg-white text-gray-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/register">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search grants by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={fundingFilter} onValueChange={setFundingFilter}>
                <SelectTrigger className="w-[180px]">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Funding Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="low">Under $50K</SelectItem>
                  <SelectItem value="medium">$50K - $100K</SelectItem>
                  <SelectItem value="high">Over $100K</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closing Soon">Closing Soon</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredGrants.length} of {allGrants.length} grants
          </div>
        </div>

        {/* Grants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrants.map((grant) => (
            <Card key={grant.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(grant.category)}>{grant.category}</Badge>
                    <Badge className={getStatusColor(grant.status)}>{grant.status}</Badge>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{grant.funding}</span>
                </div>
                <CardTitle className="text-lg leading-tight">{grant.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-3">{grant.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {grant.deadline}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {grant.applicants ?? 0} applicants
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Requirements:</strong> {grant.requirements}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGrants.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Grant Portal</span>
              </div>
              <p className="text-gray-400 text-sm">Connecting researchers with funding opportunities worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Researchers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/grants" className="hover:text-white">
                    Browse Grants
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-white">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Innovation & Research Grant Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
