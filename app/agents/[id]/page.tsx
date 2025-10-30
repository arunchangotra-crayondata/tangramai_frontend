import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent } from "../../../components/ui/card"
import { ChevronLeft, ChevronRight, Code, Lock, ExternalLink, FileText } from "lucide-react"
import DemoAssetsViewer from "../../../components/demo-assets-viewer"
import ReadMore from "../../../components/read-more"
import CollapsibleList from "../../../components/collapsible-list"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { readFileSync } from "fs"
import { join } from "path"
import ExpandableAddress from "../../../components/expandable-address"
import ScrollToTop from "../../../components/scroll-to-top"

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

async function fetchAgentDetail(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data: AgentDetailApiResponse = await res.json()
    // Check if agent is approved before returning
    if (data?.agent) {
      // Fetch agent list to check approval status
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        // Only return data if agent is approved
        if (agentInList?.admin_approved === "yes") {
          return data
        }
      }
    }
    // Return null if not approved or not found
    return null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return null
  }
}

function readReadmeFile(): string {
  try {
    const readmePath = join(process.cwd(), 'README.md')
    return readFileSync(readmePath, 'utf8')
  } catch (err) {
    console.error('Error reading README.md:', err)
    return '# Documentation\n\nDocumentation content is not available at this time.'
  }
}

function formatCodeBlock(content: string): string {
  // Enhanced markdown formatter
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text'
      return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto border"><code class="language-${language}">${code.trim()}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
    .replace(/(?<!>)$/gm, '</p>')
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchAgentDetail(id)
  
  // If agent doesn't exist or is not approved, show error and redirect
  if (!data || !data.agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="text-muted-foreground mb-6">This agent is not available or not approved yet.</p>
        <Link href="/agents" className="inline-flex items-center text-blue-600 hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Agents
        </Link>
      </div>
    )
  }
  
  const agent = data.agent
  const readmeContent = readReadmeFile()

  const title = agent?.agent_name || "Business Representative"
  const description = agent?.description ||
    `Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.`
  const categories = data.capabilities?.map((c) => c.by_capability || "") .filter(Boolean) || ["Marketing"]
  const personas = agent?.by_persona ? [agent.by_persona] : ["Executives (CXO)"]
  const valueProps = agent?.by_value ? [agent.by_value] : ["Productivity"]
  const worksWith = data.deployments?.slice(0, 1).map((d) => d.service_name || "").filter(Boolean) || ["OpenAI GPT-4o"]

  // Compute next agent id (server-side) to enable Next Agent navigation
  let nextAgentId: string | null = null
  let prevAgentId: string | null = null
  try {
    const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
    if (agentsRes.ok) {
      const agentsJson = await agentsRes.json()
      const agentIds: string[] = (agentsJson?.agents || [])
        .filter((a: any) => a?.admin_approved === "yes")
        .map((a: any) => a?.agent_id)
        .filter(Boolean)
      if (agentIds.length > 0) {
        const idx = Math.max(0, agentIds.findIndex((aid) => aid === id))
        const nextIdx = idx >= 0 ? (idx + 1) % agentIds.length : 0
        const prevIdx = idx >= 0 ? (idx - 1 + agentIds.length) % agentIds.length : 0
        nextAgentId = agentIds[nextIdx] || null
        prevAgentId = agentIds[prevIdx] || null
      }
    }
  } catch {
    // ignore - keep nextAgentId null
  }
  return (
    <div className="flex flex-col">
      <ScrollToTop />
      {/* Breadcrumb */}
      <div className="border-b bg-white py-4">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <Link href="/agents" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" />
            From Find to Platform
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="relative py-12">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Main Content */}
            <div>
              <div className="mb-6">
                <h1 className="mb-2 text-4xl font-bold">{title}</h1>
                <div className="mt-2 space-y-2">
                  {/* Built by */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#111827]">Agent Built By:</span>
                    <span className="font-medium text-gray-500">{data?.isv_info?.isv_name || 'Crayon Data India Pvt Ltd'}</span>
                  </div>

                  {/* ISV Information */}
                  <div className="space-y-2">
                    {data?.isv_info?.isv_address && (
                      <ExpandableAddress address={data.isv_info.isv_address} />
                    )}
                    {data?.isv_info?.isv_domain && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-[#111827]">Domain:</span>
                        <span className="font-medium text-gray-500">{data.isv_info.isv_domain}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <ReadMore text={description.replace(/\\n/g, '\n')} className="mb-6" />
              </div>

              {/* Metadata */}
              <div className="mb-8 space-y-3">
                {/* Categories */}
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Categories :</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c, i) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Tags (from API) */}
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Tags :</span>
                  <div className="flex flex-wrap gap-2">
                    {(agent?.tags ? agent.tags.split(',').map(t => t.trim()).filter(Boolean) : []).map((t, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Target Personas */}
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Target Personas :</span>
                  <div className="flex flex-wrap gap-2">
                    {personas.map((p, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Value Propositions */}
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Value Propositions:</span>
                  <div className="flex flex-wrap gap-2">
                    {valueProps.map((v, i) => (
                      <Badge key={i} variant="primary" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* <div>
                  <span className="font-semibold">Works with : </span>
                  {worksWith.map((w, i) => (
                    <Badge key={i} variant="outline" className="ml-2">
                      {w}
                    </Badge>
                  ))}
                </div> */}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="features" className="w-full mt-[100px]">
                {/* Try It Now Button */}
                {agent?.demo_link && (
                  <div className="mb-6 flex justify-center">
                    <a
                      href={agent.demo_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: 120.2935791015625,
                        height: 43.510398864746094,
                        maxWidth: 363.41,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderImage: 'linear-gradient(98.05deg, #E2118E 5.32%, #AAF2FF 27.12%, #1576FF 99.78%) 1',
                        borderImageSlice: 1,
                        borderRadius: 4,
                        paddingTop: 13.26,
                        paddingRight: 17.34,
                        paddingBottom: 13.26,
                        paddingLeft: 17.34,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '100%',
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        backgroundColor: '#000',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      TRY IT NOW
                    </a>
                  </div>
                )}
                <TabsList className="w-full justify-start bg-transparent p-0 gap-6 h-12 rounded-none border-0">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="roi">ROI</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                </TabsList>
                <div className="h-px bg-gray-200 -mx-6" />
                <TabsContent value="features" className="mt-6">
                  {agent?.features && agent.features !== "na" ? (
                    (() => {
                      const items = agent.features
                        .replace(/\\n/g, '\n')
                        .split(/[:\n]+/)
                        .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                        .filter(Boolean)
                      return (
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          {items.map((it, i) => (
                            <li key={i} className="leading-relaxed">{it}</li>
                          ))}
                        </ul>
                      )
                    })()
                  ) : (
                    <p className="text-muted-foreground">Features information is not available for this agent.</p>
                  )}
                </TabsContent>
                <TabsContent value="roi" className="mt-6">
                  {agent?.roi && agent.roi !== "na" ? (
                    (() => {
                      const items = agent.roi
                        .replace(/\\n/g, '\n')
                        .split(/[:\n]+/)
                        .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                        .filter(Boolean)
                      return (
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          {items.map((it, i) => (
                            <li key={i} className="leading-relaxed">{it}</li>
                          ))}
                        </ul>
                      )
                    })()
                  ) : (
                    <p className="text-muted-foreground">ROI information is not available for this agent.</p>
                  )}
                </TabsContent>
                <TabsContent value="deployment" className="mt-6">
                  {(!data?.deployments || data.deployments.length === 0) ? (
                    <p className="text-muted-foreground">No deployment information available.</p>
                  ) : (
                    <div className="w-full">
                      {(() => {
                        const groups: Record<string, typeof data.deployments> = {}
                        for (const d of (data?.deployments || [])) {
                          const key = d?.service_provider || 'Other'
                          if (!groups[key]) groups[key] = []
                          groups[key].push(d)
                        }
                        const entries = Object.entries(groups)
                        return (
                          <Accordion type="multiple" className="w-full rounded-md border">
                            {entries.map(([provider, items]) => (
                              <AccordionItem key={provider} value={provider} className="px-4">
                                <AccordionTrigger className="text-sm font-semibold">
                                  {provider}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {items.map((d, idx) => (
                                      <div key={(d?.service_id || provider) + idx} className="rounded-lg border bg-white p-4">
                                        <div className="mb-1 text-sm font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                          {d?.service_name || 'Service'}
                                        </div>
                                        <div className="mb-3 text-xs text-[#344054]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '150%' }}>
                                          {d?.by_capability || d?.capability_name || 'Capability'}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant="outline">{d?.deployment || 'Cloud/On-Prem'}</Badge>
                                          <Badge variant="default">{d?.cloud_region || 'Regions'}</Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )
                      })()}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="docs" className="mt-6">
                  {data?.documentation && data.documentation.length > 0 && data.documentation[0] ? (
                    <div className="space-y-6">
                      {/* Top row cards */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {data.documentation[0].sdk_details && (
                          <Card className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50">
                                  <Code className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm mb-2">SDK Details</h3>
                                  <a
                                    href={data.documentation[0].sdk_details}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate w-full"
                                  >
                                    <span className="truncate">{data.documentation[0].sdk_details}</span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {data.documentation[0].swagger_details && (
                          <Card className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-green-50">
                                  <Code className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm mb-2">API Swagger</h3>
                                  <a
                                    href={data.documentation[0].swagger_details}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate w-full"
                                  >
                                    <span className="truncate">{data.documentation[0].swagger_details}</span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {data.documentation[0].security_details && (
                          <Card className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-red-50">
                                  <Lock className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm mb-2">Security Details</h3>
                                  <a
                                    href={data.documentation[0].security_details}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate w-full"
                                  >
                                    <span className="truncate">{data.documentation[0].security_details}</span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {data.documentation[0].related_files && (
                          <Card className="transition-shadow hover:shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-purple-50">
                                  <FileText className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm mb-2">Related Files</h3>
                                  <a
                                    href={data.documentation[0].related_files}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 truncate w-full"
                                  >
                                    <span className="truncate">{data.documentation[0].related_files}</span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Sample Input/Output */}
                      {(data.documentation[0].sample_input || data.documentation[0].sample_output) && (
                        <div className="space-y-4">
                          {data.documentation[0].sample_input && (
                            <Card className="transition-shadow hover:shadow-md">
                              <CardContent className="p-0">
                                <div className="border-b px-5 py-3">
                                  <h3 className="font-semibold text-sm">Sample Input</h3>
                                </div>
                                <div className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto">
                                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                                    <code>{data.documentation[0].sample_input}</code>
                                  </pre>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {data.documentation[0].sample_output && (
                            <Card className="transition-shadow hover:shadow-md">
                              <CardContent className="p-0">
                                <div className="border-b px-5 py-3">
                                  <h3 className="font-semibold text-sm">Sample Output</h3>
                                </div>
                                <div className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto">
                                  <pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap">
                                    <code>{data.documentation[0].sample_output}</code>
                                  </pre>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Documentation is not available for this agent.</p>
                  )}
                </TabsContent>
              </Tabs>

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between">
                {prevAgentId ? (
                  <Link href={`/agents/${prevAgentId}`} className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    <span className="font-medium underline-offset-4 group-hover:underline">Previous agent</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 text-gray-400 cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="font-medium">Previous agent</span>
                  </span>
                )}

                {nextAgentId ? (
                  <Link href={`/agents/${nextAgentId}`} className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <span className="font-medium underline-offset-4 group-hover:underline">Next agent</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 text-gray-400 cursor-not-allowed">
                    <span className="font-medium">Next agent</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Right Column - Demo Assets + Sidebar */}
            <div className="space-y-52 pr-6 lg:pr-8 ">
              {data?.demo_assets && data.demo_assets.length > 0 && (
                <div className="relative w-[720px] overflow-hidden rounded-xl">
                  <img src="/gradiant%20image%20right.png" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
                  <DemoAssetsViewer assets={data.demo_assets} />
                    </div>
              )}
              


              {/* Document & ROI Links */}
              {/* <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="#">Document</Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="#">ROI</Link>
                </Button>
              </div> */}
            </div>
          </div>
        </div>
        
      </section>

      {/* Floating TRY IT NOW button (only on agent details page) */}
      {agent?.demo_link && (
        <a
          href={agent.demo_link}
          target="_blank"
          rel="noreferrer"
          className="fixed right-6 bottom-24 z-50"
          aria-label="Try it now"
        >
          <button
            className="px-5 py-3 rounded-full shadow-lg border border-gray-200 bg-black text-white hover:bg-black/90 transition-colors text-xs sm:text-sm"
          >
            TRY IT NOW
          </button>
        </a>
      )}
    </div>
  )
}
