// 'use client'

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Home,
//   FileText,
//   Plus,
//   Bell,
//   User,
//   Award,
//   Search,
//   Filter,
//   Calendar,
//   DollarSign,
//   Users,
//   ArrowRight,
//   Clock,
// } from "lucide-react"

// export default function GrantsPage() {
//   const [grants, setGrants] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [fundingFilter, setFundingFilter] = useState("all")

//   useEffect(() => {
//     const fetchGrants = async () => {
//       setLoading(true)
//       setError("")
//       try {
//         const res = await fetch("http://localhost:5000/api/grants")
//         if (!res.ok) throw new Error("Failed to fetch grants")
//         const data = await res.json()
//         setGrants(data)
//       } catch (err) {
//         setError(err.message || "Error fetching grants")
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchGrants()
//   }, [])

//   const filteredGrants = grants.filter((grant) => {
//     const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       grant.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = categoryFilter === "all" || grant.category === categoryFilter
//     const matchesFunding = fundingFilter === "all" ||
//       (fundingFilter === "small" && grant.funding < 50000) ||
//       (fundingFilter === "medium" && grant.funding >= 50000 && grant.funding < 200000) ||
//       (fundingFilter === "large" && grant.funding >= 200000)
//     return matchesSearch && matchesCategory && matchesFunding
//   })

//   const getFundingRange = (amount) => {
//     if (amount < 50000) return "Small (< $50K)"
//     if (amount < 200000) return "Medium ($50K - $200K)"
//     return "Large (> $200K)"
//   }

//   const getDaysUntilDeadline = (deadline) => {
//     const deadlineDate = new Date(deadline)
//     const today = new Date()
//     const diffTime = deadlineDate.getTime() - today.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const getDeadlineStatus = (deadline) => {
//     const daysLeft = getDaysUntilDeadline(deadline)
//     if (daysLeft < 0) return { status: "Closed", color: "bg-red-100 text-red-800" }
//     if (daysLeft <= 7) return { status: "Urgent", color: "bg-orange-100 text-orange-800" }
//     if (daysLeft <= 30) return { status: "Soon", color: "bg-yellow-100 text-yellow-800" }
//     return { status: "Open", color: "bg-green-100 text-green-800" }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Browse Grants</h1>
//             <p className="text-gray-600">Discover and apply for research funding opportunities</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button asChild variant="outline">
//               <Link href="/dashboard/researcher">
//                 <Home className="w-4 h-4 mr-2" />
//                 Dashboard
//               </Link>
//             </Button>
//             <Button asChild className="bg-blue-600 hover:bg-blue-700">
//               <Link href="/dashboard/researcher/submit">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Submit Proposal
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="bg-white border-b px-6 py-2">
//         <nav className="flex items-center space-x-2 text-sm text-gray-600">
//           <Link href="/dashboard/researcher" className="hover:text-blue-600">Dashboard</Link>
//           <span>/</span>
//           <span className="text-gray-900">Browse Grants</span>
//         </nav>
//       </div>

//       <main className="p-6">
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search grants by title or description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger className="w-[180px]">
//               <Filter className="w-4 h-4 mr-2" />
//               <SelectValue placeholder="Filter by category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               <SelectItem value="Technology">Technology & Innovation</SelectItem>
//               <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
//               <SelectItem value="Environment">Environment & Sustainability</SelectItem>
//               <SelectItem value="Social Sciences">Social Sciences</SelectItem>
//               <SelectItem value="Education">Education</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={fundingFilter} onValueChange={setFundingFilter}>
//             <SelectTrigger className="w-[180px]">
//               <DollarSign className="w-4 h-4 mr-2" />
//               <SelectValue placeholder="Filter by funding" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Funding Levels</SelectItem>
//               <SelectItem value="small">Small (< $50K)</SelectItem>
//               <SelectItem value="medium">Medium ($50K - $200K)</SelectItem>
//               <SelectItem value="large">Large (> $200K)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {loading ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-2 text-gray-600">Loading grants...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-8 text-red-600">{error}</div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredGrants.length === 0 ? (
//               <div className="text-center py-12">
//                 <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
//                 <p className="text-gray-500 mb-4">
//                   {searchTerm || categoryFilter !== "all" || fundingFilter !== "all"
//                     ? "Try adjusting your search or filter criteria."
//                     : "No grants are currently available."}
//                 </p>
//               </div>
//             ) : (
//               filteredGrants.map((grant) => {
//                 const deadlineStatus = getDeadlineStatus(grant.deadline)
//                 const daysLeft = getDaysUntilDeadline(grant.deadline)
                
//                 return (
//                   <Card key={grant._id} className="hover:shadow-md transition-shadow">
//                     <CardHeader>
//                       <div className="flex items-start justify-between">
//                         <div className="space-y-1 flex-1">
//                           <CardTitle className="text-xl">{grant.title}</CardTitle>
//                           <CardDescription className="text-base">
//                             {grant.description.length > 150 
//                               ? grant.description.substring(0, 150) + "..." 
//                               : grant.description}
//                           </CardDescription>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Badge className={deadlineStatus.color}>
//                             <Clock className="w-3 h-3 mr-1" />
//                             {deadlineStatus.status}
//                           </Badge>
//                           <Badge variant="outline">{grant.category}</Badge>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <DollarSign className="w-4 h-4 text-green-600" />
//                           <div>
//                             <p className="text-sm text-gray-600">Funding Available</p>
//                             <p className="font-semibold text-green-600">${grant.funding.toLocaleString()}</p>
//                             <p className="text-xs text-gray-500">{getFundingRange(grant.funding)}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-blue-600" />
//                           <div>
//                             <p className="text-sm text-gray-600">Application Deadline</p>
//                             <p className="font-semibold">{new Date(grant.deadline).toLocaleDateString()}</p>
//                             <p className="text-xs text-gray-500">
//                               {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Users className="w-4 h-4 text-purple-600" />
//                           <div>
//                             <p className="text-sm text-gray-600">Applications</p>
//                             <p className="font-semibold">{grant.applicants || 0} submitted</p>
//                             <p className="text-xs text-gray-500">{grant.approved || 0} approved</p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <div className="text-sm text-gray-600">
//                           <p><strong>Requirements:</strong> {grant.requirements}</p>
//                         </div>
//                         <Button 
//                           asChild 
//                           className="bg-blue-600 hover:bg-blue-700"
//                           disabled={daysLeft < 0}
//                         >
//                           <Link href={`/dashboard/researcher/submit?grant=${grant._id}`}>
//                             {daysLeft < 0 ? "Closed" : "Apply Now"}
//                             <ArrowRight className="w-4 h-4 ml-2" />
//                           </Link>
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }
'use client'

export default function GrantsPage() {
  return (
    <div>
      <h1>Hello, this is a test.</h1>
    </div>
  );
}