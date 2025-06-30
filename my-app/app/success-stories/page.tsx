import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowLeft,
  Award,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
  TrendingUp,
  Globe,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function SuccessStoriesPage() {
  const featuredStories = [
    {
      id: 1,
      title: "AI-Powered Drug Discovery Revolution",
      researcher: "Dr. Sarah Chen",
      institution: "Stanford University",
      category: "Biotechnology",
      grantAmount: 250000,
      year: 2023,
      duration: "3 years",
      image: "/images/ai-research-lab.jpg",
      summary:
        "Developed an AI system that reduced drug discovery time by 60%, leading to breakthrough treatments for rare diseases.",
      impact: [
        "3 new drug candidates identified",
        "60% reduction in discovery time",
        "2 patents filed",
        "Partnership with major pharmaceutical company",
      ],
      publications: 8,
      citations: 156,
      status: "Ongoing",
      quote:
        "This grant enabled us to push the boundaries of what's possible in drug discovery. The AI system we developed is now being used by researchers worldwide.",
    },
    {
      id: 2,
      title: "Climate Modeling for Extreme Weather Prediction",
      researcher: "Prof. Michael Rodriguez",
      institution: "MIT",
      category: "Climate Science",
      grantAmount: 180000,
      year: 2022,
      duration: "2 years",
      image: "/images/climate-research.jpg",
      summary:
        "Created advanced climate models that improved weather prediction accuracy by 40%, helping communities prepare for extreme weather events.",
      impact: [
        "40% improvement in prediction accuracy",
        "Deployed in 15 countries",
        "Saved an estimated $50M in disaster costs",
        "Trained 200+ meteorologists",
      ],
      publications: 12,
      citations: 234,
      status: "Completed",
      quote:
        "Our climate modeling breakthrough is now helping communities worldwide prepare for and mitigate the effects of extreme weather.",
    },
    {
      id: 3,
      title: "Quantum Computing Breakthrough in Cryptography",
      researcher: "Dr. Lisa Zhang",
      institution: "UC Berkeley",
      category: "Quantum Computing",
      grantAmount: 300000,
      year: 2023,
      duration: "4 years",
      image: "/images/quantum-lab.jpg",
      summary:
        "Achieved a 1000x speedup in complex calculations, revolutionizing cryptography and optimization algorithms.",
      impact: [
        "1000x speedup in calculations",
        "New quantum algorithms developed",
        "Industry partnerships established",
        "Next-generation security protocols",
      ],
      publications: 6,
      citations: 89,
      status: "Ongoing",
      quote:
        "This research is laying the foundation for the next generation of secure communications and computational capabilities.",
    },
  ]

  const impactStats = [
    { label: "Total Projects Funded", value: "150+", icon: Award },
    { label: "Research Publications", value: "500+", icon: BookOpen },
    { label: "Patents Filed", value: "75+", icon: Lightbulb },
    { label: "Global Impact", value: "50+ Countries", icon: Globe },
  ]

  const categories = [
    { name: "Artificial Intelligence", count: 35, color: "bg-blue-100 text-blue-800" },
    { name: "Climate Science", count: 28, color: "bg-green-100 text-green-800" },
    { name: "Biotechnology", count: 22, color: "bg-purple-100 text-purple-800" },
    { name: "Quantum Computing", count: 18, color: "bg-red-100 text-red-800" },
    { name: "Materials Science", count: 15, color: "bg-yellow-100 text-yellow-800" },
    { name: "Energy & Sustainability", count: 12, color: "bg-teal-100 text-teal-800" },
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
              <h1 className="text-xl font-semibold text-gray-900">Success Stories</h1>
              <p className="text-sm text-gray-600">Celebrating research excellence</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success Stories
            <span className="text-blue-600 block">Transforming Ideas into Impact</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our grants have enabled groundbreaking research, fostered innovation, and created lasting
            impact across diverse fields of science and technology.
          </p>
        </div>

        {/* Impact Statistics */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <Card key={index} className="border-blue-100 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Success Stories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Highlighting exceptional research projects that have made significant contributions to their fields
            </p>
          </div>

          <div className="space-y-12">
            {featuredStories.map((story, index) => (
              <Card key={story.id} className="border-blue-100 overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-8 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className={`p-8 ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge className="bg-blue-100 text-blue-800">{story.category}</Badge>
                      <Badge variant="outline">{story.status}</Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {story.researcher}
                      </span>
                      <span>{story.institution}</span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {story.year}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-6">{story.summary}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Grant Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />${story.grantAmount.toLocaleString()}
                          </div>
                          <div>Duration: {story.duration}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Research Output</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>{story.publications} publications</div>
                          <div>{story.citations} citations</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Impact</h4>
                      <ul className="space-y-1">
                        {story.impact.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700 mb-6">
                      "{story.quote}"<footer className="text-sm text-gray-600 mt-2">— {story.researcher}</footer>
                    </blockquote>

                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Full Case Study
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Research Categories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our funded projects span diverse research areas, each contributing unique innovations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <Badge className={`${category.color} text-lg px-3 py-1`}>{category.count} Projects</Badge>
                  <p className="text-gray-600 text-sm mt-3">
                    Funded projects making significant contributions to {category.name.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Be Part of the Next Success Story</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Join our community of innovative researchers and transform your groundbreaking ideas into impactful
                reality. Apply for funding today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                    Apply for Grant
                  </Button>
                </Link>
                <Link href="/guidelines">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 bg-transparent"
                  >
                    View Guidelines
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
