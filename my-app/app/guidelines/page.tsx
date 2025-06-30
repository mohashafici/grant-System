import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function GuidelinesPage() {
  const eligibilityCriteria = [
    "Principal Investigator must hold a PhD or equivalent degree",
    "Affiliation with an accredited research institution",
    "No more than 3 active grants per investigator",
    "Project must align with our funding priorities",
    "Compliance with ethical research standards",
    "Budget justification must be detailed and realistic",
  ]

  const fundingCategories = [
    {
      name: "Artificial Intelligence & Machine Learning",
      budget: "$50,000 - $300,000",
      duration: "1-3 years",
      description: "Research in AI, ML, deep learning, and related technologies",
    },
    {
      name: "Climate & Environmental Science",
      budget: "$75,000 - $400,000",
      duration: "2-4 years",
      description: "Climate modeling, environmental monitoring, and sustainability research",
    },
    {
      name: "Biotechnology & Life Sciences",
      budget: "$100,000 - $500,000",
      duration: "2-5 years",
      description: "Medical research, drug discovery, and biotechnology innovations",
    },
    {
      name: "Quantum Computing",
      budget: "$80,000 - $350,000",
      duration: "1-3 years",
      description: "Quantum algorithms, hardware, and applications",
    },
    {
      name: "Materials Science",
      budget: "$60,000 - $250,000",
      duration: "1-3 years",
      description: "Advanced materials, nanotechnology, and engineering applications",
    },
    {
      name: "Energy & Sustainability",
      budget: "$90,000 - $450,000",
      duration: "2-4 years",
      description: "Renewable energy, energy storage, and sustainable technologies",
    },
  ]

  const evaluationCriteria = [
    {
      criterion: "Scientific Merit",
      weight: "30%",
      description: "Novelty, significance, and potential impact of the research",
    },
    {
      criterion: "Technical Approach",
      weight: "25%",
      description: "Soundness and feasibility of the proposed methodology",
    },
    {
      criterion: "Investigator Qualifications",
      weight: "20%",
      description: "Experience and track record of the research team",
    },
    {
      criterion: "Budget & Resources",
      weight: "15%",
      description: "Appropriateness and justification of requested funding",
    },
    {
      criterion: "Timeline & Milestones",
      weight: "10%",
      description: "Realistic project timeline and clear deliverables",
    },
  ]

  const timeline = [
    { phase: "Application Submission", duration: "Ongoing", description: "Submit your complete application" },
    { phase: "Initial Review", duration: "2 weeks", description: "Administrative review for completeness" },
    { phase: "Peer Review", duration: "4-6 weeks", description: "Expert evaluation by field specialists" },
    { phase: "Panel Discussion", duration: "1 week", description: "Reviewer panel meeting and scoring" },
    { phase: "Final Decision", duration: "1 week", description: "Funding decision and notification" },
    { phase: "Award Setup", duration: "2-3 weeks", description: "Contract execution and fund disbursement" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Application Guidelines</h1>
              <p className="text-sm text-gray-600">Complete guide for grant applications</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grant Application
            <span className="text-blue-600 block">Guidelines</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Everything you need to know to submit a successful grant application. Follow these comprehensive guidelines
            to maximize your chances of funding approval.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Guidelines
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Program Overview
                </CardTitle>
                <CardDescription>Understanding our grant program and funding philosophy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  The Innovation Grant Portal supports groundbreaking research across multiple disciplines, with a focus
                  on projects that have the potential to create significant scientific, technological, or societal
                  impact. Our funding program is designed to be accessible, transparent, and efficient.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Funding Range</h3>
                    <p className="text-gray-600">$50,000 - $500,000</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Project Duration</h3>
                    <p className="text-gray-600">1 - 5 years</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Review Process</h3>
                    <p className="text-gray-600">Peer review by experts</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Important Note</h4>
                      <p className="text-yellow-700 text-sm">
                        Applications are reviewed on a rolling basis. We recommend submitting your application at least
                        8 weeks before your desired project start date.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Eligibility Requirements
                </CardTitle>
                <CardDescription>Criteria that applicants must meet to be considered for funding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eligibilityCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{criterion}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Additional Considerations</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• International collaborations are encouraged</li>
                    <li>• Interdisciplinary research projects are welcome</li>
                    <li>• Early-career researchers are strongly encouraged to apply</li>
                    <li>• Projects must comply with institutional IRB/IACUC requirements</li>
                    <li>• Open science and data sharing practices are preferred</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  Funding Categories
                </CardTitle>
                <CardDescription>Research areas and funding levels for different disciplines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {fundingCategories.map((category, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                        <div className="flex space-x-2 mt-2 md:mt-0">
                          <Badge variant="outline">{category.budget}</Badge>
                          <Badge variant="outline">{category.duration}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Application Requirements
                </CardTitle>
                <CardDescription>Complete list of required documents and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Documents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Project Information</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Project title and abstract (500 words max)</li>
                        <li>• Research objectives and significance</li>
                        <li>• Detailed methodology and approach</li>
                        <li>• Timeline with milestones</li>
                        <li>• Expected outcomes and impact</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Supporting Materials</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Principal Investigator CV (5 pages max)</li>
                        <li>• Co-investigator CVs (2 pages each)</li>
                        <li>• Detailed budget and justification</li>
                        <li>• Institutional support letter</li>
                        <li>• Ethics approval (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Pro Tip</h4>
                      <p className="text-green-700 text-sm">
                        Use our online application form to ensure all required fields are completed. The system will
                        automatically check for missing information before submission.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Budget Guidelines</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Personnel (salaries, benefits)</span>
                      <span className="text-gray-600">Up to 60%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Equipment and supplies</span>
                      <span className="text-gray-600">Up to 25%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Travel and conferences</span>
                      <span className="text-gray-600">Up to 10%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Indirect costs</span>
                      <span className="text-gray-600">Up to 15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  Evaluation Criteria
                </CardTitle>
                <CardDescription>How applications are reviewed and scored by our expert panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {evaluationCriteria.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.criterion}</h3>
                        <Badge className="bg-blue-100 text-blue-800">{item.weight}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Scoring Scale</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">9-10: Exceptional</span>
                      <span className="text-gray-600">Outstanding in all aspects</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">7-8: Excellent</span>
                      <span className="text-gray-600">Strong proposal with minor weaknesses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">5-6: Good</span>
                      <span className="text-gray-600">Solid proposal with some concerns</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">3-4: Fair</span>
                      <span className="text-gray-600">Significant weaknesses present</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">1-2: Poor</span>
                      <span className="text-gray-600">Major flaws, not recommended</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Review Timeline
                </CardTitle>
                <CardDescription>Step-by-step process from application to funding decision</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((phase, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Total Timeline: 8-12 weeks</h3>
                  <p className="text-gray-600 text-sm">
                    The complete review process typically takes 8-12 weeks from submission to final decision. Complex
                    applications or those requiring additional documentation may take longer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your grant application today and join the community of researchers advancing science and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start Application
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
