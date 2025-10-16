import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
    tags?: string
  }
  capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  deployments?: Array<{ service_provider?: string; service_name?: string; deployment?: string; cloud_region?: string }>
  demo_assets?: Array<{ demo_asset_link?: string; demo_link?: string }>
  documentation?: Array<{ sdk_details?: string; swagger_details?: string; sample_input?: string; sample_output?: string }>
  isv_info?: { isv_name?: string; isv_email_no?: string }
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

export default async function AgentDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id
  const data = await fetchAgentDetail(id)
  const agent = data?.agent

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
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left Column - Main Content */}
            <div>
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Agent</span>
                  <span className="text-sm text-muted-foreground">Build by: {data?.isv_info?.isv_name || 'Crayon Team'}</span>
                </div>
                <h1 className="mb-4 text-4xl font-bold">{title}</h1>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <p className="mb-4 text-muted-foreground">{description}</p>
                {agent?.features && <p className="mb-4 text-muted-foreground">{agent.features}</p>}
                {agent?.demo_link && (
                  <p className="mb-4">
                    Demo: <a href={agent.demo_link} target="_blank" rel="noreferrer" className="text-primary underline">{agent.demo_link}</a>
                  </p>
                )}
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
                <div>
                  <span className="font-semibold">Works with : </span>
                  {worksWith.map((w, i) => (
                    <Badge key={i} variant="outline" className="ml-2">
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="definition" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="definition">Agent Definition</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  <TabsTrigger value="usecase">Use Case</TabsTrigger>
                </TabsList>
                <TabsContent value="definition" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="mb-4 text-lg font-semibold">Scope</h3>
                      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                        <li>You are an automated email responder.</li>
                        <li>Your task is to process and respond to HubSpot CRM inbox replies.</li>
                        <li>Fetch all customer replies using the provided CRM object ID.</li>
                        <li>Extract and analyze all customer messages from the email thread</li>
                        <li>Extract relevant context from customer replies for customized marketing</li>
                      </ul>

                      <h3 className="mb-4 mt-6 text-lg font-semibold">Instructions</h3>
                      <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
                        <li>
                          Make sure to look search for answers every time a question is asked in the replies do not ask
                          to schedule meeting unless the reply say so
                        </li>
                        <li>Do not assume anything, Just provide the responses from context.</li>
                        <li>Tone: In case of any urgent emails but polite. Highlight deadlines in bold.</li>
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tools" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground">Tools configuration will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="deployment" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground">Deployment instructions will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="usecase" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground">Use case examples will be displayed here.</p>
                    </CardContent>
                  </Card>
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

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Try Now Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-blue-500" />
                      <span className="font-semibold">Data Received</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Customization</span>
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-black/90">
                    TRY NOW
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <ChevronLeft className="inline h-4 w-4" />
                    Apply and AI
                  </div>
                </CardContent>
              </Card>

              {/* Developer Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Developer</div>
                      <div className="font-semibold">{data?.isv_info?.isv_name || 'Crayon Data Team'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Contact</div>
                      <div className="font-semibold">{data?.isv_info?.isv_email_no || 'na'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div className="font-semibold">03-10-2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Language</div>
                      <div className="font-semibold">English</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document & ROI Links */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="#">Document</Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="#">ROI</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
