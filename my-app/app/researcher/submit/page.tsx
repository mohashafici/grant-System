"use client"

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ResearcherLayout from "@/components/layouts/ResearcherLayout";
import { authStorage } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { FormError } from "@/components/ui/form-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  FileText,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  Building,
  ChevronLeft,
  ChevronRight,
  Award,
  Info,
} from "lucide-react";

const steps = [
  { id: 1, title: "Project Details", description: "Basic information about your research" },
  { id: 2, title: "Research Plan", description: "Detailed research methodology and objectives" },
  { id: 3, title: "Budget & Timeline", description: "Financial planning and project timeline" },
  { id: 4, title: "Documents", description: "Upload supporting documents" },
  { id: 5, title: "Review & Submit", description: "Final review before submission" },
]

// Validation functions
const validateProposalField = (name: string, value: string, selectedGrant?: any, budgetBreakdown?: any): string => {
  switch (name) {
    case 'title':
      if (!value.trim()) return "Project title is required"
      if (value.trim().length < 3) return "Title must be at least 3 characters"
      if (/^\d+$/.test(value.trim())) return "Title cannot be only numbers"
      return ""
    
    case 'abstract':
      if (!value.trim()) return "Project abstract is required"
      if (value.trim().length < 50) return "Abstract must be at least 50 characters"
      if (value.trim().length > 500) return "Abstract must not exceed 500 characters"
      if (/^\d+$/.test(value.trim())) return "Abstract cannot be only numbers"
      return ""
    
    case 'objectives':
      if (!value.trim()) return "Research objectives are required"
      if (value.trim().length < 3) return "Objectives must be at least 3 characters"
      if (/^\d+$/.test(value.trim())) return "Objectives cannot be only numbers"
      return ""
    
    case 'methodology':
      if (!value.trim()) return "Research methodology is required"
      if (value.trim().length < 3) return "Methodology must be at least 3 characters"
      if (/^\d+$/.test(value.trim())) return "Methodology cannot be only numbers"
      return ""
    
    case 'timeline':
      if (!value.trim()) return "Project timeline is required"
      if (value.trim().length < 3) return "Timeline must be at least 3 characters"
      if (/^\d+$/.test(value.trim())) return "Timeline cannot be only numbers"
      return ""
    
    case 'grant':
      if (!value) return "Please select a grant"
      return ""
    
    case 'budgetBreakdown':
      if (!selectedGrant) return "Please select a grant first"
      
      const totalBreakdown = Object.values(budgetBreakdown || {}).reduce((sum: number, val: any) => {
        return sum + (Number(val) || 0)
      }, 0)
      
      const grantFunding = selectedGrant.funding || 0
      
      if (totalBreakdown === 0) return "Please fill at least one budget breakdown field"
      if (totalBreakdown !== grantFunding) return `Budget breakdown total ($${totalBreakdown.toLocaleString()}) must equal grant funding ($${grantFunding.toLocaleString()})`
      return ""
    
    case 'personnelCosts':
    case 'equipmentCosts':
    case 'materialsCosts':
    case 'travelCosts':
    case 'otherCosts':
      if (value && Number(value) < 0) return "Cost cannot be negative"
      return ""
    
    default:
      return ""
  }
}

function SubmitPageContent() {
  useAuthRedirect()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    objectives: "",
    methodology: "",
    timeline: "",
    expectedOutcomes: "",
    grant: "",
    category: "",
    personnelCosts: "",
    equipmentCosts: "",
    materialsCosts: "",
    travelCosts: "",
    otherCosts: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [files, setFiles] = useState<{
    proposalDocument: File | null;
    cvResume: File | null;
    additionalDocuments: File[];
  }>({
    proposalDocument: null,
    cvResume: null,
    additionalDocuments: [],
  })
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})
  const [grants, setGrants] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [grantIdFromQuery, setGrantIdFromQuery] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const progress = (currentStep / steps.length) * 100

  // Get selected grant info for display - use useMemo to prevent initialization issues
  const selectedGrant = useMemo(() => {
    return grants.find((g) => g._id === formData.grant);
  }, [formData.grant, grants]);

  // Get grantId from URL after component mounts to avoid hydration issues
  useEffect(() => {
    const grantId = searchParams.get('grantId');
    if (grantId) {
      setGrantIdFromQuery(grantId);
    }
  }, [searchParams]);

  // Show loading while grantId is being set
  if (grantIdFromQuery === undefined) {
    return (
      <ResearcherLayout active="submit">
        <div className="p-6 text-center">
          <LoadingSpinner text="Loading..." />
        </div>
      </ResearcherLayout>
    )
  }

  useEffect(() => {
    // Real-time validation
    Object.keys(formData).forEach(field => {
      if (touched[field]) {
        let error = ""
        if (field === 'budgetBreakdown') {
          error = validateProposalField(field, "", selectedGrant, {
            personnelCosts: formData.personnelCosts,
            equipmentCosts: formData.equipmentCosts,
            materialsCosts: formData.materialsCosts,
            travelCosts: formData.travelCosts,
            otherCosts: formData.otherCosts,
          })
        } else {
          error = validateProposalField(field, formData[field as keyof typeof formData], selectedGrant)
        }
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [formData, touched, selectedGrant])

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/grants`);
        if (!res.ok) {
          throw new Error('Failed to fetch grants');
        }
        const data = await res.json();
        
        // Filter for active grants
        const activeGrants = data.filter((grant: any) => grant.status === "Active");
        
        if (activeGrants.length > 0) {
          setGrants(activeGrants);
        } else {
          // Fallback to all grants if no active ones
          setGrants(data);
        }
        
        // Pre-select grant if ID is in query params
        const grantIdFromQuery = searchParams.get('grantId');
        if (grantIdFromQuery) {
          const matchingGrant = activeGrants.find((g: any) => g._id === grantIdFromQuery);
          if (matchingGrant) {
            setFormData(prev => ({ 
              ...prev, 
              grant: grantIdFromQuery,
              category: matchingGrant.category // Auto-fill category from selected grant
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching grants:', error);
      }
    };

    fetchGrants();
  }, [searchParams]);

  // Set grant when selected (auto-fill category)
  const handleGrantChange = (grantId: string) => {
    const grant = grants.find((g) => g._id === grantId);
    if (grant) {
      setFormData((prev) => ({
        ...prev,
        grant: grantId,
        category: grant.category // Auto-fill category from selected grant
      }));
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !validateProposalField('title', formData.title) && 
               !validateProposalField('abstract', formData.abstract) && 
               !validateProposalField('grant', formData.grant)
      case 2:
        return !validateProposalField('objectives', formData.objectives) && 
               !validateProposalField('methodology', formData.methodology)
      case 3:
        return !validateProposalField('timeline', formData.timeline) && 
               !validateProposalField('budgetBreakdown', "", selectedGrant, {
                 personnelCosts: formData.personnelCosts,
                 equipmentCosts: formData.equipmentCosts,
                 materialsCosts: formData.materialsCosts,
                 travelCosts: formData.travelCosts,
                 otherCosts: formData.otherCosts,
               })
      case 4:
        return files.proposalDocument !== null
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else if (!isStepValid(currentStep)) {
      // Mark all fields in current step as touched to show errors
      const stepFields = {
        1: ['title', 'abstract', 'grant'],
        2: ['objectives', 'methodology'],
        3: ['timeline', 'budgetBreakdown'],
        4: ['proposalDocument']
      }
      const fieldsToTouch = stepFields[currentStep as keyof typeof stepFields] || []
      const newTouched = { ...touched }
      fieldsToTouch.forEach(field => {
        newTouched[field] = true
      })
      setTouched(newTouched)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateFile = (file: File, field: string): string => {
    const allowedTypes = ['.pdf', '.docx']
    const maxSizes = {
      proposalDocument: 10 * 1024 * 1024, // 10MB
      cvResume: 5 * 1024 * 1024, // 5MB
      additionalDocuments: 5 * 1024 * 1024 // 5MB
    }
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      return `Only PDF and DOCX files are allowed. Received: ${fileExtension}`
    }
    
    if (file.size > maxSizes[field as keyof typeof maxSizes]) {
      const maxSizeMB = maxSizes[field as keyof typeof maxSizes] / (1024 * 1024)
      return `File size must be less than ${maxSizeMB}MB`
    }
    
    return ""
  }

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    if (field === 'additionalDocuments') {
      const newFiles = Array.from(files)
      const validFiles: File[] = []
      const newErrors: string[] = []

      newFiles.forEach((file, index) => {
        const error = validateFile(file, field)
        if (error) {
          newErrors.push(`File ${file.name}: ${error}`)
        } else {
          validFiles.push(file)
        }
      })

      if (newErrors.length > 0) {
        setFileErrors(prev => ({ ...prev, [field]: newErrors.join(', ') }))
        return
      }

      setFiles(prev => ({
        ...prev,
        [field]: [...(prev[field] as File[]), ...validFiles]
      }))
      setFileErrors(prev => ({ ...prev, [field]: "" }))
    } else {
      const file = files[0]
      const error = validateFile(file, field)
      
      if (error) {
        setFileErrors(prev => ({ ...prev, [field]: error }))
        return
      }

      setFiles(prev => ({ ...prev, [field]: file }))
      setFileErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const removeFile = (field: string, index?: number) => {
    if (field === 'additionalDocuments' && typeof index === 'number') {
      setFiles(prev => ({
        ...prev,
        [field]: (prev[field] as File[]).filter((_, i) => i !== index)
      }))
    } else {
      setFiles(prev => ({ ...prev, [field]: field === 'additionalDocuments' ? null : null }))
    }
    setFileErrors(prev => ({ ...prev, [field]: "" }))
  }

  const calculateTotalBudget = () => {
    return (
      (Number(formData.personnelCosts) || 0) +
      (Number(formData.equipmentCosts) || 0) +
      (Number(formData.materialsCosts) || 0) +
      (Number(formData.travelCosts) || 0) +
      (Number(formData.otherCosts) || 0)
    )
  }

  const handleSubmit = async () => {
    // Validate all fields before submission
    const allFields = ['title', 'abstract', 'objectives', 'methodology', 'timeline', 'grant']
    const newErrors: { [key: string]: string } = {}
    
    allFields.forEach(field => {
      const error = validateProposalField(field, formData[field as keyof typeof formData], selectedGrant)
      if (error) newErrors[field] = error
    })
    
    // Validate budget breakdown
    const budgetError = validateProposalField('budgetBreakdown', "", selectedGrant, {
      personnelCosts: formData.personnelCosts,
      equipmentCosts: formData.equipmentCosts,
      materialsCosts: formData.materialsCosts,
      travelCosts: formData.travelCosts,
      otherCosts: formData.otherCosts,
    })
    if (budgetError) newErrors.budgetBreakdown = budgetError
    
    // Validate required files
    if (!files.proposalDocument) {
      newErrors.proposalDocument = "Proposal document is required"
    }
    
    setErrors(newErrors)
    setTouched({
      title: true,
      abstract: true,
      objectives: true,
      methodology: true,
      timeline: true,
      grant: true,
      budgetBreakdown: true,
      proposalDocument: true,
    })
    
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setSubmitting(true)
    setSubmitError("")

    try {
      const token = authStorage.getToken()
      if (!token) {
        setSubmitError("Authentication required")
        return
      }

      const formDataToSend = new FormData()
      
      // Add form data
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', selectedGrant?.category || '')
      formDataToSend.append('abstract', formData.abstract)
      formDataToSend.append('objectives', formData.objectives)
      formDataToSend.append('methodology', formData.methodology)
      formDataToSend.append('timeline', formData.timeline)
      formDataToSend.append('expectedOutcomes', formData.expectedOutcomes)
      formDataToSend.append('grant', formData.grant)
      formDataToSend.append('budget', selectedGrant?.funding?.toString() || '0')
      
      // Add budget breakdown
      formDataToSend.append('personnelCosts', formData.personnelCosts || '0')
      formDataToSend.append('equipmentCosts', formData.equipmentCosts || '0')
      formDataToSend.append('materialsCosts', formData.materialsCosts || '0')
      formDataToSend.append('travelCosts', formData.travelCosts || '0')
      formDataToSend.append('otherCosts', formData.otherCosts || '0')

      // Add files
      if (files.proposalDocument) {
        formDataToSend.append('proposalDocument', files.proposalDocument)
      }
      if (files.cvResume) {
        formDataToSend.append('cvResume', files.cvResume)
      }
      if (files.additionalDocuments.length > 0) {
        files.additionalDocuments.forEach((file, index) => {
          formDataToSend.append(`additionalDocuments`, file)
        })
      }

      const response = await fetch(`${API_BASE_URL}/proposals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          router.push('/researcher/proposals')
        }, 2000)
      } else {
        const errorData = await response.json()
        setSubmitError(errorData.message || 'Failed to submit proposal')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError('Network error occurred. Please try again.')
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
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                className={errors.title && touched.title ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.title} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grant">Select Grant *</Label>
              <Select
                value={formData.grant}
                onValueChange={handleGrantChange}
                onOpenChange={(open) => !open && handleBlur('grant')}
              >
                <SelectTrigger className={errors.grant && touched.grant ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select grant" />
                </SelectTrigger>
                <SelectContent>
                  {grants.length === 0 ? (
                    <SelectItem value="no-grants" disabled>
                      No grants available
                    </SelectItem>
                  ) : (
                    grants.map((grant) => (
                      <SelectItem key={grant._id} value={grant._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{grant.title}</span>
                          <span className="text-sm text-gray-500">
                            ${grant.funding?.toLocaleString()} • {grant.category} • {grant.status}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormError error={errors.grant} />
              
              {selectedGrant && (
                <Card className="mt-3">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Grant Title:</span>
                        <span>{selectedGrant.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Available Funding:</span>
                        <span className="text-green-600 font-semibold">${selectedGrant.funding?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span>{selectedGrant.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Deadline:</span>
                        <span>{new Date(selectedGrant.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {selectedGrant.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">Project Abstract *</Label>
              <Textarea
                id="abstract"
                placeholder="Provide a brief summary of your research project (minimum 50 characters, max 500 characters)"
                rows={6}
                value={formData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                onBlur={() => handleBlur('abstract')}
                className={errors.abstract && touched.abstract ? "border-red-500 focus:border-red-500" : ""}
              />
              <div className="flex justify-between items-center">
                <FormError error={errors.abstract} />
                <p className="text-sm text-gray-500">
                  {formData.abstract.length}/500 characters 
                  {formData.abstract.length < 50 && formData.abstract.length > 0 && (
                    <span className="text-red-500 ml-2">(Need {50 - formData.abstract.length} more)</span>
                  )}
                </p>
              </div>
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
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                onBlur={() => handleBlur('objectives')}
                className={errors.objectives && touched.objectives ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.objectives} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology *</Label>
              <Textarea
                id="methodology"
                placeholder="Explain your research methodology and approach"
                rows={6}
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                onBlur={() => handleBlur('methodology')}
                className={errors.methodology && touched.methodology ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.methodology} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcomes">Expected Outcomes</Label>
              <Textarea
                id="outcomes"
                placeholder="Describe the expected outcomes and impact of your research"
                rows={4}
                value={formData.expectedOutcomes}
                onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
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
                placeholder="Total funding of selected grant"
                value={selectedGrant && selectedGrant.funding ? selectedGrant.funding.toString() : ""}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">This amount is automatically set based on the selected grant</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Project Timeline *</Label>
              <Textarea
                id="timeline"
                placeholder="Provide a detailed timeline with milestones"
                rows={6}
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                onBlur={() => handleBlur('timeline')}
                className={errors.timeline && touched.timeline ? "border-red-500 focus:border-red-500" : ""}
              />
              <FormError error={errors.timeline} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Breakdown *</CardTitle>
                <CardDescription>Provide a detailed breakdown of your budget (at least one field required, total must equal grant funding)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personnelCosts">Personnel Costs</Label>
                    <Input 
                      id="personnelCosts"
                      type="number" 
                      min="0"
                      placeholder="$0" 
                      value={formData.personnelCosts}
                      onChange={(e) => handleInputChange('personnelCosts', e.target.value)}
                      onBlur={() => handleBlur('budgetBreakdown')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipmentCosts">Equipment</Label>
                    <Input 
                      id="equipmentCosts"
                      type="number" 
                      min="0"
                      placeholder="$0" 
                      value={formData.equipmentCosts}
                      onChange={(e) => handleInputChange('equipmentCosts', e.target.value)}
                      onBlur={() => handleBlur('budgetBreakdown')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="materialsCosts">Materials & Supplies</Label>
                    <Input 
                      id="materialsCosts"
                      type="number" 
                      min="0"
                      placeholder="$0" 
                      value={formData.materialsCosts}
                      onChange={(e) => handleInputChange('materialsCosts', e.target.value)}
                      onBlur={() => handleBlur('budgetBreakdown')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelCosts">Travel</Label>
                    <Input 
                      id="travelCosts"
                      type="number" 
                      min="0"
                      placeholder="$0" 
                      value={formData.travelCosts}
                      onChange={(e) => handleInputChange('travelCosts', e.target.value)}
                      onBlur={() => handleBlur('budgetBreakdown')}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="otherCosts">Other Costs</Label>
                    <Input 
                      id="otherCosts"
                      type="number" 
                      min="0"
                      placeholder="$0" 
                      value={formData.otherCosts}
                      onChange={(e) => handleInputChange('otherCosts', e.target.value)}
                      onBlur={() => handleBlur('budgetBreakdown')}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Budget:</span>
                    <span className={`text-lg font-bold ${calculateTotalBudget() === (selectedGrant?.funding || 0) ? 'text-green-600' : 'text-red-600'}`}>
                      ${calculateTotalBudget().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-500">Grant Funding:</span>
                    <span className="text-sm text-gray-500">${(selectedGrant?.funding || 0).toLocaleString()}</span>
                  </div>
                </div>
                <FormError error={errors.budgetBreakdown} />
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
                <CardDescription>Upload supporting documents for your proposal (PDF and DOCX files only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proposal Document */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Upload Proposal Document *</p>
                    <p className="text-sm text-gray-500 mb-4">PDF or DOCX format, max 10MB</p>
                    <Input
                      type="file"
                      accept=".pdf,.docx"
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
                  {fileErrors.proposalDocument && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{fileErrors.proposalDocument}</span>
                      </div>
                    </div>
                  )}
                  {files.proposalDocument && !fileErrors.proposalDocument && (
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
                    <p className="text-sm text-gray-500 mb-4">PDF or DOCX format, max 5MB</p>
                    <Input
                      type="file"
                      accept=".pdf,.docx"
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
                  {fileErrors.cvResume && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{fileErrors.cvResume}</span>
                      </div>
                    </div>
                  )}
                  {files.cvResume && !fileErrors.cvResume && (
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
                    <p className="text-sm text-gray-500 mb-4">Letters of support, references, etc. (PDF or DOCX, max 5MB each)</p>
                    <Input
                      type="file"
                      accept=".pdf,.docx"
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
                  {fileErrors.additionalDocuments && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{fileErrors.additionalDocuments}</span>
                      </div>
                    </div>
                  )}
                  {files.additionalDocuments.length > 0 && !fileErrors.additionalDocuments && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Title:</span> {formData.title}</p>
                      <p><span className="font-medium">Grant:</span> {selectedGrant?.title}</p>
                      <p><span className="font-medium">Category:</span> {selectedGrant?.category}</p>
                      <p><span className="font-medium">Funding:</span> ${selectedGrant?.funding?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Budget Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Personnel:</span> ${(Number(formData.personnelCosts) || 0).toLocaleString()}</p>
                      <p><span className="font-medium">Equipment:</span> ${(Number(formData.equipmentCosts) || 0).toLocaleString()}</p>
                      <p><span className="font-medium">Materials:</span> ${(Number(formData.materialsCosts) || 0).toLocaleString()}</p>
                      <p><span className="font-medium">Travel:</span> ${(Number(formData.travelCosts) || 0).toLocaleString()}</p>
                      <p><span className="font-medium">Other:</span> ${(Number(formData.otherCosts) || 0).toLocaleString()}</p>
                      <p className="font-medium border-t pt-1">Total: ${calculateTotalBudget().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Documents</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Proposal Document:</span> {files.proposalDocument ? files.proposalDocument.name : 'Not uploaded'}</p>
                    <p><span className="font-medium">CV/Resume:</span> {files.cvResume ? files.cvResume.name : 'Not uploaded'}</p>
                    <p><span className="font-medium">Additional Documents:</span> {files.additionalDocuments.length} file(s)</p>
                  </div>
                </div>
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}
                {submitSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600">
                      <Award className="w-4 h-4" />
                      <span>Proposal submitted successfully! Redirecting...</span>
                    </div>
                  </div>
                )}
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
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Submit Proposal</h1>
            <p className="text-gray-600">Create and submit your research proposal</p>
          </div>
          <Link href="/researcher/proposals">
            <Button variant="outline" className="w-full sm:w-auto">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Proposals
            </Button>
          </Link>
        </div>

        {/* Required Fields Info */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Required Fields:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>• <strong>Project Title:</strong> Minimum 3 characters</div>
                  <div>• <strong>Project Abstract:</strong> 50-500 characters</div>
                  <div>• <strong>Research Objectives:</strong> Minimum 3 characters</div>
                  <div>• <strong>Research Methodology:</strong> Minimum 3 characters</div>
                  <div>• <strong>Project Timeline:</strong> Minimum 3 characters</div>
                  <div>• <strong>Grant Selection:</strong> Must select a grant</div>
                  <div>• <strong>Budget Breakdown:</strong> At least one category required</div>
                  <div>• <strong>Proposal Document:</strong> PDF/DOCX file required</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between text-sm text-gray-500">
                {steps.map((step) => (
                  <div key={step.id} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                      step.id <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.id}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
          <div className="flex justify-center sm:justify-start">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex justify-center sm:justify-end">
            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!isStepValid(currentStep)} className="w-full sm:w-auto">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={submitting || !isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                {submitting ? (
                  <LoadingSpinner text="Submitting..." />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ResearcherLayout>
  )
}

export default function ResearcherSubmitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitPageContent />
    </Suspense>
  )
}
