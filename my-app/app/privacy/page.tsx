"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Users, Database, Globe, Mail, Phone } from "lucide-react"
import PublicNavbar from "@/components/public-navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our grant management platform.
          </p>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            
            {/* Information We Collect */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Professional credentials and institutional affiliations</li>
                    <li>Research interests and areas of expertise</li>
                    <li>Profile information and preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Grant searches and application history</li>
                    <li>Platform interactions and feature usage</li>
                    <li>Communication preferences and settings</li>
                    <li>Technical data (IP address, browser type, device information)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content You Provide</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Grant proposals and applications</li>
                    <li>Research reports and documentation</li>
                    <li>Community forum posts and comments</li>
                    <li>Feedback and support requests</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Platform Services</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Provide grant search and matching services</li>
                    <li>Facilitate proposal submission and review processes</li>
                    <li>Enable community interactions and networking</li>
                    <li>Deliver personalized content and recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Send important updates about your applications</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Share relevant grant opportunities and announcements</li>
                    <li>Send newsletters and educational content (with consent)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Platform Improvement</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Analyze usage patterns to improve our services</li>
                    <li>Develop new features and functionality</li>
                    <li>Ensure platform security and performance</li>
                    <li>Conduct research and analytics (anonymized)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">We Do Not Sell Your Data</h4>
                  <p className="text-gray-600">
                    We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Limited Sharing</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li><strong>Grant Funders:</strong> Application information shared only with relevant funding organizations</li>
                    <li><strong>Reviewers:</strong> Proposal content shared with assigned reviewers (anonymized when possible)</li>
                    <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Features</h4>
                  <p className="text-gray-600">
                    Information you share in community forums and public profiles may be visible to other users. 
                    You control what information you choose to share publicly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                  Data Security and Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication protocols</li>
                    <li>Secure data centers with physical and digital safeguards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Retention</h4>
                  <p className="text-gray-600">
                    We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                    You can request deletion of your account and associated data at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Incident Response</h4>
                  <p className="text-gray-600">
                    In the unlikely event of a data breach, we will notify affected users promptly and take appropriate 
                    measures to mitigate any potential harm.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Access and Control</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li><strong>Access:</strong> View and download your personal information</li>
                    <li><strong>Update:</strong> Modify your profile and preferences</li>
                    <li><strong>Delete:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Export your data in a standard format</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication Preferences</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Opt out of marketing communications</li>
                    <li>Control notification settings</li>
                    <li>Manage email preferences</li>
                    <li>Unsubscribe from newsletters</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies and Tracking</h4>
                  <p className="text-gray-600">
                    You can control cookie settings through your browser preferences. We use cookies to improve 
                    your experience and provide essential platform functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* International Data Transfers */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our platform serves researchers globally. Your information may be transferred to and processed 
                  in countries other than your own. We ensure appropriate safeguards are in place to protect 
                  your data in accordance with applicable privacy laws and regulations.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our platform is designed for researchers and professionals. We do not knowingly collect 
                  personal information from children under 13 years of age. If you believe we have collected 
                  such information, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Changes to This Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time to reflect changes in our practices 
                  or applicable laws. We will notify you of any material changes by posting the updated 
                  policy on our platform and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">privacy@innovationgrantportal.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Innovation Grant Portal</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your comprehensive guide to successful grant funding and research excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Researchers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/search-grants" className="hover:text-white">
                    Search Grants
                  </Link>
                </li>
                <li>
                  <Link href="/application-help" className="hover:text-white">
                    Application Help
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources & Training
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community Forums
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/announcements" className="hover:text-white">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Innovation Grant Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 