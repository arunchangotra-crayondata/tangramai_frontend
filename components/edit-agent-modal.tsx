"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useToast } from "../hooks/use-toast"
import { agentService } from "../lib/api/agent.service"
import type { AgentAPIResponse } from "../lib/types/admin.types"
import { Save, AlertCircle } from "lucide-react"

interface EditAgentModalProps {
  agent: AgentAPIResponse
  agentDetails?: {
    agent?: {
      agent_id?: string
      agent_name?: string
      description?: string
      by_persona?: string
      by_value?: string
      asset_type?: string
      demo_link?: string
      features?: string
      roi?: string
      tags?: string
    }
    documentation?: Array<{
      sdk_details?: string
      swagger_details?: string
      sample_input?: string
      sample_output?: string
      security_details?: string
      related_files?: string
    }>
    demo_assets?: Array<{ demo_asset_link?: string; demo_link?: string }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditAgentModal({
  agent,
  agentDetails,
  open,
  onOpenChange,
  onSuccess,
}: EditAgentModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Form state - initialize with existing agent data
  const [formData, setFormData] = useState({
    agent_name: '',
    asset_type: '',
    description: '',
    by_persona: '',
    by_value: '',
    features: '',
    tags: '',
    roi: '',
    demo_link: '',
    demo_links: '',
    sdk_details: '',
    swagger_details: '',
    sample_input: '',
    sample_output: '',
    security_details: '',
    related_files: '',
    application_demo_url: '',
    agents_ordering: '',
    deployments: '',
    demo_assets: '',
  })

  // File state
  const [demoFiles, setDemoFiles] = useState<File[]>([])

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && agent) {
      const agentData = agentDetails?.agent || agent
      const docs = agentDetails?.documentation?.[0] || {}
      
      // Parse comma-separated strings
      const featuresArray = agentData.features?.split(',').map(s => s.trim()).filter(Boolean) || []
      const tagsArray = agentData.tags?.split(',').map(s => s.trim()).filter(Boolean) || []
      const personaArray = agentData.by_persona?.split(',').map(s => s.trim()).filter(Boolean) || []
      const valueArray = agentData.by_value?.split(',').map(s => s.trim()).filter(Boolean) || []
      
      // Combine demo assets links
      const demoAssetLinks = agentDetails?.demo_assets?.map(a => a.demo_link || a.demo_asset_link).filter(Boolean).join(',') || ''

      setFormData({
        agent_name: agentData.agent_name || '',
        asset_type: agentData.asset_type || '',
        description: agentData.description || '',
        by_persona: personaArray.join(', '),
        by_value: valueArray.join(', '),
        features: featuresArray.join(', '),
        tags: tagsArray.join(', '),
        roi: agentData.roi || '',
        demo_link: agentData.demo_link || '',
        demo_links: demoAssetLinks,
        sdk_details: docs.sdk_details || '',
        swagger_details: docs.swagger_details || '',
        sample_input: docs.sample_input || '',
        sample_output: docs.sample_output || '',
        security_details: docs.security_details || '',
        related_files: docs.related_files || '',
        application_demo_url: agentData.demo_link || '',
        agents_ordering: '',
        deployments: '',
        demo_assets: '',
      })
      setDemoFiles([])
      setErrors({})
    }
  }, [open, agent, agentDetails])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.agent_name?.trim()) {
      newErrors.agent_name = 'Agent name is required'
    }

    if (!formData.asset_type?.trim()) {
      newErrors.asset_type = 'Asset type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const formDataObj = new FormData()

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataObj.append(key, String(value))
        } else {
          // Send empty string for optional fields
          formDataObj.append(key, '')
        }
      })

      // Add ISV ID
      formDataObj.append('isv_id', agent.isv_id || '')

      // Add demo files if any
      if (demoFiles.length > 0) {
        demoFiles.forEach((file) => {
          formDataObj.append('demo_files', file)
        })
      }

      const response = await agentService.updateAgent(agent.agent_id, formDataObj)
      
      toast({
        title: "Success",
        description: response.message || "Agent updated successfully.",
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDemoFiles(Array.from(e.target.files))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent: {agent.agent_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agent_name">
                  Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agent_name"
                  value={formData.agent_name}
                  onChange={(e) => handleInputChange("agent_name", e.target.value)}
                  placeholder="Enter agent name"
                  className={errors.agent_name ? "border-red-500" : ""}
                />
                {errors.agent_name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.agent_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="asset_type">
                  Asset Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="asset_type"
                  value={formData.asset_type}
                  onChange={(e) => handleInputChange("asset_type", e.target.value)}
                  placeholder="Enter asset type"
                  className={errors.asset_type ? "border-red-500" : ""}
                />
                {errors.asset_type && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.asset_type}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter agent description"
                rows={4}
              />
            </div>
          </div>

          {/* Target Audience & Value */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Target Audience & Value</h3>
            
            <div>
              <Label htmlFor="by_persona">Target Personas (comma-separated)</Label>
              <Input
                id="by_persona"
                value={formData.by_persona}
                onChange={(e) => handleInputChange("by_persona", e.target.value)}
                placeholder="e.g., Developer, Manager, Executive"
              />
            </div>

            <div>
              <Label htmlFor="by_value">Value Propositions (comma-separated)</Label>
              <Input
                id="by_value"
                value={formData.by_value}
                onChange={(e) => handleInputChange("by_value", e.target.value)}
                placeholder="e.g., Cost Savings, Efficiency, Innovation"
              />
            </div>

            <div>
              <Label htmlFor="features">Key Features (comma-separated)</Label>
              <Input
                id="features"
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                placeholder="e.g., Feature 1, Feature 2, Feature 3"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="e.g., AI, Automation, Analytics"
              />
            </div>
          </div>

          {/* Demo & Documentation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Demo & Documentation</h3>
            
            <div>
              <Label htmlFor="demo_link">Demo Link</Label>
              <Input
                id="demo_link"
                value={formData.demo_link}
                onChange={(e) => handleInputChange("demo_link", e.target.value)}
                placeholder="https://example.com/demo"
              />
            </div>

            <div>
              <Label htmlFor="demo_links">Demo Asset Links (comma-separated URLs)</Label>
              <Input
                id="demo_links"
                value={formData.demo_links}
                onChange={(e) => handleInputChange("demo_links", e.target.value)}
                placeholder="https://example.com/asset1, https://example.com/asset2"
              />
            </div>

            <div>
              <Label htmlFor="demo_files">Demo Files</Label>
              <div className="mt-2">
                <Input
                  id="demo_files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {demoFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {demoFiles.length} file(s) selected
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="roi">ROI Information</Label>
              <Textarea
                id="roi"
                value={formData.roi}
                onChange={(e) => handleInputChange("roi", e.target.value)}
                placeholder="Enter ROI information"
                rows={3}
              />
            </div>
          </div>

          {/* Technical Documentation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technical Documentation</h3>
            
            <div>
              <Label htmlFor="sdk_details">SDK Details</Label>
              <Textarea
                id="sdk_details"
                value={formData.sdk_details}
                onChange={(e) => handleInputChange("sdk_details", e.target.value)}
                placeholder="Enter SDK details"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="swagger_details">Swagger/API Documentation</Label>
              <Textarea
                id="swagger_details"
                value={formData.swagger_details}
                onChange={(e) => handleInputChange("swagger_details", e.target.value)}
                placeholder="Enter API documentation details"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sample_input">Sample Input</Label>
                <Textarea
                  id="sample_input"
                  value={formData.sample_input}
                  onChange={(e) => handleInputChange("sample_input", e.target.value)}
                  placeholder="Enter sample input"
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="sample_output">Sample Output</Label>
                <Textarea
                  id="sample_output"
                  value={formData.sample_output}
                  onChange={(e) => handleInputChange("sample_output", e.target.value)}
                  placeholder="Enter sample output"
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="security_details">Security Details</Label>
              <Textarea
                id="security_details"
                value={formData.security_details}
                onChange={(e) => handleInputChange("security_details", e.target.value)}
                placeholder="Enter security details"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="related_files">Related Files</Label>
              <Input
                id="related_files"
                value={formData.related_files}
                onChange={(e) => handleInputChange("related_files", e.target.value)}
                placeholder="Enter related files information"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black hover:bg-black/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Agent
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
