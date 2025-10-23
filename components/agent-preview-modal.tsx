"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { CheckCircle, XCircle, ExternalLink, MapPin, Phone, Mail, Globe } from "lucide-react"
import ReadMore from "./read-more"
import CollapsibleList from "./collapsible-list"
import DemoAssetsViewer from "./demo-assets-viewer"
import type { AgentAPIResponse } from "../lib/types/admin.types"

// Types for the full agent details API response
type AgentDetailApiResponse = {
  agent?: {
    agent_id: string
    agent_name?: string
    description?: string
    by_persona?: string
    by_value?: string
    asset_type?: string
    demo_link?: string
    demo_preview?: string
    features?: string
    roi?: string
    tags?: string
    by_capability?: string
    service_provider?: string
  }
  capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  deployments?: Array<{
    by_capability_id?: string
    service_id?: string
    by_capability?: string
    service_provider?: string
    service_name?: string
    deployment?: string
    cloud_region?: string
    deployment_id?: string
    capability_name?: string
  }>
  demo_assets?: Array<{ demo_asset_link?: string; demo_link?: string }>
  documentation?: Array<{ 
    agent_id?: string
    sdk_details?: string
    swagger_details?: string
    sample_input?: string
    sample_output?: string
    security_details?: string
    related_files?: string
    doc_id?: string
  }>
  isv_info?: { 
    isv_id?: string
    isv_name?: string
    isv_address?: string
    isv_domain?: string
    isv_mob_no?: string
    isv_email_no?: string
    mou_file_path?: string
    admin_approved?: string
  }
}

interface AgentPreviewModalProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (agent: AgentAPIResponse) => void
  onReject: () => void
}

export function AgentPreviewModal({
  agent,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: AgentPreviewModalProps) {
  const [agentDetails, setAgentDetails] = useState<AgentDetailApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch full agent details when modal opens
  useEffect(() => {
    if (open && agent.agent_id) {
      fetchAgentDetails(agent.agent_id)
    }
  }, [open, agent.agent_id])

  const fetchAgentDetails = async (agentId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details: ${response.statusText}`)
      }
      const data = await response.json()
      setAgentDetails(data)
    } catch (err: any) {
      console.error('Error fetching agent details:', err)
      setError(err.message || 'Failed to fetch agent details')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (approved: "yes" | "no") => {
    if (approved === "yes") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <XCircle className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const ExpandableAddress = ({ address }: { address: string }) => {
    const [expanded, setExpanded] = useState(false)
    const words = address.split(/\s+/)
    const needsToggle = words.length > 8
    const preview = needsToggle ? words.slice(0, 8).join(" ") + "…" : address

    return (
      <div className="text-sm text-muted-foreground">
        <div style={{ whiteSpace: 'pre-line' }}>
          {expanded ? address : preview}
        </div>
        {needsToggle && (
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="mt-1 inline-block text-[14px] font-medium"
            style={{ color: "#155EEF" }}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    )
  }

  // Use agent details if available, otherwise fall back to admin agent data
  const agentData = agentDetails?.agent || agent
  const capabilities = agentDetails?.capabilities || []
  const deployments = agentDetails?.deployments || []
  const demoAssets = agentDetails?.demo_assets || []
  const documentation = agentDetails?.documentation?.[0] || {}
  const isvInfo = agentDetails?.isv_info || {}

  // Parse comma-separated strings into arrays
  const categories = agentData.tags ? agentData.tags.split(',').map(s => s.trim()).filter(Boolean) : []
  const personas = agentData.by_persona ? agentData.by_persona.split(',').map(s => s.trim()).filter(Boolean) : []
  const valueProps = agentData.by_value ? agentData.by_value.split(',').map(s => s.trim()).filter(Boolean) : []
  const features = agentData.features ? agentData.features.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-[95vw] !h-[95vh] !p-0 overflow-hidden !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !rounded-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {agentData.agent_name || 'Unnamed Agent'}
              </DialogTitle>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <span>Agent ID: {agentData.agent_id}</span>
                {isvInfo.isv_name && <span>ISV: {isvInfo.isv_name}</span>}
              </div>
              <div className="mt-2">
                {getStatusBadge(agent.admin_approved)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading agent details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchAgentDetails(agent.agent_id)}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <ReadMore 
                    text={agentData.description || 'No description provided'} 
                    className="text-gray-700"
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personas */}
                  {personas.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Target Personas</h4>
                      <div className="flex flex-wrap gap-2">
                        {personas.map((persona, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {persona}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Value Propositions */}
                  {valueProps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Value Propositions</h4>
                      <div className="flex flex-wrap gap-2">
                        {valueProps.map((value, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="roi">ROI</TabsTrigger>
                    <TabsTrigger value="deployment">Deployment</TabsTrigger>
                    <TabsTrigger value="docs">Docs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Key Features</h4>
                        {features.length > 0 ? (
                          <CollapsibleList items={features} />
                        ) : (
                          <p className="text-gray-500 italic">No features specified</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="roi" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">ROI Information</h4>
                        {agentData.roi ? (
                          <ReadMore text={agentData.roi} className="text-gray-700" />
                        ) : (
                          <p className="text-gray-500 italic">No ROI information provided</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="deployment" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Deployment Options</h4>
                        {deployments.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {deployments.map((deployment, index) => (
                              <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-sm">
                                  {deployment.service_provider} - {deployment.service_name}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-600">
                                  <div className="space-y-2">
                                    <p><strong>Capability:</strong> {deployment.by_capability}</p>
                                    <p><strong>Deployment:</strong> {deployment.deployment}</p>
                                    {deployment.cloud_region && (
                                      <p><strong>Cloud Region:</strong> {deployment.cloud_region}</p>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <p className="text-gray-500 italic">No deployment options available</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="docs" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {documentation.sdk_details && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">SDK Details</h5>
                              <ReadMore text={documentation.sdk_details} className="text-gray-600" />
                            </div>
                          )}
                          {documentation.swagger_details && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">API Documentation</h5>
                              <ReadMore text={documentation.swagger_details} className="text-gray-600" />
                            </div>
                          )}
                          {documentation.sample_input && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Input</h5>
                              <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-800">
                                {documentation.sample_input}
                              </div>
                            </div>
                          )}
                          {documentation.sample_output && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Output</h5>
                              <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-800">
                                {documentation.sample_output}
                              </div>
                            </div>
                          )}
                          {documentation.security_details && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Security Details</h5>
                              <ReadMore text={documentation.security_details} className="text-gray-600" />
                            </div>
                          )}
                          {!documentation.sdk_details && !documentation.swagger_details && 
                           !documentation.sample_input && !documentation.sample_output && 
                           !documentation.security_details && (
                            <p className="text-gray-500 italic">No documentation available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Demo Assets and ISV Info */}
              <div className="space-y-6 lg:col-span-1">
                {/* Demo Assets */}
                {demoAssets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Assets</h3>
                    <DemoAssetsViewer assets={demoAssets} />
                  </div>
                )}

                {/* Demo Link */}
                {agentData.demo_link && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Link</h3>
                    <a
                      href={agentData.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                    </a>
                  </div>
                )}

                {/* ISV Information */}
                {isvInfo.isv_name && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ISV Information</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{isvInfo.isv_name}</h4>
                            <p className="text-sm text-gray-600">ISV ID: {isvInfo.isv_id}</p>
                          </div>
                          
                          {isvInfo.isv_address && (
                            <div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                <ExpandableAddress address={isvInfo.isv_address} />
                              </div>
                            </div>
                          )}
                          
                          {isvInfo.isv_mob_no && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{isvInfo.isv_mob_no}</span>
                            </div>
                          )}
                          
                          {isvInfo.isv_email_no && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{isvInfo.isv_email_no}</span>
                            </div>
                          )}
                          
                          {isvInfo.isv_domain && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a
                                href={`https://${isvInfo.isv_domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {isvInfo.isv_domain}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => onApprove(agent)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
