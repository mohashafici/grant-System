"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
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
        // Pre-fill reply form with user data if logged in
        setReplyAuthor(payload.name || payload.email || "");
        setReplyEmail(payload.email || "");
      } catch {}
    }
  }, [threadId]);

  const handleReply = async e => {
    e.preventDefault();
    
    // Validate required fields
    if (!reply.trim() || !replyAuthor.trim() || !replyEmail.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    
    const replyData = {
      author: replyAuthor,
      authorEmail: replyEmail,
      content: reply,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization if user is logged in
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/community/${threadId}/reply`, {
      method: "POST",
      headers,
      body: JSON.stringify(replyData),
    });
    
    if (res.ok) {
      toast({ title: "Reply posted successfully!" });
      setReply("");
      if (!user) {
        setReplyAuthor("");
        setReplyEmail("");
      }
      setShowReplyForm(false);
      // Refresh thread
      fetch(`${API_BASE_URL}/community/${threadId}`)
        .then(res => res.json())
        .then(data => setThread(data));
    } else {
      const errorData = await res.json();
      toast({ title: "Failed to post reply", description: errorData.message || "Please try again", variant: "destructive" });
    }
    setSubmitting(false);
  };

  // Simple text formatting function
  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !thread) return <div className="p-8 text-center text-red-600">{error || "Thread not found."}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="outline" className="mb-6" onClick={() => router.back()}>&larr; Back to Community</Button>
        
        {/* Thread Content */}
        <div className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex gap-2 items-center mb-3">
            <Badge className="bg-blue-100 text-blue-800">{thread.domain}</Badge>
            <span className="text-sm text-gray-600 font-medium">{thread.author}</span>
            <span className="text-sm text-gray-400 ml-2">{thread.replies?.length || 0} replies</span>
          </div>
          <h1 className="font-bold text-2xl text-gray-900 mb-4">{thread.title}</h1>
          <div 
            className="text-gray-700 mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatText(thread.content) }}
          />
          <div className="text-sm text-gray-400 border-t pt-3">
            Posted: {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : ""}
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Replies ({thread.replies?.length || 0})</h3>
            <Button 
              onClick={() => setShowReplyForm(!showReplyForm)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showReplyForm ? "Cancel Reply" : "Add Reply"}
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReply} className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="replyAuthor" className="text-sm font-medium text-gray-700">Your Name *</Label>
                  <Input 
                    id="replyAuthor"
                    value={replyAuthor} 
                    onChange={(e) => setReplyAuthor(e.target.value)} 
                    placeholder="Enter your name" 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="replyEmail" className="text-sm font-medium text-gray-700">Your Email *</Label>
                  <Input 
                    id="replyEmail"
                    type="email"
                    value={replyEmail} 
                    onChange={(e) => setReplyEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    required 
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="replyContent" className="text-sm font-medium text-gray-700">Your Reply *</Label>
                <RichTextEditor
                  value={reply}
                  onChange={setReply}
                  placeholder="Share your thoughts, answer, or add to the discussion. Use the toolbar above for formatting."
                  className="mt-1"
                  minHeight="100px"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your text with bold, italic, quotes, and lists
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
              </div>
              
              {!user && (
                <p className="text-xs text-gray-500 mt-3">
                  💡 <Link href="/register" className="text-blue-600 hover:underline">Register</Link> to save your info and get notifications
                </p>
              )}
            </form>
          )}

          {/* Replies List */}
          {thread.replies && thread.replies.length > 0 ? (
            <div className="space-y-4">
              {thread.replies.map((r, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-sm font-semibold text-blue-700">{r.author}</span>
                    <span className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</span>
                  </div>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(r.content) }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No replies yet</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 