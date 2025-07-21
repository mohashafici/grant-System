"use client";
import { useState, useEffect } from "react";
import { BookOpen, Menu, X, Search, Filter, Bell, Award, Users, TrendingUp, Calendar, Clock, Pin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

// Type for announcements
interface Announcement {
  id: number;
  category: string;
  priority: string;
  date: Date;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  readTime: string;
  views: number;
  pinned: boolean;
}

// Stubs for missing functions
function getPriorityColor(priority: string): string { return ""; }
function getPriorityIcon(priority: string): any { return null; }

export default function AnnouncementsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/announcements`)
      .then(res => res.json())
      .then(data => {
        // Convert date strings to Date objects if needed
        setAnnouncements(data.map((a: any) => ({ ...a, date: new Date(a.date) })));
        setLoading(false);
      })
      .catch(() => { setError("Failed to load announcements"); setLoading(false); });
  }, []);

  // Dynamically generate categories from announcements
  const categories = Array.from(
    new Set(announcements.map(a => a.category))
  ).map(cat => ({
    name: cat,
    count: announcements.filter(a => a.category === cat).length,
    color: "" // Optionally assign a color
  }));

  // Filtered announcements
  const filteredAnnouncements = announcements.filter(a => {
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
    const matchesSearch = search.trim() ? (
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
    ) : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest Announcements
            <span className="text-blue-600 block">Stay Updated</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get the latest news about funding opportunities, platform updates, training programs, and success stories
            from our research community.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search announcements..."
                  className="pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" className="md:w-auto w-full bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant="outline"
              className={`cursor-pointer hover:shadow-sm border-0 ${selectedCategory === null ? 'bg-blue-100 text-blue-700' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All ({announcements.length})
            </Badge>
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer hover:shadow-sm ${category.color} border-0 ${selectedCategory === category.name ? 'bg-blue-100 text-blue-700' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">This Month</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Funding Opportunities</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-600">Training Events</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {loading && <div className="text-center py-8 text-gray-500">Loading announcements...</div>}
          {error && <div className="text-center py-8 text-red-600">{error}</div>}
          {!loading && !error && filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-gray-500">No announcements found.</div>
          )}
          {filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement._id || announcement.id}
              className={`hover:shadow-lg transition-shadow ${getPriorityColor(announcement.priority)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {announcement.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                      {getPriorityIcon(announcement.priority)}
                      <Badge variant="outline">{announcement.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {announcement.date instanceof Date ? announcement.date.toLocaleDateString() : new Date(announcement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 mb-4">{announcement.excerpt}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {announcement.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>By {announcement.author}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {announcement.readTime}
                    </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Announcements
          </Button>
        </div>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-blue-100" />
              <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Subscribe to our newsletter to receive the latest announcements, funding opportunities, and research
                updates directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email" className="bg-white text-gray-900" />
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
              <p className="text-blue-200 text-sm mt-4">Weekly digest • No spam • Unsubscribe anytime</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
