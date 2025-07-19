"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export default function ApplicationHelpPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <PublicNavbar />

      <div className="container mx-auto max-w-3xl mt-12">
        <Card className="shadow-lg p-2 md:p-6 bg-white/90">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-center">Application Help</CardTitle>
            <CardDescription className="text-lg text-gray-600 mb-6 text-center">
              Resources and expert advice to help you craft a successful grant application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Tips on writing proposals */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">Tips on Writing Proposals</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Read the grant guidelines carefully and address all requirements.</li>
                <li>Clearly state your research objectives and expected outcomes.</li>
                <li>Use concise, jargon-free language and avoid unnecessary complexity.</li>
                <li>Demonstrate the significance and impact of your project.</li>
                <li>Provide a realistic timeline and detailed methodology.</li>
                <li>Highlight your team’s expertise and relevant experience.</li>
                <li>Proofread your proposal and ask a colleague to review it.</li>
              </ul>
            </section>

            {/* Sample templates */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">Sample Templates</h2>
              <p className="mb-3 text-gray-600">Downloadable proposal templates (PDF/DOC)</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <span className="font-medium">Proposal Template (PDF)</span>
                  <Button asChild variant="outline">
                    <a href="/templates/Proposal_Template.pdf" download>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <span className="font-medium">Proposal Template (DOC)</span>
                  <Button asChild variant="outline">
                    <a href="/templates/Proposal_Template.docx" download>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            </section>

            {/* Common mistakes to avoid */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">Common Mistakes to Avoid</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Missing or incomplete sections in the proposal.</li>
                <li>Unclear objectives or lack of measurable outcomes.</li>
                <li>Overly ambitious or unrealistic project plans.</li>
                <li>Ignoring budget guidelines or providing vague justifications.</li>
                <li>Failure to demonstrate project impact or relevance.</li>
                <li>Submitting without proofreading for errors or typos.</li>
              </ul>
            </section>

            {/* Budget plan example */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">Budget Plan Example</h2>
              <p className="mb-3 text-gray-600">How to structure your budget section</p>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">Description</th>
                      <th className="px-4 py-2 border">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Personnel</td>
                      <td className="border px-4 py-2">Research assistant (12 months)</td>
                      <td className="border px-4 py-2">$36,000</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Equipment</td>
                      <td className="border px-4 py-2">Lab equipment and software</td>
                      <td className="border px-4 py-2">$10,000</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Materials & Supplies</td>
                      <td className="border px-4 py-2">Consumables, chemicals</td>
                      <td className="border px-4 py-2">$4,000</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Travel</td>
                      <td className="border px-4 py-2">Conference attendance</td>
                      <td className="border px-4 py-2">$2,500</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Other</td>
                      <td className="border px-4 py-2">Publication fees</td>
                      <td className="border px-4 py-2">$1,500</td>
                    </tr>
                    <tr className="font-bold bg-blue-50">
                      <td className="border px-4 py-2">Total</td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2">$54,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 