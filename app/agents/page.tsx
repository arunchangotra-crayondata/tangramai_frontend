import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgentCard } from "@/components/agent-card";
import { Search, ChevronDown } from "lucide-react";

// Fallback mock data (minimal) in case the API fails
const fallbackAgents = [
  {
    id: "intelligent-image-analyzer",
    title: "Intelligent Image Analyzer",
    description:
      "Simplifies insurance claim assessment with AI during the insurance claims. By analyzing uploaded images, it identifies affected parts, retrieves repair costs from a database, and generates a detailed damage report.",
    badges: [{ label: "Image Processing", variant: "default" as const }],
    tags: ["CRM", "Claims", "Insurance"],
  },
];

type ApiAgent = {
  agent_id: string;
  agent_name: string;
  description: string;
  tags: string | null;
  by_value?: string | null;
};

async function fetchAgents() {
  try {
    const res = await fetch("https://agents-store.onrender.com/api/agents", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
    const data = await res.json();
    // Map API response to AgentCard props
    const apiAgents: ApiAgent[] = data?.agents || [];
    return apiAgents.map((a) => ({
      id: a.agent_id,
      title: a.agent_name,
      description: a.description,
      // API `tags` may be a comma-separated string; convert to array
      tags: a.tags
        ? a.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : [],
      badges: [
        { label: (a as any).by_value || "", variant: "default" as const },
      ],
    }));
  } catch (err) {
    // On any error return fallback
    // eslint-disable-next-line no-console
    console.error(err);
    return fallbackAgents;
  }
}

export default async function AgentLibraryPage() {
  const agents = await fetchAgents();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src="/gradiant%20image%20right.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-left">
            <h1 className="mb-4 font-inter font-extrabold text-[64px] leading-[110%] tracking-[-0.02em] text-balance">
              <span
                style={{
                  background:
                    "radial-gradient(80.73% 80.73% at 3.12% 25.58%, #7935F4 0%, #9A4681 49.5%, #614BDB 96.87%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                The AI platform accelerating <br /> business solutions
              </span>
            </h1>
            <p
              className="mb-8 text-balance text-[18px] font-normal leading-[150%] tracking-[0] text-[background: #374151;
] rounded-md"
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            >
              Unlock the value of enterprise data and enable customer engagement
              at an individual level. Our comprehensive suite of AI agents
              drives business transformation.
            </p>

            {/* Loved by (left-aligned) */}
            <div className="mb-[266px] flex items-center justify-start gap-6">
              <div className="text-sm text-muted-foreground">Loved by</div>
              {/* Overlapping circular company logos */}
              <div className="flex -space-x-3">
                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white bg-white flex items-center justify-center shadow-sm">
                  <img src="/crayon_bw.png" alt="Crayon" className="h-6 w-6 object-contain" />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white bg-white flex items-center justify-center shadow-sm">
                  <img src="/veehive_bw.png" alt="Veehive" className="h-6 w-6 object-contain" />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white bg-white flex items-center justify-center shadow-sm">
                  <img src="/mozak_bw.png" alt="Mozark" className="h-6 w-6 object-contain" />
                </div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">32,000+</div>
              {/* Overlapping people avatars (6) */}
            </div>

            {/* Enterprise Partners Row */}
            <div className="mt-6 flex flex-col items-start gap-3">
              <div className="text-sm font-medium">Our Enterprise AI Partners</div>
              <div className="flex items-center gap-6">
                <img
                  src="/crayon_bw.png"
                  alt="crayon"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
                <img
                  src="/veehive_bw.png"
                  alt="veehive"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
                <img
                  src="/mozak_bw.png"
                  alt="mozak"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Search + Filters Bar */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Search (left 60%) */}
            <div className="relative w-[60%] max-w-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Agents and Solutions"
                className="pl-10 border-0 bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Divider */}
            <div className="mx-4 text-gray-300 select-none" aria-hidden="true">|</div>

            {/* Filters (right 40%, borderless) */}
            <div className="flex items-center justify-end gap-3 w-[40%]">
              <Button variant="ghost" size="sm" className="px-2">
                Service Provider <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                Capability <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                Persona <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                Value <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                Category <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
  );
}

