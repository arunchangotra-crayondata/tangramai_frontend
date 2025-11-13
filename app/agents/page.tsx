"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AgentSearchChat } from "../../components/agent-search-chat";
import { AgentCard } from "../../components/agent-card";
import ChatDialog from "../../components/chat-dialog";
import { Search } from "lucide-react";
import { VoiceInputControls } from "../../components/voice-input-controls";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../lib/store/chat.store";

// Fallback mock data (minimal) in case the API fails
const fallbackAgents = [
  {
    id: "intelligent-image-analyzer",
    title: "Intelligent Image Analyzer",
    description:
      "Simplifies insurance claim assessment with AI during the insurance claims. By analyzing uploaded images, it identifies affected parts, retrieves repair costs from a database, and generates a detailed damage report.",
    badges: [{ label: "Image Processing", variant: "default" as const }],
    tags: ["CRM", "Claims", "Insurance"],
    capabilities: ["Document Intelligence"],
    providers: ["AWS"],
    deploymentType: "Solution",
    persona: "Operations Teams",
    assetType: "Solution",
  },
];

type Agent = {
  id: string;
  title: string;
  description: string;
  badges: { label: string; variant: "default" }[];
  tags: string[];
  capabilities: string[];
  providers: string[];
  deploymentType: string;
  persona: string;
  assetType: string;
  agents_ordering?: number;
};

type ApiAgent = {
  agent_id: string;
  agent_name: string;
  description: string;
  tags: string | null;
  by_value?: string | null;
  by_capability?: string | null;
  service_provider?: string | null;
  asset_type?: string | null;
  by_persona?: string | null;
  admin_approved?: string | null;
  agents_ordering?: string | number | null;
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
    // Filter to only show approved agents
    return apiAgents
      .filter(a => a.admin_approved === "yes")
      .map((a) => ({
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
      capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
      providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
      deploymentType: a.asset_type || "",
      persona: a.by_persona || "",
      assetType: a.asset_type || "",
    }));
  } catch (err) {
    // On any error return fallback
    // eslint-disable-next-line no-console
    console.error(err);
    return fallbackAgents;
  }
}

export default function AgentLibraryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All");
  const [deploymentFilter, setDeploymentFilter] = useState<string>("All");
  const [personaFilter, setPersonaFilter] = useState<string>("All");
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(25);
  const [displayedAICount, setDisplayedAICount] = useState(25);
  
  const searchParams = useSearchParams();
  const { messages } = useChatStore();
  const agentIdFromUrl = searchParams.get('agentId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
        const data = await res.json();
        
        const apiAgents: ApiAgent[] = data?.agents || [];
        const mappedAgents = apiAgents
          .filter(a => a.admin_approved === "yes") // Only show approved agents
          .map((a) => {
            // Parse agents_ordering - handle "na", null, undefined, or numeric string
            let ordering: number | undefined;
            if (a.agents_ordering !== null && a.agents_ordering !== undefined && a.agents_ordering !== "na") {
              const parsed = typeof a.agents_ordering === 'number' 
                ? a.agents_ordering 
                : parseInt(String(a.agents_ordering), 10);
              ordering = isNaN(parsed) ? undefined : parsed;
            }
            
            return {
              id: a.agent_id,
              title: a.agent_name,
              description: a.description,
              tags: a.tags
                ? a.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
              badges: [
                { label: (a as any).by_value || "", variant: "default" as const },
              ],
              // Add new fields for filtering
              capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
              providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
              deploymentType: a.asset_type || "",
              persona: a.by_persona || "",
              assetType: a.asset_type || "",
              agents_ordering: ordering,
            };
          })
          // Sort by agents_ordering: numeric values first (ascending), then undefined/null/"na" at the end
          .sort((a, b) => {
            const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
          });
        
        setAgents(mappedAgents.length > 0 ? mappedAgents : fallbackAgents);
      } catch (err) {
        console.error(err);
        setError("Failed to load agents");
        setAgents(fallbackAgents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);


  const allCapabilities = useMemo(() => {
    const capabilities = new Set<string>();
    agents.forEach(agent => {
      agent.capabilities.forEach(capability => capabilities.add(capability));
    });
    return Array.from(capabilities).sort();
  }, [agents]);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    agents.forEach(agent => {
      agent.providers.forEach(provider => providers.add(provider));
    });
    return Array.from(providers).sort();
  }, [agents]);

  const allDeploymentTypes = useMemo(() => {
    const types = new Set<string>();
    agents.forEach(agent => {
      if (agent.deploymentType) types.add(agent.deploymentType);
    });
    return Array.from(types).sort();
  }, [agents]);

  const allPersonas = useMemo(() => {
    const personas = new Set<string>();
    agents.forEach(agent => {
      if (agent.persona) personas.add(agent.persona);
    });
    return Array.from(personas).sort();
  }, [agents]);

  // Get AI searched agent IDs from the latest chat message
  const aiSearchedAgentIds = useMemo(() => {
    // Find the most recent assistant message with filteredAgentIds
    const latestMessageWithAgents = messages
      .filter(msg => msg.role === "assistant" && msg.filteredAgentIds && msg.filteredAgentIds.length > 0)
      .slice(-1)[0];
    
    return latestMessageWithAgents?.filteredAgentIds || null;
  }, [messages]);

  // Helper function to apply manual filters to agents
  const applyManualFilters = (agentList: Agent[]) => {
    let filtered = agentList;
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.title.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tags.some(tag => tag.toLowerCase().includes(q)) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(q)) ||
        agent.providers.some(prov => prov.toLowerCase().includes(q))
      );
    }
    
    if (providerFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.providers.includes(providerFilter)
      );
    }
    
    if (capabilityFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.capabilities.includes(capabilityFilter)
      );
    }
    
    if (deploymentFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.deploymentType === deploymentFilter
      );
    }
    
    if (personaFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.persona === personaFilter
      );
    }
    
    return filtered;
  };

  // AI searched agents (filtered by manual filters)
  const aiSearchedAgents = useMemo(() => {
    if (!aiSearchedAgentIds) return [];
    
    const aiAgents = agents.filter(agent => aiSearchedAgentIds.includes(agent.id));
    const filtered = applyManualFilters(aiAgents);
    // Sort by agents_ordering to maintain order
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, aiSearchedAgentIds, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter]);

  // All agents (filtered by manual filters)
  const allFilteredAgents = useMemo(() => {
    // Filter by agent ID from URL parameter (highest priority)
    if (agentIdFromUrl) {
      return agents.filter(agent => agent.id === agentIdFromUrl);
    }
    
    const filtered = applyManualFilters(agents);
    // Sort by agents_ordering (already sorted in fetchData, but re-sort after filtering to maintain order)
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src="/gradiant%20image%20right.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
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
                The One-Stop Store.   
              </span>
            </h1>
            <p
              className="mb-25 text-balance text-[18px] font-normal leading-[150%] tracking-[0]"
              style={{ color: "#374151", fontFamily: "Inter, sans-serif" }}
            >
              Discover.Try. Deploy.
            </p>

            {/* Centered search bar under subheader */}
            <div className="flex w-full justify-center mb-16">
              <div className="w-full max-w-5xl">
                {/* reuse same search-chat as home */}
                <AgentSearchChat />
              </div>
            </div>

            {/* Loved by (left-aligned) */}
            <div className="mb-[120px] flex items-center justify-center gap-6">
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
            <div className="mt-6 flex flex-col items-center gap-3">
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

      {/* Unified Search + Filters Bar with Home search chat */}
      <section className="bg-white border-b shadow-sm">
        {/* Additional Filters */}
        <div className="mx-auto max-w-[1280px] px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Quick Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Quick search by name, tags, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-28 py-2 w-full"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputControls
                  value={search}
                  onValueChange={setSearch}
                  buttonVariant="ghost"
                  compact
                  ariaLabel="Use voice search"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 ml-auto">
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white min-w-[120px]"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="All">By Provider</option>
                {allProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white min-w-[120px]"
                value={capabilityFilter}
                onChange={(e) => setCapabilityFilter(e.target.value)}
              >
                <option value="All">By Capability</option>
                {allCapabilities.map(capability => (
                  <option key={capability} value={capability}>{capability}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white min-w-[120px]"
                value={deploymentFilter}
                onChange={(e) => setDeploymentFilter(e.target.value)}
              >
                <option value="All">By Asset Type</option>
                {allDeploymentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white min-w-[120px]"
                value={personaFilter}
                onChange={(e) => setPersonaFilter(e.target.value)}
              >
                <option value="All">By Persona</option>
                {allPersonas.map(persona => (
                  <option key={persona} value={persona}>{persona}</option>
                ))}
              </select>
              
              {/* Clear All Filters Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProviderFilter("All");
                  setCapabilityFilter("All");
                  setDeploymentFilter("All");
                  setPersonaFilter("All");
                  setSearch("");
                }}
                className="text-xs px-3 py-2 border-gray-300 hover:bg-gray-50"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          {loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading agents...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600">{error}</div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* AI Search Results Section */}
              {aiSearchedAgentIds && aiSearchedAgentIds.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Search Results</h2>
                      <p className="text-sm text-muted-foreground">
                        Showing {aiSearchedAgents.length} of {aiSearchedAgentIds.length} AI-recommended agents
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Clear the chat to remove AI search results
                        const { clearChat } = useChatStore.getState();
                        clearChat();
                      }}
                      className="text-xs px-3 py-2"
                    >
                      Clear AI Search
                    </Button>
                  </div>
                  
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {aiSearchedAgents.slice(0, displayedAICount).map((agent) => (
                    <AgentCard key={agent.id} {...agent} assetType={agent.assetType} />
                  ))}
                </div>

                  {aiSearchedAgents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">No AI-recommended agents match your current filters.</div>
                    </div>
                  )}

                  {aiSearchedAgents.length > displayedAICount && (
                    <div className="mt-12 text-center">
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => setDisplayedAICount(aiSearchedAgents.length)}
                      >
                        Load More ({aiSearchedAgents.length - displayedAICount} remaining)
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* All Agents Section */}
              <div className={aiSearchedAgentIds && aiSearchedAgentIds.length > 0 ? "border-t pt-12" : ""}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {aiSearchedAgentIds && aiSearchedAgentIds.length > 0 ? "All Agents" : "Agents"}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Showing {allFilteredAgents.length} of {agents.length} agents
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allFilteredAgents.slice(0, displayedCount).map((agent) => (
                    <AgentCard key={agent.id} {...agent} assetType={agent.assetType} />
                  ))}
                </div>

                {allFilteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">No agents found matching your criteria.</div>
                  </div>
                )}

                {allFilteredAgents.length > displayedCount && (
                  <div className="mt-12 text-center">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setDisplayedCount(allFilteredAgents.length)}
                    >
                      Load More ({allFilteredAgents.length - displayedCount} remaining)
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Customization prompt */}
              <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Can't find your agent?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Don't see exactly what you need? Our team can create a custom AI agent tailored to your specific requirements and use cases.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setCreateChatOpen(true)}
                  >
                    Create Your Own Agent
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Create Agent Chat Dialog */}
      <ChatDialog 
        open={createChatOpen} 
        onOpenChange={setCreateChatOpen} 
        initialMode="create"
      />
    </div>
  );
}

