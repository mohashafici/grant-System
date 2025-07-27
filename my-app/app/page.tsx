"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Award, ArrowRight, ChevronLeft, ChevronRight, Menu, X, Search } from "lucide-react"
import Link from "next/link"
import PublicNavbar from "@/components/public-navbar";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/search-grants", label: "Search Grants" },
  { href: "/grant-calendar", label: "Grant Calendar" },
  { href: "/application-help", label: "Application Help" },
  { href: "/resources", label: "Resources & Training" },
  { href: "/community", label: "Community & Forums" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredGrants, setFeaturedGrants] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        generateSearchSuggestions(searchQuery);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Generate search suggestions based on query
  const generateSearchSuggestions = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/grants?limit=5&search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        const suggestions = data
          .filter((g: any) => g.status === "Active")
          .slice(0, 5)
          .map((g: any) => g.title);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search-grants?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    window.location.href = `/search-grants?q=${encodeURIComponent(suggestion)}`
  }

  // Optimized featured grants loading with error handling and caching
  useEffect(() => {
    const loadFeaturedGrants = async () => {
      try {
        // Check if we have cached data
        const cached = sessionStorage.getItem('featuredGrants');
        const cacheTime = sessionStorage.getItem('featuredGrantsTime');
        
        if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) { // 5 minutes cache
          setFeaturedGrants(JSON.parse(cached));
          setLoadingFeatured(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_BASE_URL}/grants?limit=3&status=Active`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 minutes cache
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const activeGrants = data.filter((g: any) => g.status === "Active").slice(0, 3);
        
        setFeaturedGrants(activeGrants);
        setLoadingFeatured(false);
        
        // Cache the results
        sessionStorage.setItem('featuredGrants', JSON.stringify(activeGrants));
        sessionStorage.setItem('featuredGrantsTime', Date.now().toString());
        
      } catch (error: any) {
        console.error('Error loading featured grants:', error);
        setErrorFeatured("Failed to load featured grants");
        setLoadingFeatured(false);
      }
    };

    loadFeaturedGrants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <PublicNavbar />

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

      {/* Hero Section with Search */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find and Secure Grants
            <span className="text-blue-600 block">For Your Research</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your comprehensive guide to successful grant funding. Search thousands of opportunities, get expert
            guidance, and connect with fellow researchers.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search grants by keyword, discipline, or funder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 h-12 text-lg"
                />
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                        <span className="ml-2">Searching...</span>
                      </div>
                    ) : (
                      searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center">
                            <Search className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{suggestion}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/application-help">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process helps you find, apply for, and secure grant funding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Search & Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Browse our comprehensive database of grants filtered by discipline, eligibility, deadline, and funding
                  amount. Set up alerts for new opportunities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Get Expert Help</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Access writing guides, templates, video tutorials, and connect with experienced researchers. Join our
                  community forums for support.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Secure Funding</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Submit strong applications with our tools and guidance. Track your applications and manage your funded
                  projects through our platform.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss these high-impact funding opportunities with upcoming deadlines
            </p>
          </div>

          {loadingFeatured && (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {errorFeatured && <div className="text-center py-8 text-red-600">{errorFeatured}</div>}
          {!loadingFeatured && !errorFeatured && (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredGrants.map((grant) => (
              <Card key={grant._id || grant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{grant.funder || grant.category}</span>
                      <span className="text-sm text-red-600 font-medium">Due: {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "-"}</span>
                  </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{grant.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                      {grant.funding ? `$${grant.funding.toLocaleString()}` : grant.amount || "-"} funding
                  </p>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{grant.category}</span>
                    <Link href="/search-grants" className="text-blue-600 text-sm font-medium hover:underline">
                      Learn More →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from researchers who secured funding using our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">SC</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dr. Sarah Chen</h4>
                      <p className="text-sm text-gray-600">Stanford University</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "The platform helped me find the perfect NSF grant for my AI research. The application templates and
                    community support were invaluable."
                  </p>
                  <div className="mt-3 text-sm text-blue-600 font-medium">$750K Secured</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">MR</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Prof. Michael Rodriguez</h4>
                      <p className="text-sm text-gray-600">MIT</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "The grant calendar feature ensured I never missed a deadline. I've secured three grants in the past
                    year using this platform."
                  </p>
                  <div className="mt-3 text-sm text-blue-600 font-medium">$1.2M Total</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">LZ</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dr. Lisa Zhang</h4>
                      <p className="text-sm text-gray-600">UC Berkeley</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "As an early-career researcher, the writing guides and peer feedback helped me craft winning
                    proposals. Highly recommended!"
                  </p>
                  <div className="mt-3 text-sm text-blue-600 font-medium">$300K Secured</div>
                </div>
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
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Grants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$2.5B+</div>
              <div className="text-gray-600">Total Funding</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Researchers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Grant?</h3>
          <p className="text-gray-600 mb-8">
            Join thousands of researchers who have successfully secured funding through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Searching Now
              </Button>
            </Link>
            <Link href="/application-help">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
              >
                Get Application Help
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
                Your comprehensive guide to successful grant funding and research excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Researchers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/search-grants" className="hover:text-white">
                    Search Grants
                  </Link>
                </li>
                <li>
                  <Link href="/application-help" className="hover:text-white">
                    Application Help
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources & Training
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community Forums
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              {/* <h4 className="font-semibold mb-4">Tools & Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/grant-calendar" className="hover:text-white">
                    Grant Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/researcher-profiles" className="hover:text-white">
                    Researcher Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/post-grant" className="hover:text-white">
                    Post a Grant
                  </Link>
                </li>
                <li>
                  <Link href="/newsletter" className="hover:text-white">
                    Newsletter
                  </Link>
                </li>
              </ul>
            </div>
            <div> */}
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/announcements" className="hover:text-white">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Innovation Grant Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
