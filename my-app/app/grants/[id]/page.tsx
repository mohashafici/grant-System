"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import PublicNavbar from "@/components/public-navbar"
import { ArrowLeft, Calendar, DollarSign, Building, Mail, Phone, FileText, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function GrantDetailsPage() {
  const params = useParams()
  const grantId = params.id as string
  const [grant, setGrant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchGrant = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/grants/${grantId}`)
        if (res.ok) {
          const grantData = await res.json()
          setGrant(grantData)
        } else {
          toast({
            title: "Error",
            description: "Failed to load grant details",
            variant: "destructive",
            duration: 4000
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load grant details",
          variant: "destructive",
          duration: 4000
        })
      } finally {
        setLoading(false)
      }
    }

    if (grantId) {
      fetchGrant()
    }
  }, [grantId, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800"
      case "Healthcare":
        return "bg-green-100 text-green-800"
      case "Education":
        return "bg-purple-100 text-purple-800"
      case "Environment":
        return "bg-emerald-100 text-emerald-800"
      case "Social Sciences":
        return "bg-orange-100 text-orange-800"
      case "Arts & Humanities":
        return "bg-pink-100 text-pink-800"
      case "Business":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading grant details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!grant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Grant Not Found</h1>
            <p className="text-gray-600 mb-6">The grant you're looking for doesn't exist or has been removed.</p>
            <Link href="/search-grants">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Other Grants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/search-grants">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grants
            </Button>
          </Link>
        </div>

        {/* Grant Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={getCategoryColor(grant.category)}>
              {grant.category}
            </Badge>
            <Badge className={getStatusColor(grant.status)}>
              {grant.status}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {grant.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {grant.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grant Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Grant Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{grant.description}</p>
                </div>
                
                {grant.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">{grant.requirements}</p>
                  </div>
                )}
                
                {grant.eligibility && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Eligibility Criteria</h3>
                    <p className="text-gray-700 leading-relaxed">{grant.eligibility}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Funding Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ${grant.funding?.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Application Deadline</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(grant.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {grant.institution && (
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Institution</p>
                      <p className="font-semibold text-gray-900">{grant.institution}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(grant.contactEmail || grant.contactPhone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {grant.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-3" />
                      <a 
                        href={`mailto:${grant.contactEmail}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {grant.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {grant.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-3" />
                      <a 
                        href={`tel:${grant.contactPhone}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {grant.contactPhone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            <Card>
              <CardContent className="pt-6">
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Apply for This Grant
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You need to be registered to apply for grants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 