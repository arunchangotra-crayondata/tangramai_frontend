"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface FormData {
  productName: string
  assetType: string
  description: string
  capabilities: string[]
  targetPersonas: string[]
  businessValues: string[]
  demoLink: string
  documentationLink: string
  demoPreviewUrls: string
}

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

export default function CustomOnboardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    assetType: "",
    description: "",
    capabilities: [],
    targetPersonas: [],
    businessValues: [],
    demoLink: "",
    documentationLink: "",
    demoPreviewUrls: "",
  })

  const steps = [
    { number: 1, title: "Basic Details", label: "Basic Details" },
    { number: 2, title: "Capabilities", label: "Capabilities" },
    { number: 3, title: "Target Personas", label: "Target Personas" },
    { number: 4, title: "Business Value", label: "Business Value" },
    { number: 5, title: "Links & Resources", label: "Links & Resources" },
    { number: 6, title: "Review & Submit", label: "Review & Submit" },
  ]

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as Step)
    } else {
      // Submit and go to success page
      router.push("/onboard/success")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    } else {
      router.back()
    }
  }

  const toggleSelection = (field: "capabilities" | "targetPersonas" | "businessValues", value: string) => {
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
                  <div className="mx-4 h-px flex-1 bg-gray-200">
                    <div
                      className={cn("h-full bg-primary transition-all", currentStep > step.number ? "w-full" : "w-0")}
                    />
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
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Basic Information</h2>
              <p className="mb-8 text-muted-foreground">Let's start with the basics about your AI agent</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="productName">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="Enter your product name"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="assetType">
                    Asset Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select agent asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-agent">AI Agent</SelectItem>
                      <SelectItem value="chatbot">Chatbot</SelectItem>
                      <SelectItem value="workflow">Workflow Automation</SelectItem>
                      <SelectItem value="analytics">Analytics Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">
                    Agent Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Add description about your agent"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Capabilities */}
          {currentStep === 2 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Capabilities</h2>
              <p className="mb-8 text-muted-foreground">What can your AI agent do? Select all that apply</p>

              <div>
                <Label>
                  Select Capabilities <span className="text-red-500">*</span>
                </Label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {capabilities.map((capability) => (
                    <button
                      key={capability.id}
                      onClick={() => toggleSelection("capabilities", capability.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                        formData.capabilities.includes(capability.id)
                          ? "border-primary bg-primary/5"
                          : "border-border bg-white hover:border-primary/50",
                      )}
                    >
                      <span className="text-2xl">{capability.icon}</span>
                      <span className="flex-1 text-sm font-medium">{capability.label}</span>
                      <div
                        className={cn(
                          "h-5 w-5 shrink-0 rounded border-2",
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
            </div>
          )}

          {/* Step 3: Target Personas */}
          {currentStep === 3 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Target Personas</h2>
              <p className="mb-8 text-muted-foreground">Who would benefit most from your AI agent?</p>

              <div>
                <Label>
                  Select Target Personas <span className="text-red-500">*</span>
                </Label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {targetPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => toggleSelection("targetPersonas", persona.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                        formData.targetPersonas.includes(persona.id)
                          ? "border-primary bg-primary/5"
                          : "border-border bg-white hover:border-primary/50",
                      )}
                    >
                      <span className="text-2xl">{persona.icon}</span>
                      <span className="flex-1 text-sm font-medium">{persona.label}</span>
                      <div
                        className={cn(
                          "h-5 w-5 shrink-0 rounded border-2",
                          formData.targetPersonas.includes(persona.id)
                            ? "border-primary bg-primary"
                            : "border-gray-300 bg-white",
                        )}
                      >
                        {formData.targetPersonas.includes(persona.id) && <Check className="h-full w-full text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Business Value */}
          {currentStep === 4 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Business Value</h2>
              <p className="mb-8 text-muted-foreground">What business value does your AI agent provide?</p>

              <div>
                <Label>
                  Select Business Values <span className="text-red-500">*</span>
                </Label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {businessValues.map((value) => (
                    <button
                      key={value.id}
                      onClick={() => toggleSelection("businessValues", value.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                        formData.businessValues.includes(value.id)
                          ? "border-primary bg-primary/5"
                          : "border-border bg-white hover:border-primary/50",
                      )}
                    >
                      <span className="text-2xl">{value.icon}</span>
                      <span className="flex-1 text-sm font-medium">{value.label}</span>
                      <div
                        className={cn(
                          "h-5 w-5 shrink-0 rounded border-2",
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
            </div>
          )}

          {/* Step 5: Links & Resources */}
          {currentStep === 5 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Links & Resources</h2>
              <p className="mb-8 text-muted-foreground">Provide links to demos, documentation, and previews</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="demoLink">Demo Link</Label>
                  <Input
                    id="demoLink"
                    placeholder="Enter your product demo link"
                    value={formData.demoLink}
                    onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="documentationLink">Documentation Link</Label>
                  <Input
                    id="documentationLink"
                    placeholder="Enter your product documentation link"
                    value={formData.documentationLink}
                    onChange={(e) => setFormData({ ...formData, documentationLink: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="demoPreviewUrls">Demo preview URLs (comma-separated)</Label>
                  <Textarea
                    id="demoPreviewUrls"
                    placeholder="Enter your product demo url's"
                    value={formData.demoPreviewUrls}
                    onChange={(e) => setFormData({ ...formData, demoPreviewUrls: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Review & Submit</h2>
              <p className="mb-8 text-muted-foreground">Please review your agent details before submitting</p>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">Product name</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.productName || "Not provided"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Asset type</h3>
                  <div className="rounded-lg border bg-gray-50 px-4 py-3">
                    <span className="text-sm">{formData.assetType || "Not provided"}</span>
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
                  <h3 className="mb-2 font-semibold">Target personas</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.targetPersonas.length > 0 ? (
                      formData.targetPersonas.map((personaId) => {
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
                  <h3 className="mb-2 font-semibold">Business values</h3>
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
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12">
            <Button onClick={handleNext} size="lg" className="bg-black text-white hover:bg-black/90">
              {currentStep === 6 ? "Submit Agent" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
