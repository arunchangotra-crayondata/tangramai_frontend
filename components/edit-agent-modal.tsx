"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { ArrowLeft, ArrowRight, Check, ChevronRight, X, Upload, FileText, Image as ImageIcon, Save, Plus } from "lucide-react"
import { cn } from "../lib/utils"
import { MultiSelectInput } from "./multi-select-input"
import { DropdownWithCustom } from "./dropdown-with-custom"
import { useToast } from "../hooks/use-toast"
import { agentService } from "../lib/api/agent.service"
import type { AgentAPIResponse } from "../lib/types/admin.types"

type Step = 1 | 2 | 3 | 4

// Predefined options (same as onboarding)
const tagOptions = [
  "AI/ML", "Automation", "Productivity", "Analytics", "Integration", 
  "Cloud", "Enterprise", "Open Source", "Machine Learning", "Deep Learning",
  "Natural Language Processing", "Computer Vision", "Robotics", "IoT"
]

const targetPersonaOptions = [
  "Developer", "Marketing Professional", "Sales Professional", "HR Professional",
  "Finance Professional", "Customer Service Representative", "Data Analyst",
  "Project Manager", "Executive", "Product Manager", "Designer", "Researcher"
]

const keyFeatureOptions = [
  "Real-time Processing", "Multi-language Support", "API Integration", 
  "Customizable Workflows", "Advanced Analytics", "Enterprise Security",
  "Auto-scaling", "Mobile Ready", "Cloud Native", "On-premise Deployment"
]

const capabilityOptions = [
  "Conversational AI & Advisory", "Document Processing & Analysis", "Image Processing",
  "Video Processing", "Voice & Meetings", "Data Analysis & Insights", 
  "Content Generation", "Process Automation", "Predictive Analytics", "Machine Learning"
]

const agentTypeOptions = ["Agent", "Solution", "Platform", "Tool", "Service"]
const valuePropositionOptions = ["Analytics", "Customer Experience", "Data", "Productivity"]

const serviceProviderOptions = ["AWS", "Azure", "GCP", "Open-Source", "SaaS"]
const serviceNameOptions = [
  "ABBYY FlexiCapture", "Amazon Athena", "Amazon Chime SDK Amazon Transcribe",
  "Amazon Comprehend", "Amazon EMR", "Amazon Kendra", "Amazon Kinesis Video Streams",
  "Amazon Lex", "Amazon Polly", "Amazon Redshift", "Amazon Rekognition Video",
  "Amazon Textract", "Amazon Transcribe", "Anthropic Claude", "Apache Spark",
  "AssemblyAI", "Azure AI Bot Service", "Azure AI Document Intelligence",
  "Azure AI Search", "Azure AI Speech", "Azure AI Video Indexer",
  "Azure Communication Services", "Azure Databricks", "Azure Media Services",
  "Azure OpenAI Service", "Azure Synapse Analytics", "BigQuery", "Botpress",
  "Camelot", "Cloud Speech-to-Text", "Cloud Video Intelligence API",
  "Coqui STT", "Dask", "Databricks (non-AWS)", "Dataproc", "DeepDoctection",
  "Deepgram Video API", "Detectron2", "Dialogflow", "Diffbot", "DocMind AI",
  "DocQuery", "Docling", "Document AI", "Excalibur", "GPT-4 Open-Source Variants",
  "Google Meet", "Grobid", "Haystack", "Import.io", "LangChain", "LayoutLMv3",
  "Media CDN", "MediaPipe", "Milvus", "OpenAI GPT APIs", "OpenAI Whisper (open-source variant)",
  "OpenAssistant", "OpenCV", "OpenSemanticSearch", "Pandas", "Pinecone",
  "PyTorchVideo", "Qdrant", "Rasa", "Rev.ai", "Rossum", "Snowflake (multi-cloud)",
  "TableFormer", "Tesseract OCR", "Vaex", "Vertex AI Search and Conversation",
  "Vosk", "Weaviate", "Zubtitle"
]
const deploymentTypeOptions = ["Cloud", "On-Prem", "Hybrid", "Edge", "Serverless"]

interface FileWithPreview {
  file: File
  name: string
  size: number
  type: string
  previewUrl?: string
}

interface DeploymentOption {
  serviceProvider: string
  serviceName: string
  deploymentType: string
  cloudRegion: string
  capability: string
}

interface FormData {
  agentName: string
  agentDescription: string
  agentType: string
  tags: string[]
  targetPersonas: string[]
  keyFeatures: string[]
  valueProposition: string
  roiInformation: string
  demoLink: string
  coreCapabilities: string[]
  demoLinks: string[]
  bulkFiles: FileWithPreview[]
  sdkDetails: string
  apiDocumentation: string
  sampleInput: string
  sampleOutput: string
  securityDetails: string
  readmeFile: File | null
  additionalRelatedFiles: string
  deploymentOptions: DeploymentOption[]
}

interface EditAgentModalProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function EditAgentModal({ agent, open, onOpenChange, onSave }: EditAgentModalProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    agentDescription: "",
    agentType: "",
    tags: [],
    targetPersonas: [],
    keyFeatures: [],
    valueProposition: "",
    roiInformation: "",
    demoLink: "",
    coreCapabilities: [],
    demoLinks: [],
    bulkFiles: [],
    sdkDetails: "",
    apiDocumentation: "",
    sampleInput: "",
    sampleOutput: "",
    securityDetails: "",
    readmeFile: null,
    additionalRelatedFiles: "",
    deploymentOptions: [],
  })

  const steps = [
    { number: 1, title: "Agent Details", label: "Agent Details" },
    { number: 2, title: "Capabilities", label: "Capabilities" },
    { number: 3, title: "Demo Assets", label: "Demo Assets" },
    { number: 4, title: "Documentation", label: "Documentation" },
  ]

  // Reset step when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
      setIsSaving(false)
    }
  }, [open])

  // Fetch agent details and populate form
  useEffect(() => {
    if (open && agent?.agent_id) {
      fetchAgentDetails()
    }
  }, [open, agent?.agent_id])

  const fetchAgentDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://agents-store.onrender.com/api/agents/${agent.agent_id}`, {
        cache: "no-store"
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details: ${response.statusText}`)
      }
      const data = await response.json()
      
      // Populate form data from agent details
      if (data?.agent) {
        const agentData = data.agent
        setFormData(prev => ({
          ...prev,
          agentName: agentData.agent_name || "",
          agentDescription: agentData.description || "",
          agentType: agentData.asset_type || "",
          tags: agentData.tags ? agentData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          targetPersonas: agentData.by_persona ? agentData.by_persona.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
          keyFeatures: agentData.features ? agentData.features.split(/[,;\n]+/).map((f: string) => f.trim()).filter(Boolean) : [],
          valueProposition: agentData.by_value || "",
          roiInformation: agentData.roi || "",
          demoLink: agentData.demo_link || "",
          coreCapabilities: data.capabilities?.map((c: any) => c.by_capability || '').filter(Boolean) || [],
          demoLinks: data.demo_assets?.map((a: any) => a.demo_link || a.demo_asset_link).filter(Boolean) || [],
          bulkFiles: [],
          sdkDetails: data.documentation?.[0]?.sdk_details || "",
          apiDocumentation: data.documentation?.[0]?.swagger_details || "",
          sampleInput: data.documentation?.[0]?.sample_input || "",
          sampleOutput: data.documentation?.[0]?.sample_output || "",
          securityDetails: data.documentation?.[0]?.security_details || "",
          readmeFile: null,
          additionalRelatedFiles: data.documentation?.[0]?.related_files || "",
          deploymentOptions: data.deployments?.map((d: any) => ({
            serviceProvider: d.service_provider || "",
            serviceName: d.service_name || "",
            deploymentType: d.deployment || "",
            cloudRegion: d.cloud_region || "",
            capability: d.by_capability || d.capability_name || "",
          })) || [],
        }))
      } else {
        // If no agent data, show error
        toast({
          title: "Error",
          description: "Agent data not found",
          variant: "destructive"
        })
      }
    } catch (err: any) {
      console.error('Error fetching agent details:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to load agent details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    } else {
      handleSave()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleTabClick = (stepNumber: number) => {
    setCurrentStep(stepNumber as Step)
  }

  const handleBulkFileUpload = (files: FileList) => {
    const newFiles: FileWithPreview[] = Array.from(files).map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))
    
    setFormData(prev => ({ 
      ...prev, 
      bulkFiles: [...prev.bulkFiles, ...newFiles] 
    }))
  }

  const removeBulkFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.bulkFiles]
      const removedFile = newFiles[index]
      if (removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl)
      }
      newFiles.splice(index, 1)
      return { ...prev, bulkFiles: newFiles }
    })
  }

  const handleReadmeFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, readmeFile: file }))
  }

  const addDemoLink = () => {
    setFormData(prev => ({ ...prev, demoLinks: [...prev.demoLinks, ""] }))
  }

  const updateDemoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.map((link, i) => i === index ? value : link)
    }))
  }

  const removeDemoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.filter((_, i) => i !== index)
    }))
  }

  const addDeploymentOption = () => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: [...prev.deploymentOptions, {
        serviceProvider: "",
        serviceName: "",
        deploymentType: "",
        cloudRegion: "",
        capability: "",
      }]
    }))
  }

  const updateDeploymentOption = (index: number, field: keyof DeploymentOption, value: string) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const removeDeploymentOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formDataObj = new FormData()

      // Add all text fields
      formDataObj.append('agent_name', formData.agentName || '')
      formDataObj.append('asset_type', formData.agentType || '')
      formDataObj.append('description', formData.agentDescription || '')
      formDataObj.append('by_persona', formData.targetPersonas.join(',') || '')
      formDataObj.append('by_value', formData.valueProposition || '')
      formDataObj.append('features', formData.keyFeatures.join(',') || '')
      formDataObj.append('tags', formData.tags.join(',') || '')
      formDataObj.append('roi', formData.roiInformation || '')
      formDataObj.append('demo_link', formData.demoLink || '')
      formDataObj.append('demo_assets', formData.demoLinks.join(',') || '')
      formDataObj.append('capabilities', formData.coreCapabilities.join(',') || '')
      formDataObj.append('sdk_details', formData.sdkDetails || '')
      formDataObj.append('swagger_details', formData.apiDocumentation || '')
      formDataObj.append('sample_input', formData.sampleInput || '')
      formDataObj.append('sample_output', formData.sampleOutput || '')
      formDataObj.append('security_details', formData.securityDetails || '')
      formDataObj.append('related_files', formData.additionalRelatedFiles || '')
      formDataObj.append('deployments', JSON.stringify(formData.deploymentOptions))
      formDataObj.append('isv_id', agent.isv_id || '')

      // Add file uploads
      if (formData.bulkFiles.length > 0) {
        formData.bulkFiles.forEach((fileWithPreview) => {
          formDataObj.append('demo_files', fileWithPreview.file)
        })
      }

      if (formData.readmeFile) {
        formDataObj.append('readme_file', formData.readmeFile)
      }

      const response = await agentService.updateAgent(agent.agent_id, formDataObj)
      
      toast({
        title: "Success",
        description: response.message || "Agent updated successfully.",
      })

      if (onSave) {
        onSave()
      }
      
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1400px] !w-[95vw] !max-h-[90vh] !p-0 overflow-hidden flex flex-col !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !rounded-xl">
        <DialogHeader className="px-6 md:px-8 py-5 border-b bg-white sticky top-0 z-10">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900">Edit Agent</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Update your agent information step by step</p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
          {/* Progress Steps */}
          <div className="border-b bg-white px-4 md:px-8 py-5 sticky top-[0px] z-10">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-1 items-center min-w-[120px]">
                  <button
                    onClick={() => handleTabClick(step.number)}
                    className="flex flex-1 items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity group"
                    disabled={isSaving}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-sm font-semibold transition-all shrink-0",
                        currentStep === step.number
                          ? "bg-black text-white shadow-md scale-105"
                          : currentStep > step.number
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-gray-200 text-gray-500 group-hover:bg-gray-300",
                      )}
                    >
                      {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <div className="text-xs text-gray-500 font-medium">Step {step.number}</div>
                      <div
                        className={cn(
                          "text-sm font-semibold truncate",
                          currentStep === step.number ? "text-black" : "text-gray-600",
                        )}
                      >
                        {step.label}
                      </div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="mx-2 md:mx-4 flex items-center shrink-0">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-8 md:py-10">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading agent details...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 lg:p-10">
                  {/* Step 1: Agent Details */}
                  {currentStep === 1 && (
                    <div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Agent Details</h2>
                        <p className="text-gray-600">Let's start with the basics about your AI agent</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                          <Label htmlFor="agentName" className="text-base font-semibold text-gray-900">
                            Agent Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="agentName"
                            placeholder="Enter your agent name"
                            value={formData.agentName}
                            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                            className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="agentDescription" className="text-base font-semibold text-gray-900">
                            Agent Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="agentDescription"
                            placeholder="Detailed description of your agent"
                            value={formData.agentDescription}
                            onChange={(e) => setFormData({ ...formData, agentDescription: e.target.value })}
                            className="min-h-[140px] text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                          />
                        </div>

                        <DropdownWithCustom
                          label="Agent Type"
                          value={formData.agentType}
                          onChange={(value) => setFormData({ ...formData, agentType: value })}
                          options={agentTypeOptions}
                          placeholder="Select agent type"
                          required
                        />

                        <MultiSelectInput
                          label="Tags"
                          value={formData.tags}
                          onChange={(value) => setFormData({ ...formData, tags: value })}
                          options={tagOptions}
                          placeholder="Select or add tags"
                        />

                        <MultiSelectInput
                          label="Target Personas"
                          value={formData.targetPersonas}
                          onChange={(value) => setFormData({ ...formData, targetPersonas: value })}
                          options={targetPersonaOptions}
                          placeholder="Select target personas"
                        />

                        <MultiSelectInput
                          label="Key Features"
                          value={formData.keyFeatures}
                          onChange={(value) => setFormData({ ...formData, keyFeatures: value })}
                          options={keyFeatureOptions}
                          placeholder="Select key features"
                        />

                        <DropdownWithCustom
                          label="Value Proposition"
                          value={formData.valueProposition}
                          onChange={(value) => setFormData({ ...formData, valueProposition: value })}
                          options={valuePropositionOptions}
                          placeholder="Select value proposition"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-2">
                            <Label htmlFor="roiInformation" className="text-base font-semibold text-gray-900">
                              ROI Information
                            </Label>
                            <Input
                              id="roiInformation"
                              placeholder="Expected ROI or benefits"
                              value={formData.roiInformation}
                              onChange={(e) => setFormData({ ...formData, roiInformation: e.target.value })}
                              className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="demoLink" className="text-base font-semibold text-gray-900">
                              Demo Link
                            </Label>
                            <Input
                              id="demoLink"
                              placeholder="https://your-demo-link.com"
                              value={formData.demoLink}
                              onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                              className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Capabilities */}
                  {currentStep === 2 && (
                    <div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Capabilities</h2>
                        <p className="text-gray-600">What can your AI agent do and what technical features does it offer?</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <MultiSelectInput
                          label="Core Capabilities"
                          value={formData.coreCapabilities}
                          onChange={(value) => setFormData({ ...formData, coreCapabilities: value })}
                          options={capabilityOptions}
                          placeholder="Select core capabilities"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Demo Assets */}
                  {currentStep === 3 && (
                    <div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Demo Assets</h2>
                        <p className="text-gray-600">Provide demo links and upload demo files</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                          <Label className="text-base font-semibold text-gray-900">Demo Links</Label>
                          <div className="space-y-3">
                            {formData.demoLinks.map((link, index) => (
                              <div key={index} className="flex gap-3">
                                <Input
                                  placeholder="https://your-demo-link.com"
                                  value={link}
                                  onChange={(e) => updateDemoLink(index, e.target.value)}
                                  className="flex-1 h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeDemoLink(index)}
                                  className="h-11 w-11 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addDemoLink}
                              className="w-full h-11 border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Demo Link
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-base font-semibold text-gray-900">Bulk File Upload</Label>
                          <div>
                            <input
                              ref={bulkFileInputRef}
                              type="file"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files
                                if (files) handleBulkFileUpload(files)
                              }}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => bulkFileInputRef.current?.click()}
                              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                            >
                              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                              <p className="text-sm font-medium text-gray-700 mb-1">Click to upload multiple files</p>
                              <p className="text-xs text-gray-500">Maximum 50MB per file</p>
                            </button>
                          </div>

                          {formData.bulkFiles.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <Label className="text-sm font-semibold text-gray-700">Uploaded Files ({formData.bulkFiles.length})</Label>
                              <div className="grid gap-3">
                                {formData.bulkFiles.map((fileWithPreview, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                                  >
                                    {fileWithPreview.previewUrl ? (
                                      <img
                                        src={fileWithPreview.previewUrl}
                                        alt={fileWithPreview.name}
                                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 border border-gray-300">
                                        {fileWithPreview.type.startsWith('image/') ? (
                                          <ImageIcon className="h-6 w-6 text-gray-600" />
                                        ) : (
                                          <FileText className="h-6 w-6 text-gray-600" />
                                        )}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {fileWithPreview.name}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {(fileWithPreview.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeBulkFile(index)}
                                      className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Documentation */}
                  {currentStep === 4 && (
                    <div>
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Documentation</h2>
                        <p className="text-gray-600">Provide technical documentation and deployment information</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                          <Label htmlFor="sdkDetails" className="text-base font-semibold text-gray-900">
                            SDK Details <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="sdkDetails"
                            placeholder="SDK installation and usage instructions"
                            value={formData.sdkDetails}
                            onChange={(e) => setFormData({ ...formData, sdkDetails: e.target.value })}
                            className="min-h-[140px] text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="apiDocumentation" className="text-base font-semibold text-gray-900">
                            API Documentation (Swagger) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="apiDocumentation"
                            placeholder="https://your-swagger-docs.com"
                            value={formData.apiDocumentation}
                            onChange={(e) => setFormData({ ...formData, apiDocumentation: e.target.value })}
                            className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-2">
                            <Label htmlFor="sampleInput" className="text-base font-semibold text-gray-900">
                              Sample Input <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="sampleInput"
                              placeholder="Example input data"
                              value={formData.sampleInput}
                              onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                              className="min-h-[140px] font-mono text-sm border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sampleOutput" className="text-base font-semibold text-gray-900">
                              Sample Output <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="sampleOutput"
                              placeholder="Example output data"
                              value={formData.sampleOutput}
                              onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                              className="min-h-[140px] font-mono text-sm border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="securityDetails" className="text-base font-semibold text-gray-900">
                            Security Details <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="securityDetails"
                            placeholder="Security considerations and best practices"
                            value={formData.securityDetails}
                            onChange={(e) => setFormData({ ...formData, securityDetails: e.target.value })}
                            className="min-h-[140px] text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-base font-semibold text-gray-900">README File Upload</Label>
                          <div>
                            <input
                              ref={readmeFileInputRef}
                              type="file"
                              accept=".md,.txt,.pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleReadmeFileUpload(file)
                              }}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => readmeFileInputRef.current?.click()}
                              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                            >
                              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                {formData.readmeFile ? formData.readmeFile.name : "Click to upload README file"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Markdown, Text, PDF, DOC, DOCX (max 10MB)
                              </p>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalRelatedFiles" className="text-base font-semibold text-gray-900">
                            Additional Related Files (Links)
                          </Label>
                          <Textarea
                            id="additionalRelatedFiles"
                            placeholder="Links to additional documentation, guides, or resources (separate from uploaded files)"
                            value={formData.additionalRelatedFiles}
                            onChange={(e) => setFormData({ ...formData, additionalRelatedFiles: e.target.value })}
                            className="min-h-[140px] text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black resize-none"
                          />
                        </div>

                        {/* Deployment Options */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                            <Label className="text-base font-semibold text-gray-900">Deployment Options</Label>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addDeploymentOption}
                              className="h-9 text-green-600 border-green-600 hover:bg-green-50 hover:border-green-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Deployment Option
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {formData.deploymentOptions.map((option, index) => (
                              <div key={index} className="rounded-lg border-2 border-gray-200 bg-gray-50 p-5 md:p-6">
                                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
                                  <h4 className="font-semibold text-gray-900">Deployment Option {index + 1}</h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDeploymentOption(index)}
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <DropdownWithCustom
                                    label="Service Provider"
                                    value={option.serviceProvider}
                                    onChange={(value) => updateDeploymentOption(index, 'serviceProvider', value)}
                                    options={serviceProviderOptions}
                                    placeholder="e.g., AWS, Azure, Google Cloud"
                                  />

                                  <DropdownWithCustom
                                    label="Service Name"
                                    value={option.serviceName}
                                    onChange={(value) => updateDeploymentOption(index, 'serviceName', value)}
                                    options={serviceNameOptions}
                                    placeholder="Service name"
                                  />

                                  <DropdownWithCustom
                                    label="Deployment Type"
                                    value={option.deploymentType}
                                    onChange={(value) => updateDeploymentOption(index, 'deploymentType', value)}
                                    options={deploymentTypeOptions}
                                    placeholder="e.g., Docker, Kubernetes"
                                  />

                                  <div className="space-y-2">
                                    <Label htmlFor={`cloudRegion-${index}`} className="text-sm font-semibold text-gray-900">
                                      Cloud Region
                                    </Label>
                                    <Input
                                      id={`cloudRegion-${index}`}
                                      placeholder="e.g., us-east-1, eu-west-1"
                                      value={option.cloudRegion}
                                      onChange={(e) => updateDeploymentOption(index, 'cloudRegion', e.target.value)}
                                      className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                                    />
                                  </div>

                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor={`capability-${index}`} className="text-sm font-semibold text-gray-900">
                                      Capability
                                    </Label>
                                    <Input
                                      id={`capability-${index}`}
                                      placeholder="Related capability"
                                      value={option.capability}
                                      onChange={(e) => updateDeploymentOption(index, 'capability', e.target.value)}
                                      className="h-11 text-base border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            {formData.deploymentOptions.length === 0 && (
                              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="font-medium mb-1">No deployment options added yet</p>
                                <p className="text-sm">Click "Add Deployment Option" to get started</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5 border-t bg-white sticky bottom-0 z-10 shadow-sm">
            <div className="flex items-center justify-between w-full gap-4">
              <Button 
                onClick={handleBack} 
                variant="outline"
                size="lg"
                disabled={currentStep === 1 || isSaving}
                className="h-11 px-6 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext} 
                size="lg" 
                className="bg-black text-white hover:bg-black/90 h-11 px-8 font-semibold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? "Save Changes" : "Next"}
                    {currentStep !== 4 && <ArrowRight className="ml-2 h-4 w-4" />}
                    {currentStep === 4 && <Save className="ml-2 h-4 w-4" />}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
