import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AgentCard } from "@/components/agent-card"
import { Search, ChevronDown } from "lucide-react"

// Mock data for agents
const agents = [
  {
    id: "intelligent-image-analyzer",
    title: "Intelligent Image Analyzer",
    description:
      "Simplifies insurance claim assessment with AI during the insurance claims. By analyzing uploaded images, it identifies affected parts, retrieves repair costs from a database, and generates a detailed damage report.",
    badges: [
      { label: "Image Processing", variant: "default" as const },
      { label: "Legal", variant: "outline" as const },
    ],
    tags: ["CRM", "Claims", "Insurance", "Customer Support", "+4"],
  },
  {
    id: "automated-claims-processing",
    title: "Automated Claims Processing System",
    description:
      "Streamlines the claims intake by automating the intake, categorization, and assignment of claims to adjusters, reducing processing time and improving efficiency across the board.",
    badges: [
      { label: "Workflow Automation", variant: "primary" as const },
      { label: "Compliance", variant: "outline" as const },
    ],
    tags: ["Claims Management", "Adjustments", "Insurance", "+5"],
  },
  {
    id: "predictive-analytics-dashboard",
    title: "Predictive Analytics Dashboard",
    description:
      "Utilize advanced analytics to identify trends and potential fraudulent activities, allowing insurers to make data-driven decisions and improve risk management.",
    badges: [
      { label: "Data Analysis", variant: "default" as const },
      { label: "Risk Management", variant: "secondary" as const },
    ],
    tags: ["Analytics", "Risk Assessment", "Fraud Detection", "+3"],
  },
  {
    id: "customer-self-service-portal",
    title: "Customer Self-Service Portal",
    description:
      "Empowers policyholders to submit claims, track claim status, and access policy information through an intuitive interface, enhancing customer satisfaction and reducing call center volume.",
    badges: [
      { label: "User Experience", variant: "default" as const },
      { label: "Support", variant: "outline" as const },
    ],
    tags: ["Self Service", "Insurance", "Customer Engagement", "+6"],
  },
  {
    id: "fraud-detection-system",
    title: "Fraud Detection System",
    description:
      "Employs advanced algorithms to analyze patterns in claims data, flagging suspicious activities for further investigation and mitigating financial losses for insurers.",
    badges: [
      { label: "Machine Learning", variant: "primary" as const },
      { label: "Audit", variant: "outline" as const },
    ],
    tags: ["Fraud Prevention", "Investigation", "Insurance", "Security", "+7"],
  },
  {
    id: "real-time-claim-status-tracker",
    title: "Real-Time Claim Status Tracker",
    description:
      "Provides both insurers and policyholders with real-time updates on claim status via notifications and dashboards, facilitating transparency and communication throughout the claim process.",
    badges: [
      { label: "Notification System", variant: "secondary" as const },
      { label: "Customer Communication", variant: "outline" as const },
    ],
    tags: ["Claims Tracking", "Monitoring", "Information Technology", "+4"],
  },
  {
    id: "virtual-adjuster-assistant",
    title: "Virtual Adjuster Assistant",
    description:
      "Integrates AI to assist adjusters by providing quick access to policy details and claim history, thereby reducing the time spent on each claim and improving accuracy.",
    badges: [
      { label: "AI Assistance", variant: "primary" as const },
      { label: "Efficiency", variant: "outline" as const },
    ],
    tags: ["Support Tools", "Insurance", "Claims Management", "+5"],
  },
  {
    id: "mobile-claims-application",
    title: "Mobile Claims Application",
    description:
      "Enables policyholders to file claims on-the-go, upload documents, and communicate with their claims adjusters through a convenient mobile app, enhancing accessibility and user satisfaction.",
    badges: [
      { label: "App Development", variant: "default" as const },
      { label: "Customer Support", variant: "outline" as const },
    ],
    tags: ["Mobile Access", "Claims", "Customer Experience", "+8"],
  },
  {
    id: "billing-payment-automation",
    title: "Billing and Payment Automation",
    description:
      "Automates the billing process for insurance claims, ensuring timely payments and reducing administrative overhead while providing customers with flexible payment options.",
    badges: [
      { label: "Financial Automation", variant: "secondary" as const },
      { label: "Customer Service", variant: "outline" as const },
    ],
    tags: ["Billing", "Payments", "Insurance", "Finance", "+4"],
  },
]

export default function AgentLibraryPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">The AI platform accelerating business solutions</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Unlock the value of enterprise data and enable customer engagement at an individual level. Our
              comprehensive suite of AI agents drives business transformation.
            </p>

            {/* Partner Logos */}
            <div className="mb-8 flex items-center justify-center gap-8">
              <div className="text-sm text-muted-foreground">Loved by</div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-red-500" />
                  <span className="font-semibold">crayon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500" />
                  <span className="font-semibold">Veehive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-gray-700" />
                  <span className="font-semibold">MOZARK</span>
                </div>
              </div>
              <div className="text-sm font-semibold">32,000 +</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-b bg-white py-6">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search Agents and Solutions" className="pl-10" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm">
              Service Provider <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Capability <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Persona <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Value <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Category <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} {...agent} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
