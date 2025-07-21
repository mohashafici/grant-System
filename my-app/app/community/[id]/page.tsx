"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params?.id;
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!threadId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/community/${threadId}`)
      .then(res => res.json())
      .then(data => { setThread(data); setLoading(false); })
      .catch(() => { setError("Failed to load thread"); setLoading(false); });
    // Check for user (JWT in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {}
    }
  }, [threadId]);

  const handleReply = async e => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/community/${threadId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ author: user?.name || user?.email || "User", content: reply }),
    });
    if (res.ok) {
      toast({ title: "Reply posted" });
      setReply("");
      // Refresh thread
      fetch(`${API_BASE_URL}/community/${threadId}`)
        .then(res => res.json())
        .then(data => setThread(data));
    } else {
      toast({ title: "Failed to post reply", variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !thread) return <div className="p-8 text-center text-red-600">{error || "Thread not found."}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="outline" className="mb-6" onClick={() => router.back()}>&larr; Back to Community</Button>
        <div className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex gap-2 items-center mb-2">
            <Badge>{thread.domain}</Badge>
            <span className="text-xs text-gray-500">{thread.author}</span>
            <span className="text-xs text-gray-400 ml-2">{thread.replies?.length || 0} replies</span>
          </div>
          <div className="font-semibold text-2xl text-blue-700 mb-2">{thread.title}</div>
          <div className="text-gray-700 mb-4 whitespace-pre-line">{thread.content}</div>
          <div className="text-xs text-gray-400">Posted: {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : ""}</div>
        </div>
        <div className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Replies</h3>
          {thread.replies && thread.replies.length > 0 ? (
            <div className="space-y-4 mb-6">
              {thread.replies.map((r, i) => (
                <div key={i} className="border rounded p-3 bg-blue-50">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-xs text-blue-700 font-semibold">{r.author}</span>
                    <span className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">{r.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 mb-6">No replies yet.</div>
          )}
          {user ? (
            <form onSubmit={handleReply} className="space-y-2">
              <Input
                as="textarea"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Write your reply..."
                required
                className="w-full border rounded p-2 min-h-[60px]"
              />
              <Button type="submit" disabled={submitting || !reply.trim()}>{submitting ? "Posting..." : "Reply"}</Button>
            </form>
          ) : (
            <Button onClick={() => setShowLoginModal(true)} className="w-full">Reply</Button>
          )}
        </div>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full text-center">
              <h4 className="text-lg font-semibold mb-2">Posting requires login</h4>
              <p className="mb-4">Please sign in or register to participate.</p>
              <div className="flex gap-2 justify-center">
                <Link href={`/login?redirect=/community/${params?.id}`}>
                  <Button>Sign In</Button>
                </Link>
                <Link href={`/register?redirect=/community/${params?.id}`}>
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => setShowLoginModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 