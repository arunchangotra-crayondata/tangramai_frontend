"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { DemoAssetInput } from "@/components/demo-asset-input"
import { DeploymentOptionInput } from "@/components/deployment-option-input"
import { agentService } from "@/lib/api/agent.service"
import { useAuthStore } from "@/lib/store/auth.store"
import type { AgentFormData, DemoAsset, DeploymentOption } from "@/lib/types/agent.types"

type Step = 1 | 2 | 3 | 4 | 5 | 6

const capabilities = [
  { id: "conversational", label: "Conversational AI & Advisory", icon: "💬" },
  { id: "document", label: "Document Processing & Analysis", icon: "📄" },
  { id: "image", label: "Image Processing", icon: "🖼️" },
  { id: "video", label: "Video Processing", icon: "🎥" },
  { id: "voice", label: "Voice & Meetings", icon: "🎤" },
  { id: "data", label: "Data Analysis & Insights", icon: "📊" },
  { id: "content", label: "Content Generation", icon: "✍️" },
  { id: "automation", label: "Process Automation", icon: "⚙️" },
]

const targetPersonas = [
  { id: "developer", label: "Developer", icon: "👨‍💻" },
  { id: "marketing", label: "Marketing Professional", icon: "📈" },
  { id: "sales", label: "Sales Professional", icon: "💼" },
  { id: "hr", label: "HR Professional", icon: "👥" },
  { id: "finance", label: "Finance Professional", icon: "💰" },
  { id: "customer-service", label: "Customer Service Representative", icon: "💁" },
  { id: "data-analyst", label: "Data Analyst", icon: "📊" },
  { id: "project-manager", label: "Project Manager", icon: "📋" },
  { id: "executive", label: "Executive", icon: "🏢" },
]

const businessValues = [
  { id: "cost-reduction", label: "Cost Reduction", icon: "💰" },
  { id: "efficiency", label: "Efficiency Improvement", icon: "⚡" },
  { id: "revenue", label: "Revenue Generation", icon: "🚀" },
  { id: "compliance", label: "Compliance & Risk Management", icon: "🛡️" },
  { id: "customer-experience", label: "Customer Experience Enhancement", icon: "🤝" },
  { id: "innovation", label: "Innovation & Competitive Advantage", icon: "💡" },
]

const features = [
  { id: "real-time-processing", label: "Real-time Processing", icon: "⚡" },
  { id: "multi-language", label: "Multi-language Support", icon: "🌐" },
  { id: "api-integration", label: "API Integration", icon: "🔗" },
  { id: "customizable", label: "Customizable Workflows", icon: "⚙️" },
  { id: "analytics", label: "Advanced Analytics", icon: "📊" },
  { id: "security", label: "Enterprise Security", icon: "🔒" },
  { id: "scalable", label: "Auto-scaling", icon: "📈" },
  { id: "mobile-ready", label: "Mobile Ready", icon: "📱" },
]

const tags = [
  { id: "ai", label: "AI/ML", icon: "🤖" },
  { id: "automation", label: "Automation", icon: "⚙️" },
  { id: "productivity", label: "Productivity", icon: "📈" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "integration", label: "Integration", icon: "🔗" },
  { id: "cloud", label: "Cloud", icon: "☁️" },
  { id: "enterprise", label: "Enterprise", icon: "🏢" },
  { id: "open-source", label: "Open Source", icon: "📦" },
]

// Dropdown options for forms
const assetTypeOptions = ["Agent", "Solution"]

const serviceProviderOptions = ["AWS", "Azure", "GCP", "Open-Source", "SaaS"]

const serviceNameOptions = [
  "ABBYY FlexiCapture",
  "Amazon Athena",
  "Amazon Chime SDK Amazon Transcribe",
  "Amazon Comprehend",
  "Amazon EMR",
  "Amazon Kendra",
  "Amazon Kinesis Video Streams",
  "Amazon Lex",
  "Amazon Polly",
  "Amazon Redshift",
  "Amazon Rekognition Video",
  "Amazon Textract",
  "Amazon Transcribe",
  "Anthropic Claude",
  "Apache Spark",
  "AssemblyAI",
  "Azure AI Bot Service",
  "Azure AI Document Intelligence",
  "Azure AI Search",
  "Azure AI Speech",
  "Azure AI Video Indexer",
  "Azure Communication Services",
  "Azure Databricks",
  "Azure Media Services",
  "Azure OpenAI Service",
  "Azure Synapse Analytics",
  "BigQuery",
  "Botpress",
  "Camelot",
  "Cloud Speech-to-Text",
  "Cloud Video Intelligence API",
  "Coqui STT",
  "Dask",
  "Databricks (non-AWS)",
  "Dataproc",
  "DeepDoctection",
  "Deepgram Video API",
  "Detectron2",
  "Dialogflow",
  "Diffbot",
  "DocMind AI",
  "DocQuery",
  "Docling",
  "Document AI",
  "Excalibur",
  "GPT-4 Open-Source Variants",
  "Google Meet",
  "Grobid",
  "Haystack",
  "Import.io",
  "LangChain",
  "LayoutLMv3",
  "Media CDN",
  "MediaPipe",
  "Milvus",
  "OpenAI GPT APIs",
  "OpenAI Whisper (open-source variant)",
  "OpenAssistant",
  "OpenCV",
  "OpenSemanticSearch",
  "Pandas",
  "Pinecone",
  "PyTorchVideo",
  "Qdrant",
  "Rasa",
  "Rev.ai",
  "Rossum",
  "Snowflake (multi-cloud)",
  "TableFormer",
  "Tesseract OCR",
  "Vaex",
  "Vertex AI Search and Conversation",
  "Vosk",
  "Weaviate",
  "Zubtitle"
]

const deploymentTypeOptions = ["Cloud", "On-Prem"]

export default function CustomOnboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AgentFormData>({
    // Step 1: Basic Information
    agent_name: "",
    asset_type: "",
    description: "",
    by_value: "",
    features: [],
    tags: [],
    
    // Step 2: Capabilities & Target Audience
    capabilities: [],
    by_persona: [],
    
    // Step 3: Business Value & ROI
    businessValues: [],
    roi: "",
    
    // Step 4: Demo & Documentation
    demo_link: "",
    demo_assets: [],
    sdk_details: "",
    swagger_details: "",
    
    // Step 5: Technical Details
    sample_input: "",
    sample_output: "",
    security_details: "",
    related_files: "",
    deployments: [],
  })

  const steps = [
    { number: 1, title: "Basic Information", label: "Basic Information" },
    { number: 2, title: "Capabilities & Audience", label: "Capabilities & Audience" },
    { number: 3, title: "Business Value", label: "Business Value" },
    { number: 4, title: "Demo & Documentation", label: "Demo & Documentation" },
    { number: 5, title: "Technical Details", label: "Technical Details" },
    { number: 6, title: "Review & Submit", label: "Review & Submit" },
  ]

  const handleNext = async () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as Step)
    } else {
      // Submit the form
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!user?.user_id) {
      setSubmitError("You must be logged in to onboard an agent")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Convert arrays to comma-separated strings
      const apiData = {
        agent_name: formData.agent_name,
        asset_type: formData.asset_type,
        by_persona: formData.by_persona.join(", "),
        by_value: formData.by_value,
        description: formData.description,
        features: formData.features.join(", "),
        roi: formData.roi,
        tags: formData.tags.join(", "),
        demo_link: formData.demo_link,
        isv_id: user.user_id,
        capabilities: formData.capabilities.join(", "),
        demo_assets: JSON.stringify(formData.demo_assets),
        sdk_details: formData.sdk_details,
        swagger_details: formData.swagger_details,
        sample_input: formData.sample_input,
        sample_output: formData.sample_output,
        security_details: formData.security_details,
        related_files: formData.related_files,
        deployments: JSON.stringify(formData.deployments),
      }

      const response = await agentService.onboardAgent(apiData)
      
      if (response.success) {
        router.push("/onboard/success")
      } else {
        setSubmitError(response.message || "Failed to onboard agent")
      }
    } catch (error: any) {
      setSubmitError(error.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    } else {
      router.back()
    }
  }

  const toggleSelection = (field: "capabilities" | "by_persona" | "businessValues" | "features" | "tags", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-[1280px] px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary hover:underline cursor-pointer">Agents</span>
              <span>/</span>
              <span>Custom Onboard Agent</span>
            </div>
            <h1 className="text-2xl font-bold">Onboard New Agent</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-[1280px] px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      currentStep === step.number
                        ? "bg-primary text-white"
                        : currentStep > step.number
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-muted-foreground">Step {step.number}</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        currentStep === step.number ? "text-primary" : "text-gray-600",
                      )}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Basic Information</h2>
              <p className="mb-8 text-muted-foreground">Let's start with the basics about your AI agent</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="agentName">
                    Agent Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="agentName"
                    placeholder="Enter your agent name"
                    value={formData.agent_name}
                    onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="assetType">
                    Asset Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.asset_type}
                    onValueChange={(value) => setFormData({ ...formData, asset_type: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select agent asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypeOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="byValue">
                    Value Proposition <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="byValue"
                    placeholder="Brief value proposition"
                    value={formData.by_value}
                    onChange={(e) => setFormData({ ...formData, by_value: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    Agent Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your agent"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label>
                    Key Features <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => toggleSelection("features", feature.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all",
                          formData.features.includes(feature.id)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50",
                        )}
                      >
                        <span className="text-lg">{feature.icon}</span>
                        <span className="flex-1 text-xs font-medium">{feature.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2",
                            formData.features.includes(feature.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white",
                          )}
                        >
                          {formData.features.includes(feature.id) && (
                            <Check className="h-full w-full text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>
                    Tags <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleSelection("tags", tag.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all",
                          formData.tags.includes(tag.id)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50",
                        )}
                      >
                        <span className="text-lg">{tag.icon}</span>
                        <span className="flex-1 text-xs font-medium">{tag.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2",
                            formData.tags.includes(tag.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white",
                          )}
                        >
                          {formData.tags.includes(tag.id) && (
                            <Check className="h-full w-full text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Capabilities & Target Audience */}
          {currentStep === 2 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Capabilities & Target Audience</h2>
              <p className="mb-8 text-muted-foreground">What can your AI agent do and who would benefit from it?</p>

              <div className="space-y-8">
                <div>
                  <Label>
                    Agent Capabilities <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {capabilities.map((capability) => (
                      <button
                        key={capability.id}
                        type="button"
                        onClick={() => toggleSelection("capabilities", capability.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all",
                          formData.capabilities.includes(capability.id)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50",
                        )}
                      >
                        <span className="text-lg">{capability.icon}</span>
                        <span className="flex-1 text-xs font-medium">{capability.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2",
                            formData.capabilities.includes(capability.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white",
                          )}
                        >
                          {formData.capabilities.includes(capability.id) && (
                            <Check className="h-full w-full text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>
                    Target Personas <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {targetPersonas.map((persona) => (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => toggleSelection("by_persona", persona.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all",
                          formData.by_persona.includes(persona.id)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50",
                        )}
                      >
                        <span className="text-lg">{persona.icon}</span>
                        <span className="flex-1 text-xs font-medium">{persona.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2",
                            formData.by_persona.includes(persona.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white",
                          )}
                        >
                          {formData.by_persona.includes(persona.id) && <Check className="h-full w-full text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Value & ROI */}
          {currentStep === 3 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Business Value & ROI</h2>
              <p className="mb-8 text-muted-foreground">What business value does your AI agent provide?</p>

              <div className="space-y-6">
                <div>
                  <Label>
                    Business Values <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {businessValues.map((value) => (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => toggleSelection("businessValues", value.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 p-2 text-left transition-all",
                          formData.businessValues.includes(value.id)
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50",
                        )}
                      >
                        <span className="text-lg">{value.icon}</span>
                        <span className="flex-1 text-xs font-medium">{value.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2",
                            formData.businessValues.includes(value.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white",
                          )}
                        >
                          {formData.businessValues.includes(value.id) && <Check className="h-full w-full text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="roi">
                    ROI Information <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="roi"
                    placeholder="Expected ROI or benefits"
                    value={formData.roi}
                    onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Demo & Documentation */}
          {currentStep === 4 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Demo & Documentation</h2>
              <p className="mb-8 text-muted-foreground">Provide links to demos, documentation, and SDK details</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="demoLink">Demo Link</Label>
                  <Input
                    id="demoLink"
                    placeholder="https://your-demo-link.com"
                    value={formData.demo_link}
                    onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <DemoAssetInput
                  demoAssets={formData.demo_assets}
                  onChange={(assets) => setFormData({ ...formData, demo_assets: assets })}
                />

                <div>
                  <Label htmlFor="sdkDetails">SDK Details</Label>
                  <Textarea
                    id="sdkDetails"
                    placeholder="SDK installation and usage instructions"
                    value={formData.sdk_details}
                    onChange={(e) => setFormData({ ...formData, sdk_details: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="swaggerDetails">API Documentation (Swagger)</Label>
                  <Input
                    id="swaggerDetails"
                    placeholder="https://your-swagger-docs.com"
                    value={formData.swagger_details}
                    onChange={(e) => setFormData({ ...formData, swagger_details: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Technical Details */}
          {currentStep === 5 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Technical Details</h2>
              <p className="mb-8 text-muted-foreground">Provide technical specifications and deployment information</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="sampleInput">Sample Input</Label>
                  <Textarea
                    id="sampleInput"
                    placeholder="Example input data"
                    value={formData.sample_input}
                    onChange={(e) => setFormData({ ...formData, sample_input: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="sampleOutput">Sample Output</Label>
                  <Textarea
                    id="sampleOutput"
                    placeholder="Example output data"
                    value={formData.sample_output}
                    onChange={(e) => setFormData({ ...formData, sample_output: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="securityDetails">Security Details</Label>
                  <Textarea
                    id="securityDetails"
                    placeholder="Security considerations and best practices"
                    value={formData.security_details}
                    onChange={(e) => setFormData({ ...formData, security_details: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="relatedFiles">Related Files</Label>
                  <Textarea
                    id="relatedFiles"
                    placeholder="Links to related files, documentation, etc."
                    value={formData.related_files}
                    onChange={(e) => setFormData({ ...formData, related_files: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <DeploymentOptionInput
                  deployments={formData.deployments}
                  onChange={(deployments) => setFormData({ ...formData, deployments })}
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Review & Submit</h2>
              <p className="mb-8 text-muted-foreground">Please review your agent details before submitting</p>

              {submitError && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">Agent Name</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.agent_name || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Asset Type</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.asset_type || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Value Proposition</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.by_value || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.description || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.length > 0 ? (
                      formData.features.map((featureId) => {
                        const feature = features.find((f) => f.id === featureId)
                        return (
                          <span
                            key={featureId}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
                          >
                            <span>{feature?.icon}</span>
                            <span>{feature?.label}</span>
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No features selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId)
                        return (
                          <span
                            key={tagId}
                            className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm"
                          >
                            <span>{tag?.icon}</span>
                            <span>{tag?.label}</span>
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.capabilities.length > 0 ? (
                      formData.capabilities.map((capId) => {
                        const cap = capabilities.find((c) => c.id === capId)
                        return (
                          <span
                            key={capId}
                            className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-sm"
                          >
                            <span>{cap?.icon}</span>
                            <span>{cap?.label}</span>
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No capabilities selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Target Personas</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.by_persona.length > 0 ? (
                      formData.by_persona.map((personaId) => {
                        const persona = targetPersonas.find((p) => p.id === personaId)
                        return (
                          <span
                            key={personaId}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                          >
                            <span>{persona?.icon}</span>
                            <span>{persona?.label}</span>
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No personas selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Business Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.businessValues.length > 0 ? (
                      formData.businessValues.map((valueId) => {
                        const value = businessValues.find((v) => v.id === valueId)
                        return (
                          <span
                            key={valueId}
                            className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm"
                          >
                            <span>{value?.icon}</span>
                            <span>{value?.label}</span>
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No business values selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">ROI Information</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.roi || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Demo Assets</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    {formData.demo_assets.length > 0 ? (
                      <div className="space-y-2">
                        {formData.demo_assets.map((asset, index) => (
                          <div key={index} className="text-sm">
                            <strong>{asset.asset_name}</strong> ({asset.asset_type}) - {asset.link}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No demo assets provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Deployment Options</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    {formData.deployments.length > 0 ? (
                      <div className="space-y-2">
                        {formData.deployments.map((deployment, index) => (
                          <div key={index} className="text-sm">
                            <strong>{deployment.service_name}</strong> on {deployment.service_provider} 
                            ({deployment.deployment_type}, {deployment.cloud_region}) - {deployment.capability}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No deployment options provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12">
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="bg-black text-white hover:bg-black/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : currentStep === 6 ? "Submit Agent" : "Next"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
