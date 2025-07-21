"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    link: "",
    category: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchResources = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/resources`)
      .then(res => res.json())
      .then(data => { setResources(data); setLoading(false); })
      .catch(err => { setError("Failed to load resources"); setLoading(false); });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/resources`, {
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
      if (!res.ok) throw new Error("Failed to add resource");
      setForm({ title: "", description: "", type: "", link: "", category: "", tags: "" });
      fetchResources();
    } catch (err) {
      setError("Failed to add resource");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this resource?")) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete resource");
      fetchResources();
    } catch (err) {
      setError("Failed to delete resource");
    }
  };

  return (
    <AdminLayout active="resources">
      <div className="container mx-auto py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin: Manage Resources</h1>
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded bg-white shadow space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input className="p-2 border rounded" placeholder="Title" value={form.title} onChange={e => handleChange("title", e.target.value)} required />
            <input className="p-2 border rounded" placeholder="Type (guide, video, tool, etc)" value={form.type} onChange={e => handleChange("type", e.target.value)} />
            <input className="p-2 border rounded" placeholder="Category" value={form.category} onChange={e => handleChange("category", e.target.value)} />
            <input className="p-2 border rounded" placeholder="Link (URL)" value={form.link} onChange={e => handleChange("link", e.target.value)} />
          </div>
          <textarea className="p-2 border rounded w-full" placeholder="Description" value={form.description} onChange={e => handleChange("description", e.target.value)} />
          <input className="p-2 border rounded w-full" placeholder="Tags (comma separated)" value={form.tags} onChange={e => handleChange("tags", e.target.value)} />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>{submitting ? "Adding..." : "Add Resource"}</Button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
        <h2 className="text-xl font-bold mb-4">All Resources</h2>
        {loading && <div>Loading...</div>}
        <div className="space-y-4">
          {resources.map(resource => (
            <div key={resource._id} className="p-4 border rounded bg-white flex justify-between items-center">
              <div>
                <div className="font-bold">{resource.title}</div>
                <div className="text-xs text-gray-500 mb-1">{resource.type} | {resource.category}</div>
                <div className="text-gray-700 mb-1">{resource.description}</div>
                {resource.link && <a href={resource.link} className="text-blue-600 underline text-xs" target="_blank" rel="noopener noreferrer">View</a>}
                {Array.isArray(resource.tags) && resource.tags.length > 0 && (
                  <div className="text-xs text-gray-400 mt-1">Tags: {resource.tags.join(", ")}</div>
                )}
              </div>
              <Button variant="outline" className="text-red-600 border-red-200" onClick={() => handleDelete(resource._id)}>Delete</Button>
            </div>
          ))}
        </div>
        {resources.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-12">No resources found.</div>
        )}
      </div>
    </AdminLayout>
  );
} 