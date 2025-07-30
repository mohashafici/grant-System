"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import PublicNavbar from "@/components/public-navbar";

const domains = [
  "Life Sciences",
  "Engineering",
  "Social Sciences",
  "Medicine",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Mathematics",
];

export default function CommunityPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    domain: domains[0],
    content: "",
    authorName: "",
    authorEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/community`)
      .then(res => res.json())
      .then(data => { setThreads(data); setLoading(false); })
      .catch(() => { setError("Failed to load threads"); setLoading(false); });
    // Check for user (JWT in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
        // Pre-fill form with user data if logged in
        setForm(f => ({
          ...f,
          authorName: payload.name || payload.email || "",
          authorEmail: payload.email || "",
        }));
      } catch {}
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title.trim() || !form.content.trim() || !form.authorName.trim() || !form.authorEmail.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    
    const threadData = {
      title: form.title,
      domain: form.domain,
      content: form.content,
      author: form.authorName,
      authorEmail: form.authorEmail,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization if user is logged in
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/community`, {
      method: "POST",
      headers,
      body: JSON.stringify(threadData),
    });
    
    if (res.ok) {
      toast({ title: "Thread created successfully!" });
      setForm({ title: "", domain: domains[0], content: "", authorName: "", authorEmail: "" });
      setShowForm(false);
      // Refresh threads
      setLoading(true);
      fetch(`${API_BASE_URL}/community`)
        .then(res => res.json())
        .then(data => { setThreads(data); setLoading(false); });
    } else {
      const errorData = await res.json();
      toast({ title: "Failed to create thread", description: errorData.message || "Please try again", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Community & Forums
            <span className="text-blue-600 block text-2xl mt-2">Ask questions, get feedback, and connect with fellow researchers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join discussions by research domain, share your experiences, and support first-time applicants.
          </p>
        </div>
        <div className="mb-10 text-center">
          <div className="inline-flex flex-wrap gap-3 justify-center">
            {domains.map(domain => (
              <Badge key={domain} variant="outline" className="px-4 py-2 text-blue-700 border-blue-200">
                {domain}
              </Badge>
            ))}
          </div>
        </div>
        <div className="max-w-2xl mx-auto bg-white border border-blue-100 rounded-lg p-6 text-center shadow-sm mb-10">
          <h4 className="text-xl font-semibold text-blue-700 mb-2">Support for First-Time Applicants</h4>
          <p className="text-gray-600 mb-2">New to grant writing? Get advice from experienced researchers and grant officers. Post your questions and receive community feedback to help you succeed.</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-lg p-8 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Forum Threads</h2>
            <Button onClick={() => setShowForm(f => !f)} className="bg-blue-600 hover:bg-blue-700">
              {showForm ? "Cancel" : "Start a New Thread"}
            </Button>
          </div>
          
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-6 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authorName" className="text-sm font-medium text-gray-700">Your Name *</Label>
                  <Input 
                    id="authorName"
                    name="authorName" 
                    value={form.authorName} 
                    onChange={handleChange} 
                    placeholder="Enter your name" 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="authorEmail" className="text-sm font-medium text-gray-700">Your Email *</Label>
                  <Input 
                    id="authorEmail"
                    name="authorEmail" 
                    type="email"
                    value={form.authorEmail} 
                    onChange={handleChange} 
                    placeholder="Enter your email" 
                    required 
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Thread Title *</Label>
                <Input 
                  id="title"
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="What's your question or topic?" 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain" className="text-sm font-medium text-gray-700">Research Domain</Label>
                  <select 
                    id="domain"
                    name="domain" 
                    value={form.domain} 
                    onChange={handleChange} 
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {domains.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  {!user && (
                    <p className="text-xs text-gray-500">
                      💡 <Link href="/register" className="text-blue-600 hover:underline">Register</Link> to save your info and get notifications
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="content" className="text-sm font-medium text-gray-700">Your Question or Discussion *</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(value) => setForm(f => ({ ...f, content: value }))}
                  placeholder="Share your question, experience, or start a discussion. Use the toolbar above for formatting."
                  className="mt-1"
                  minHeight="120px"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your text with bold, italic, quotes, and lists
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? "Posting..." : "Post Thread"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {loading && <div className="text-gray-500 py-8">Loading threads...</div>}
          {error && <div className="text-red-600 py-8">{error}</div>}
          {!loading && threads.length === 0 && <div className="text-gray-500 py-8">No threads yet.</div>}
          <div className="space-y-4">
            {threads.map(thread => (
              <Link key={thread._id} href={`/community/${thread._id}`} className="block">
                <div className="border rounded-lg p-4 hover:shadow transition bg-white">
                  <div className="flex gap-2 items-center mb-1">
                    <Badge>{thread.domain}</Badge>
                    <span className="text-xs text-gray-500">{thread.author}</span>
                    <span className="text-xs text-gray-400 ml-2">{thread.replies?.length || 0} replies</span>
                  </div>
                  <div className="font-semibold text-lg text-blue-700">{thread.title}</div>
                  <div className="text-gray-600 text-sm mt-1 line-clamp-2">{thread.content}</div>
                  <div className="text-xs text-gray-400 mt-1">Last updated: {thread.updatedAt ? new Date(thread.updatedAt).toLocaleString() : ""}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 