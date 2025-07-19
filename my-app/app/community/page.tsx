"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/community")
      .then(res => res.json())
      .then(data => { setThreads(data); setLoading(false); })
      .catch(() => { setError("Failed to load threads"); setLoading(false); });
    // Check for user (JWT in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {}
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/community", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, author: user?.name || user?.email || "User" }),
    });
    if (res.ok) {
      toast({ title: "Thread created" });
      setForm({ title: "", domain: domains[0], content: "" });
      setShowForm(false);
      // Refresh threads
      setLoading(true);
      fetch("http://localhost:5000/api/community")
        .then(res => res.json())
        .then(data => { setThreads(data); setLoading(false); });
    } else {
      toast({ title: "Failed to create thread", variant: "destructive" });
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
            {user ? (
              <Button onClick={() => setShowForm(f => !f)}>{showForm ? "Cancel" : "Start a New Thread"}</Button>
            ) : (
              <Link href="/login?redirect=/community">
                <Button>Start a New Thread</Button>
              </Link>
            )}
          </div>
          {showForm && user && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
              <div className="flex gap-2">
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Thread title" required />
                <select name="domain" value={form.domain} onChange={handleChange} className="border rounded px-2">
                  {domains.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <textarea name="content" value={form.content} onChange={handleChange} required placeholder="What do you want to ask or share?" className="w-full border rounded p-2 min-h-[80px]" />
              <Button type="submit" disabled={submitting}>{submitting ? "Posting..." : "Post Thread"}</Button>
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