import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award } from "lucide-react"

const currentGrants = [
  {
    id: 1,
    title: "AI Innovation Research Grant 2024",
    description: "Supporting breakthrough research in artificial intelligence and machine learning applications.",
    deadline: "March 15, 2024",
    funding: "$50,000",
    category: "Technology",
    applicants: 45,
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    description: "Funding renewable energy research and clean technology development projects.",
    deadline: "April 20, 2024",
    funding: "$75,000",
    category: "Environment",
    applicants: 32,
  },
  {
    id: 3,
    title: "Healthcare Innovation Fund",
    description: "Supporting medical research and healthcare technology advancement initiatives.",
    deadline: "May 10, 2024",
    funding: "$100,000",
    category: "Healthcare",
    applicants: 28,
  },
]

export default function LandingPage() {
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
                <h1 className="text-xl font-bold text-gray-900">Innovation & Research</h1>
                <p className="text-sm text-gray-600">Grant Portal</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild className="bg-white text-gray-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Innovation Through
            <span className="text-blue-600"> Research Funding</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect researchers with funding opportunities, streamline the application process, and accelerate
            breakthrough discoveries that shape our future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/grants">Browse Grants</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white text-gray-700">
              <Link href="/register">Start Application</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Current Grant Opportunities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Current Grant Opportunities</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our latest funding opportunities across various research domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGrants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {grant.category}
                    </Badge>
                    <span className="text-2xl font-bold text-blue-600">{grant.funding}</span>
                  </div>
                  <CardTitle className="text-lg">{grant.title}</CardTitle>
                  <CardDescription className="text-sm">{grant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Deadline: {grant.deadline}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {grant.applicants} applicants
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/register">Apply Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Total Funding Awarded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Projects Funded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">300+</div>
              <div className="text-gray-600">Active Researchers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
