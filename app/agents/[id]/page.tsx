import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent } from "../../../components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DemoAssetsViewer from "../../../components/demo-assets-viewer"
import ReadMore from "../../../components/read-more"
import CollapsibleList from "../../../components/collapsible-list"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { readFileSync } from "fs"
import { join } from "path"
import ExpandableAddress from "../../../components/expandable-address"

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
    return data
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
  const agent = data?.agent
  const readmeContent = readReadmeFile()

  const title = agent?.agent_name || "Business Representative"
  const description = agent?.description ||
    `Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.`
  const categories = data?.capabilities?.map((c) => c.by_capability || "") .filter(Boolean) || ["Marketing"]
  const personas = agent?.by_persona ? [agent.by_persona] : ["Executives (CXO)"]
  const valueProps = agent?.by_value ? [agent.by_value] : ["Productivity"]
  const worksWith = data?.deployments?.slice(0, 1).map((d) => d.service_name || "").filter(Boolean) || ["OpenAI GPT-4o"]
  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b bg-white py-4">
        <div className="mx-auto max-w-[1280px] px-6">
          <Link href="/agents" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" />
            From Find to Platform
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="relative py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Main Content */}
            <div>
              <div className="mb-6">
                <h1 className="mb-2 text-4xl font-bold">{title}</h1>
                <div className="mt-1 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#111827]">Agent</span>
                  <span className="font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#111827]">Built by: <span style={{ color: '#6B7280' }}>{data?.isv_info?.isv_name || 'Crayon Data India Pvt Ltd'}</span></span>
                </div>
                
                {/* ISV Information */}
                <div className="mt-4 space-y-2">
                  {data?.isv_info?.isv_address && (
                    <ExpandableAddress address={data.isv_info.isv_address} />
                  )}
                  {data?.isv_info?.isv_domain && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>Domain:</span>
                      <span className="font-medium text-[14px] leading-[100%] tracking-[0] align-middle" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{data.isv_info.isv_domain}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <ReadMore text={description.replace(/\\n/g, '\n')} className="mb-6" />
              </div>

              {/* Metadata */}
              <div className="mb-8 space-y-4">
                <div>
                  <span className="font-semibold">Categories : </span>
                  {categories.map((c, i) => (
                    <Badge key={i} variant="default" className="ml-2">
                      {c}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="font-semibold">Target Personas : </span>
                  {personas.map((p, i) => (
                    <Badge key={i} variant="outline" className="ml-2">
                      {p}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="font-semibold">Value Propositions: </span>
                  {valueProps.map((v, i) => (
                    <Badge key={i} variant="primary" className="ml-2">
                      {v}
                    </Badge>
                  ))}
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
                    <div className="prose max-w-none">
                      <div style={{ whiteSpace: 'pre-line' }} className="text-muted-foreground">
                        {agent.features.replace(/\\n/g, '\n')}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Features information is not available for this agent.</p>
                  )}
                </TabsContent>
                <TabsContent value="roi" className="mt-6">
                  {agent?.roi && agent.roi !== "na" ? (
                    <div className="prose max-w-none">
                      <div style={{ whiteSpace: 'pre-line' }} className="text-muted-foreground">
                        {agent.roi.replace(/\\n/g, '\n')}
                      </div>
                    </div>
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
                  <div className="max-h-[600px] overflow-y-auto border rounded-lg p-6 bg-gray-50">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: formatCodeBlock(readmeContent) }} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Apply and AI
                </Button>
                <Button variant="ghost" size="sm">
                  Next Agent
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
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
    </div>
  )
}
