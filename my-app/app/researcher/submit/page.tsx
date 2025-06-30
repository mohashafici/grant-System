"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Home, FileText, Plus, Bell, User, Upload, Save, Send, Award, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import ResearcherLayout from "@/components/layouts/ResearcherLayout"

const steps = [
  { id: 1, title: "Project Details", description: "Basic information about your research" },
  { id: 2, title: "Research Plan", description: "Detailed research methodology and objectives" },
  { id: 3, title: "Budget & Timeline", description: "Financial planning and project timeline" },
  { id: 4, title: "Documents", description: "Upload supporting documents" },
  { id: 5, title: "Review & Submit", description: "Final review before submission" },
]

function ResearcherSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Grant Portal</h2>
            <p className="text-xs text-muted-foreground">Researcher</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/proposals">
                    <FileText className="w-4 h-4" />
                    <span>My Proposals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard/researcher/submit">
                    <Plus className="w-4 h-4" />
                    <span>Submit Proposal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/notifications">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/researcher/profile">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function ResearcherSubmitPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    abstract: "",
    objectives: "",
    methodology: "",
    budget: "",
    timeline: "",
    expectedOutcomes: "",
    grant: "",
    deadline: "",
    // Budget breakdown fields
    personnelCosts: "",
    equipmentCosts: "",
    materialsCosts: "",
    travelCosts: "",
    otherCosts: "",
  })
  const [files, setFiles] = useState({
    proposalDocument: null,
    cvResume: null,
    additionalDocuments: [],
  })
  const [grants, setGrants] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const grantIdFromQuery = searchParams.get("grantId")

  const progress = (currentStep / steps.length) * 100

  useEffect(() => {
    // Fetch grants for dropdown
    const fetchGrants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/grants")
        const data = await res.json()
        setGrants(data)
        // If grantId is in the URL and valid, set it as selected
        if (grantIdFromQuery && data.some((g) => g._id === grantIdFromQuery)) {
          setFormData((prev) => ({ ...prev, grant: grantIdFromQuery }))
        }
      } catch {}
    }
    fetchGrants()
  }, [grantIdFromQuery])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    // Handle save draft logic
  }

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return

    if (field === 'additionalDocuments') {
      // Handle multiple files for additional documents
      const fileArray = Array.from(files)
      setFiles(prev => ({
        ...prev,
        additionalDocuments: fileArray
      }))
    } else {
      // Handle single file
      setFiles(prev => ({
        ...prev,
        [field]: files[0]
      }))
    }
  }

  const removeFile = (field: string, index?: number) => {
    if (field === 'additionalDocuments' && typeof index === 'number') {
      setFiles(prev => ({
        ...prev,
        additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
      }))
    } else {
      setFiles(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const calculateTotalBudget = () => {
    const personnel = parseFloat(formData.personnelCosts) || 0
    const equipment = parseFloat(formData.equipmentCosts) || 0
    const materials = parseFloat(formData.materialsCosts) || 0
    const travel = parseFloat(formData.travelCosts) || 0
    const other = parseFloat(formData.otherCosts) || 0
    return personnel + equipment + materials + travel + other
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)
    
    // Validate required fields
    if (!formData.title || !formData.abstract || !formData.deadline || !formData.budget || !formData.category || !formData.grant) {
      setSubmitError("Please fill all required fields.")
      setSubmitting(false)
      return
    }

    // Validate files
    if (!files.proposalDocument) {
      setSubmitError("Please upload a proposal document.")
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('abstract', formData.abstract)
      formDataToSend.append('deadline', formData.deadline)
      formDataToSend.append('funding', formData.budget)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('grant', formData.grant)
      formDataToSend.append('objectives', formData.objectives)
      formDataToSend.append('methodology', formData.methodology)
      formDataToSend.append('timeline', formData.timeline)
      formDataToSend.append('expectedOutcomes', formData.expectedOutcomes)
      
      // Add budget breakdown
      formDataToSend.append('personnelCosts', formData.personnelCosts)
      formDataToSend.append('equipmentCosts', formData.equipmentCosts)
      formDataToSend.append('materialsCosts', formData.materialsCosts)
      formDataToSend.append('travelCosts', formData.travelCosts)
      formDataToSend.append('otherCosts', formData.otherCosts)

      // Add files
      if (files.proposalDocument) {
        formDataToSend.append('proposalDocument', files.proposalDocument)
      }
      if (files.cvResume) {
        formDataToSend.append('cvResume', files.cvResume)
      }
      files.additionalDocuments.forEach((file, index) => {
        formDataToSend.append(`additionalDocuments`, file)
      })

      const res = await fetch("http://localhost:5000/api/proposals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to submit proposal")
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/researcher/proposals")
      }, 1500)
    } catch (err: any) {
      setSubmitError(err.message || "Error submitting proposal")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter your project title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Research Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select research category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology & Innovation</SelectItem>
                  <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
                  <SelectItem value="Environment">Environment & Sustainability</SelectItem>
                  <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant">Select Grant *</Label>
              <Select
                value={formData.grant}
                onValueChange={(value) => setFormData({ ...formData, grant: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grant" />
                </SelectTrigger>
                <SelectContent>
                  {grants.map((grant) => (
                    <SelectItem key={grant._id} value={grant._id}>{grant.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Proposal Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abstract">Project Abstract *</Label>
              <Textarea
                id="abstract"
                placeholder="Provide a brief summary of your research project (max 500 words)"
                rows={6}
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              />
              <p className="text-sm text-gray-500">{formData.abstract.length}/500 words</p>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="objectives">Research Objectives *</Label>
              <Textarea
                id="objectives"
                placeholder="Describe the main objectives and goals of your research"
                rows={4}
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology *</Label>
              <Textarea
                id="methodology"
                placeholder="Explain your research methodology and approach"
                rows={6}
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcomes">Expected Outcomes</Label>
              <Textarea
                id="outcomes"
                placeholder="Describe the expected outcomes and impact of your research"
                rows={4}
                value={formData.expectedOutcomes}
                onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget Requested *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter amount in USD"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Project Timeline *</Label>
              <Textarea
                id="timeline"
                placeholder="Provide a detailed timeline with milestones"
                rows={6}
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Breakdown</CardTitle>
                <CardDescription>Provide a detailed breakdown of your budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personnelCosts">Personnel Costs</Label>
                    <Input 
                      id="personnelCosts"
                      type="number" 
                      placeholder="$0" 
                      value={formData.personnelCosts}
                      onChange={(e) => setFormData({ ...formData, personnelCosts: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipmentCosts">Equipment</Label>
                    <Input 
                      id="equipmentCosts"
                      type="number" 
                      placeholder="$0" 
                      value={formData.equipmentCosts}
                      onChange={(e) => setFormData({ ...formData, equipmentCosts: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="materialsCosts">Materials & Supplies</Label>
                    <Input 
                      id="materialsCosts"
                      type="number" 
                      placeholder="$0" 
                      value={formData.materialsCosts}
                      onChange={(e) => setFormData({ ...formData, materialsCosts: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelCosts">Travel</Label>
                    <Input 
                      id="travelCosts"
                      type="number" 
                      placeholder="$0" 
                      value={formData.travelCosts}
                      onChange={(e) => setFormData({ ...formData, travelCosts: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="otherCosts">Other Costs</Label>
                    <Input 
                      id="otherCosts"
                      type="number" 
                      placeholder="$0" 
                      value={formData.otherCosts}
                      onChange={(e) => setFormData({ ...formData, otherCosts: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Budget:</span>
                    <span className="text-lg font-bold">${calculateTotalBudget().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Documents</CardTitle>
                <CardDescription>Upload supporting documents for your proposal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proposal Document */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Upload Proposal Document *</p>
                    <p className="text-sm text-gray-500 mb-4">PDF format, max 10MB</p>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('proposalDocument', e.target.files)}
                      className="hidden"
                      id="proposalDocument"
                    />
                    <Label htmlFor="proposalDocument" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                  </div>
                  {files.proposalDocument && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{files.proposalDocument.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('proposalDocument')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CV/Resume */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Upload CV/Resume</p>
                    <p className="text-sm text-gray-500 mb-4">PDF format, max 5MB</p>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('cvResume', e.target.files)}
                      className="hidden"
                      id="cvResume"
                    />
                    <Label htmlFor="cvResume" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                  </div>
                  {files.cvResume && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{files.cvResume.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('cvResume')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Documents */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Additional Documents</p>
                    <p className="text-sm text-gray-500 mb-4">Letters of support, references, etc. (PDF, max 5MB each)</p>
                    <Input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange('additionalDocuments', e.target.files)}
                      className="hidden"
                      id="additionalDocuments"
                    />
                    <Label htmlFor="additionalDocuments" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </span>
                      </Button>
                    </Label>
                  </div>
                  {files.additionalDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.additionalDocuments.map((file, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('additionalDocuments', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Your Proposal</CardTitle>
                <CardDescription>Please review all information before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Project Title</Label>
                    <p className="text-sm text-gray-600">{formData.title || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Category</Label>
                    <p className="text-sm text-gray-600">{formData.category || "Not selected"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Budget</Label>
                    <p className="text-sm text-gray-600">${formData.budget || "0"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Status</Label>
                    <p className="text-sm text-gray-600">Ready to submit</p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Abstract</Label>
                  <p className="text-sm text-gray-600 mt-1">{formData.abstract || "Not provided"}</p>
                </div>
                <div>
                  <Label className="font-medium">Budget Breakdown</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Personnel: ${formData.personnelCosts || "0"}</div>
                    <div>Equipment: ${formData.equipmentCosts || "0"}</div>
                    <div>Materials: ${formData.materialsCosts || "0"}</div>
                    <div>Travel: ${formData.travelCosts || "0"}</div>
                    <div>Other: ${formData.otherCosts || "0"}</div>
                    <div className="font-medium">Total: ${calculateTotalBudget().toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Documents</Label>
                  <div className="mt-2 space-y-1">
                    {files.proposalDocument && (
                      <p className="text-sm text-gray-600">✓ {files.proposalDocument.name}</p>
                    )}
                    {files.cvResume && (
                      <p className="text-sm text-gray-600">✓ {files.cvResume.name}</p>
                    )}
                    {files.additionalDocuments.map((file, index) => (
                      <p key={index} className="text-sm text-gray-600">✓ {file.name}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-600">⚠️</div>
                  <div>
                    <h4 className="font-medium text-yellow-800">Before You Submit</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Ensure all required fields are completed</li>
                      <li>• Review your documents for accuracy</li>
                      <li>• Check that your budget aligns with project scope</li>
                      <li>• Verify submission deadline compliance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <ResearcherLayout active="submit">
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Submit New Proposal</h1>
                  <p className="text-gray-600">
                    Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/researcher">Cancel</Link>
              </Button>
            </div>
          </header>

          <main className="p-6">
            {submitError && (
              <div className="mb-4 text-red-600 font-medium">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="mb-4 text-green-600 font-medium">Proposal submitted successfully! Redirecting to My Proposals...</div>
            )}
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Proposal Progress</h2>
                <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center text-center max-w-[120px]">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                        step.id <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className="text-xs">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-gray-500">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || submitting}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleSaveDraft} disabled={submitting}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                {currentStep === steps.length ? (
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Proposal
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ResearcherLayout>
  )
}
