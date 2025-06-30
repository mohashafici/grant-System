'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ResearcherLayout from "@/components/layouts/ResearcherLayout";

function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\\s+\\S*$/, '') + "...";
}

export default function ResearcherGrantsPage() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrants = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/grants");
        const data = await res.json();
        setGrants(data);
      } catch {
        setGrants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  return (
    <ResearcherLayout active="grants">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Available Grants</h1>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading grants...</div>
        ) : grants.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No grants available at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grants.map((grant) => (
              <Card key={grant._id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{grant.title}</CardTitle>
                    <Badge className="ml-2">{grant.category}</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {truncateText(
                      grant.description?.split('\\n')[0] || grant.description || "",
                      140
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Deadline:</span>{" "}
                      {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Funding:</span>{" "}
                      <span className="text-blue-700 font-semibold">${grant.funding?.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-auto">
                    <Link href={`/researcher/submit?grantId=${grant._id}`}>
                      Apply
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResearcherLayout>
  );
}