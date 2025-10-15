import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
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
                  <span className="text-sm text-muted-foreground">Build by: Crayon Team</span>
                </div>
                <h1 className="mb-4 text-4xl font-bold">Business Representative</h1>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <p className="mb-4 text-muted-foreground">
                  Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Responds to Inbound Marketing Emails with Contextual Answers
                </p>
                <p className="mb-4 text-muted-foreground">Asks Smart Lead Capture Questions</p>
                <p className="mb-4 text-muted-foreground">Schedules Meetings Directly via Calendar Integration</p>
                <p className="text-muted-foreground">
                  Maintains Consistent Tone and Brand Voice Across All Interactions
                </p>
              </div>

              {/* Metadata */}
              <div className="mb-8 space-y-4">
                <div>
                  <span className="font-semibold">Categories : </span>
                  <Badge variant="default" className="ml-2">
                    Marketing
                  </Badge>
                  <Badge variant="default" className="ml-2">
                    Conversational AI & Advisory
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Target Personas : </span>
                  <Badge variant="outline" className="ml-2">
                    Executives (CXO)
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Value Propositions: </span>
                  <Badge variant="primary" className="ml-2">
                    Productivity
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Works with : </span>
                  <Badge variant="outline" className="ml-2">
                    OpenAI GPT-4o
                  </Badge>
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
                      <div className="font-semibold">Crayon Data Team</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div className="font-semibold">03-10-2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Language</div>
                      <div className="font-semibold">English</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Installs</div>
                      <div className="font-semibold">6</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Enterprise users</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">ADIB</Badge>
                        <Badge variant="outline">HDFC</Badge>
                        <Badge variant="outline">Redington</Badge>
                      </div>
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
