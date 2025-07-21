"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";

const priorities = ["Low", "Medium", "High"];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    priority: "Low",
    tags: "",
    author: "",
    pinned: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/announcements`)
      .then(res => res.json())
      .then(data => { setAnnouncements(data); setLoading(false); })
      .catch(() => { setError("Failed to load announcements"); setLoading(false); });
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to add announcement");
      setForm({ title: "", excerpt: "", content: "", category: "", priority: "Low", tags: "", author: "", pinned: false });
      fetchAnnouncements();
    } catch (err) {
      setError("Failed to add announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this announcement?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast({ title: "Announcement deleted" });
      fetchAnnouncements();
    } else {
      toast({ title: "Failed to delete announcement", variant: "destructive" });
    }
  };

  const Layout = AdminLayout || (({ children }) => <div className="p-8">{children}</div>);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Announcements</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input name="category" value={form.category} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded h-10 px-2">
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input name="author" value={form.author} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <Input name="tags" value={form.tags} onChange={handleChange} />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Pinned</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <Input name="excerpt" value={form.excerpt} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} required className="w-full border rounded p-2 min-h-[100px]" />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Announcement"}</Button>
        </form>

        <h2 className="text-2xl font-semibold mb-4">All Announcements</h2>
        {loading && <div className="text-gray-500 py-8">Loading...</div>}
        {error && <div className="text-red-600 py-8">{error}</div>}
        <div className="space-y-4">
          {announcements.map(a => (
            <Card key={a._id || a.id} className="border hover:shadow">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex gap-2 mb-1 items-center">
                    <Badge>{a.category}</Badge>
                    {a.pinned && <span className="text-blue-600 text-xs font-bold ml-2">Pinned</span>}
                    <span className="text-xs text-gray-500 ml-2">{a.priority}</span>
                  </div>
                  <div className="font-semibold text-lg">{a.title}</div>
                  <div className="text-gray-600 text-sm mb-1">{a.excerpt}</div>
                  <div className="text-xs text-gray-400">By {a.author} | {a.date ? new Date(a.date).toLocaleDateString() : ""}</div>
                </div>
                <Button variant="destructive" size="sm" className="mt-2 md:mt-0" onClick={() => handleDelete(a._id || a.id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
} 