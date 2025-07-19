"use client";

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
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
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

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/resources")
      .then(res => res.json())
      .then(data => { setResources(data); setLoading(false); })
      .catch(err => { setError("Failed to load resources"); setLoading(false); });
  }, []);

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />
      <div className="container mx-auto py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources & Training</h1>
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 p-2 border rounded w-full max-w-md"
        />
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(resource => (
            <div key={resource._id} className="p-4 border rounded shadow bg-white">
              <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
              <p className="mb-2 text-gray-700">{resource.description}</p>
              {resource.link && (
                <a href={resource.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View Resource</a>
              )}
              <div className="mt-2 text-xs text-gray-500">
                {resource.type && <span className="mr-2">Type: {resource.type}</span>}
                {resource.category && <span className="mr-2">Category: {resource.category}</span>}
                {Array.isArray(resource.tags) && resource.tags.length > 0 && (
                  <span>Tags: {resource.tags.join(", ")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-12">No resources found.</div>
        )}
      </div>
    </div>
  );
}
