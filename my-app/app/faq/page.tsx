"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  ArrowLeft,
  Search,
  HelpCircle,
  FileText,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const generalFAQs = [
    {
      question: "What is the Innovation Grant Portal?",
      answer:
        "The Innovation Grant Portal is a comprehensive platform that connects researchers with funding opportunities. We facilitate the entire grant lifecycle from application submission to award management, supporting groundbreaking research across multiple disciplines including AI, climate science, biotechnology, and more.",
    },
    {
      question: "Who can apply for grants?",
      answer:
        "Principal investigators must hold a PhD or equivalent degree and be affiliated with an accredited research institution. We welcome applications from researchers at all career stages, including early-career scientists, and encourage interdisciplinary and international collaborations.",
    },
    {
      question: "What types of research do you fund?",
      answer:
        "We fund research across six main categories: Artificial Intelligence & Machine Learning, Climate & Environmental Science, Biotechnology & Life Sciences, Quantum Computing, Materials Science, and Energy & Sustainability. Projects should demonstrate potential for significant scientific, technological, or societal impact.",
    },
    {
      question: "How much funding is available?",
      answer:
        "Grant amounts range from $50,000 to $500,000, depending on the research category and project scope. Project durations can be 1-5 years. Specific funding ranges vary by category - for example, AI projects typically range from $50,000-$300,000, while biotechnology projects can receive up to $500,000.",
    },
    {
      question: "How long does the review process take?",
      answer:
        "The complete review process typically takes 8-12 weeks from submission to final decision. This includes initial administrative review (2 weeks), peer review by experts (4-6 weeks), panel discussion (1 week), final decision (1 week), and award setup (2-3 weeks).",
    },
  ]

  const applicationFAQs = [
    {
      question: "What documents do I need to submit?",
      answer:
        "Required documents include: project abstract (500 words max), detailed research proposal, methodology description, timeline with milestones, Principal Investigator CV (5 pages max), Co-investigator CVs (2 pages each), detailed budget justification, institutional support letter, and ethics approval if applicable.",
    },
    {
      question: "Can I submit multiple applications?",
      answer:
        "Principal investigators can have no more than 3 active grants at any time. You may submit applications for different projects, but each must be substantially different in scope and objectives. We encourage focusing on your strongest proposal rather than submitting multiple similar applications.",
    },
    {
      question: "What are the budget guidelines?",
      answer:
        "Budget allocations should follow these guidelines: Personnel (up to 60%), Equipment and supplies (up to 25%), Travel and conferences (up to 10%), and Indirect costs (up to 15%). All expenses must be justified and directly related to the research objectives.",
    },
    {
      question: "Can international researchers apply?",
      answer:
        "Yes, we welcome international applications and encourage global collaborations. However, the principal investigator must be affiliated with an accredited research institution, and projects should comply with relevant international research standards and ethical guidelines.",
    },
    {
      question: "What happens if my application is rejected?",
      answer:
        "Rejected applicants receive detailed feedback from reviewers explaining the decision. You may resubmit an improved application after addressing the concerns raised. There's no limit on resubmissions, but we recommend waiting at least 3 months to allow time for significant improvements.",
    },
  ]

  const reviewFAQs = [
    {
      question: "How are applications evaluated?",
      answer:
        "Applications are evaluated on five criteria: Scientific Merit (30%), Technical Approach (25%), Investigator Qualifications (20%), Budget & Resources (15%), and Timeline & Milestones (10%). Each application is reviewed by 3-5 experts in the relevant field using a 1-10 scoring scale.",
    },
    {
      question: "Who reviews the applications?",
      answer:
        "Our review panels consist of leading researchers and industry experts in relevant fields. All reviewers undergo training on evaluation criteria and ethical guidelines. We maintain strict confidentiality and conflict-of-interest policies to ensure fair and unbiased reviews.",
    },
    {
      question: "Can I see my review scores?",
      answer:
        "Yes, applicants receive detailed feedback including individual reviewer scores, comments, and panel recommendations. This feedback is provided regardless of funding outcome to help improve future applications and research proposals.",
    },
    {
      question: "What is the scoring system?",
      answer:
        "We use a 1-10 scale: 9-10 (Exceptional - outstanding in all aspects), 7-8 (Excellent - strong proposal with minor weaknesses), 5-6 (Good - solid proposal with some concerns), 3-4 (Fair - significant weaknesses present), 1-2 (Poor - major flaws, not recommended for funding).",
    },
  ]

  const fundingFAQs = [
    {
      question: "How are funds disbursed?",
      answer:
        "Funds are typically disbursed in installments based on project milestones and progress reports. The first installment (usually 40-50%) is released upon contract execution, with subsequent payments tied to milestone achievements and annual progress reviews.",
    },
    {
      question: "What reporting is required?",
      answer:
        "Recipients must submit annual progress reports, financial reports, and a final comprehensive report. Reports should include research progress, publications, presentations, personnel updates, and budget expenditures. Additional interim reports may be required for multi-year projects.",
    },
    {
      question: "Can I change my research plan after funding?",
      answer:
        "Minor modifications to research plans are generally acceptable with prior approval. Significant changes to objectives, methodology, or budget require formal amendment requests. We understand that research often evolves, and we work with recipients to accommodate reasonable changes.",
    },
    {
      question: "What about intellectual property rights?",
      answer:
        "Intellectual property rights typically remain with the recipient institution, subject to standard government and funder rights. Recipients are encouraged to pursue commercialization opportunities and must acknowledge grant support in all publications and presentations.",
    },
    {
      question: "Can funding be extended?",
      answer:
        "No-cost extensions may be granted for up to 12 months with adequate justification. Requests should be submitted at least 60 days before the project end date. Extensions with additional funding require a separate application process and are subject to availability of funds.",
    },
  ]

  const allFAQs = [...generalFAQs, ...applicationFAQs, ...reviewFAQs, ...fundingFAQs]

  const filteredFAQs = allFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <h1 className="text-xl font-semibold text-gray-900">FAQ</h1>
              <p className="text-sm text-gray-600">Frequently Asked Questions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked
            <span className="text-blue-600 block">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Find answers to common questions about our grant programs, application process, and funding opportunities.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-4">
              <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">Common Questions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24h</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Questions Resolved</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        {searchTerm ? (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""} for "{searchTerm}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="application" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Review Process
              </TabsTrigger>
              <TabsTrigger value="funding" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Funding
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Questions</CardTitle>
                  <CardDescription>Basic information about our grant programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {generalFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="application">
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                  <CardDescription>Questions about submitting grant applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {applicationFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`application-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review Process</CardTitle>
                  <CardDescription>How applications are evaluated and scored</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {reviewFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`review-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funding">
              <Card>
                <CardHeader>
                  <CardTitle>Funding & Management</CardTitle>
                  <CardDescription>Information about grant management and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {fundingFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`funding-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Still Need Help */}
        <section className="mt-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help with any questions about
                grant applications, technical issues, or program details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">Contact Support</Button>
                </Link>
                <Link href="/guidelines">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent"
                  >
                    View Guidelines
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
