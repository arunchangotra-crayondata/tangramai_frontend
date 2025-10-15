import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeploymentCard } from "@/components/deployment-card"
import { Search, ChevronDown } from "lucide-react"

const awsDeployments = [
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "AWS",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "AWS",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "AWS",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "AWS",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
]

const azureDeployments = [
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "Azure",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "Azure",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "Azure",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "Azure",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
]

const gcpDeployments = [
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "GCP",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "GCP",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "GCP",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
  {
    title: "Amazon Athena",
    description:
      "Automates claims intake, categorization, and assignment, accelerating processing and improving efficiency.",
    provider: "GCP",
    deploymentType: "Cloud",
    regions: ["AMER", "EUR", "+1"],
    capabilities: ["Data & Analytics"],
  },
]

export default function TechStackPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">Deploy AI agents anywhere your business operates</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Choose from industry-leading cloud service providers and deployment options. Deploy on platforms your
              organization is already engaged with for seamless integration.
            </p>

            {/* Partner Logos */}
            <div className="mb-8 flex items-center justify-center gap-8">
              <div className="text-sm text-muted-foreground">Our Enterprise AI Partners</div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-orange-500" />
                  <span className="font-semibold">AWS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-blue-500" />
                  <span className="font-semibold">Azure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-red-500" />
                  <span className="font-semibold">Google Cloud</span>
                </div>
              </div>
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
              <Input placeholder="Search deployment options" className="pl-10" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm">
              By Provider <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              By Deployment Type <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              By Capability <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Amazon Web Services */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Amazon Web Services</h2>
              <p className="text-muted-foreground">12 deployment options available</p>
            </div>
            <Button variant="outline">Show All</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {awsDeployments.map((deployment, index) => (
              <DeploymentCard key={index} {...deployment} />
            ))}
          </div>
        </div>
      </section>

      {/* Microsoft Azure */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Microsoft Azure</h2>
              <p className="text-muted-foreground">12 deployment options available</p>
            </div>
            <Button variant="outline">Show All</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {azureDeployments.map((deployment, index) => (
              <DeploymentCard key={index} {...deployment} />
            ))}
          </div>
        </div>
      </section>

      {/* Google Cloud Services */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Google Cloud Services</h2>
              <p className="text-muted-foreground">12 deployment options available</p>
            </div>
            <Button variant="outline">Show All</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gcpDeployments.map((deployment, index) => (
              <DeploymentCard key={index} {...deployment} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
