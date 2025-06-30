"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Carousel images with professional/academic themes
  const carouselImages = [
    {
      src: "/images/research-agreement.jpg",
      alt: "Research agreement signing ceremony",
      title: "Partnership Agreements",
      description: "Fostering collaboration between institutions",
    },
    {
      src: "/images/handshake-agreement.jpg",
      alt: "Professional handshake agreement",
      title: "Grant Awards",
      description: "Celebrating research excellence and innovation",
    },
    {
      src: "/images/scientists-collaboration.jpg",
      alt: "Scientists collaborating",
      title: "Research Collaboration",
      description: "Bringing together brilliant minds",
    },
    {
      src: "/images/innovation-lab.jpg",
      alt: "Innovation laboratory",
      title: "Innovation Labs",
      description: "State-of-the-art research facilities",
    },
    {
      src: "/images/academic-conference.jpg",
      alt: "Academic conference",
      title: "Knowledge Sharing",
      description: "Advancing science through collaboration",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const menuItems = [
    { href: "/about", label: "About" },
    { href: "/guidelines", label: "Guidelines" },
    { href: "/success-stories", label: "Success Stories" },
    { href: "/resources", label: "Resources" },
    { href: "/faq", label: "FAQ" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Innovation Grant Portal</h1>
                <p className="text-sm text-gray-600">Research Excellence Initiative</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              ))}
              <Link href="/login">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent w-full mt-2"
                  >
                    Sign In
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Image Carousel */}
      <section className="relative h-96 overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{image.title}</h2>
                  <p className="text-lg md:text-xl opacity-90">{image.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Advancing Research Through
            <span className="text-blue-600 block">Innovation Grants</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Submit your groundbreaking research proposals, collaborate with expert reviewers, and secure funding for
            projects that shape the future of science and technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Apply for Grant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/guidelines">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
              >
                View Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process ensures efficient grant application, review, and management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Submit Application</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Create detailed research proposals with our intuitive application form. Upload supporting documents
                  and track your submission status.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Expert Review</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Your proposal is evaluated by qualified reviewers in your field. Receive detailed feedback and scoring
                  based on established criteria.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Grant Award</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Successful applications receive funding and ongoing support. Manage your grant lifecycle through our
                  comprehensive dashboard.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how our grants have enabled groundbreaking research and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src="/images/ai-research-lab.jpg"
                    alt="AI Research Lab"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Drug Discovery</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Dr. Sarah Chen's team developed an AI system that reduced drug discovery time by 60%, leading to
                  breakthrough treatments for rare diseases.
                </p>
                <Link href="/success-stories" className="text-blue-600 text-sm font-medium hover:underline">
                  Read More →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src="/images/climate-research.jpg"
                    alt="Climate Research"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Climate Modeling Innovation</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Prof. Michael Rodriguez created advanced climate models that improved weather prediction accuracy by
                  40%, helping communities prepare for extreme weather.
                </p>
                <Link href="/success-stories" className="text-blue-600 text-sm font-medium hover:underline">
                  Read More →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src="/images/quantum-lab.jpg"
                    alt="Quantum Lab"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quantum Computing Breakthrough</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Dr. Lisa Zhang's quantum computing research achieved a 1000x speedup in complex calculations,
                  revolutionizing cryptography and optimization.
                </p>
                <Link href="/success-stories" className="text-blue-600 text-sm font-medium hover:underline">
                  Read More →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-4xl">
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
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Researcher Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Research Journey?</h3>
          <p className="text-gray-600 mb-8">
            Join hundreds of researchers who have successfully secured funding through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Innovation Grant Portal</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering researchers to advance science and technology through innovative grant funding.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Researchers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/guidelines" className="hover:text-white">
                    Application Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="hover:text-white">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-white">
                    News & Updates
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
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
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:text-white">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Innovation Grant Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
