"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { DeploymentCard } from "../../components/deployment-card"
import Image from "next/image"
import { Search, ChevronDown, Cloud as CloudIcon } from "lucide-react"
import Head from "next/head"

type Capability = {
  by_capability_id: string
  by_capability: string
}

type GroupedDeployment = {
  service_provider: string
  by_capability: string
  services: { service_name: string; deployment: string; cloud_region: string }[]
  deployments: string[]
  cloud_regions: string[]
}

export default function TechStackPage() {
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [grouped, setGrouped] = useState<GroupedDeployment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [providerFilter, setProviderFilter] = useState<string>("All")
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All")

  const providerLogo = (provider: string) => {
    const p = provider.toLowerCase()
    if (p.includes("aws")) return { type: "img" as const, src: "/aws.png" }
    if (p.includes("azure")) return { type: "img" as const, src: "/azur.png" }
    if (p.includes("gcp") || p.includes("google")) return { type: "icon" as const }
    if (p.includes("openai")) return { type: "img" as const, src: "/placeholder-logo.png" }
    if (p.includes("open-source") || p.includes("opensource")) return { type: "img" as const, src: "/placeholder-logo.svg" }
    if (p.includes("saas")) return { type: "img" as const, src: "/placeholder-logo.svg" }
    return { type: "icon" as const }
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("https://agents-store.onrender.com/api/capabilities", {
          headers: { accept: "application/json" },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = await res.json()
        setCapabilities(json.capabilities || [])
        setGrouped(json.grouped_deployments || [])
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load capabilities")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [])

  const providers = useMemo(() => Array.from(new Set(grouped.map(g => g.service_provider))), [grouped])
  const capabilityOptions = useMemo(
    () => Array.from(new Set(capabilities.map(c => c.by_capability))).sort(),
    [capabilities]
  )

  const filtered = useMemo(() => {
    const byProvider = providerFilter === "All" ? grouped : grouped.filter(g => g.service_provider === providerFilter)
    const byCap = capabilityFilter === "All" ? byProvider : byProvider.filter(g => g.by_capability === capabilityFilter)
    if (!search.trim()) return byCap
    const q = search.toLowerCase()
    return byCap
      .map(g => ({
        ...g,
        services: g.services.filter(s => s.service_name.toLowerCase().includes(q)),
      }))
      .filter(g => g.services.length > 0)
  }, [grouped, providerFilter, capabilityFilter, search])

  return (
    <>
      <Head>
        <title>Deployment Option - Tangram AI</title>
        <meta name="description" content="Choose your preferred platform and deployment model for AI agents" />
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-balance">
              <span className="gradient-text">Deployment Options</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Choose your preferred platform and deployment model for AI agents
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Filter Panel */}
      <section className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-[1280px] px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deployment options..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="All">All Providers</option>
                {providers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-3 py-2 text-sm bg-white"
                value={capabilityFilter}
                onChange={(e) => setCapabilityFilter(e.target.value)}
              >
                <option value="All">All Capabilities</option>
                {capabilityOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 py-8">
        <div className="mx-auto max-w-[1280px] px-6">
          {loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading deployment options...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600">{error}</div>
            </div>
          )}
          
          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-8">
              {filtered
                .reduce((acc: { provider: string; items: GroupedDeployment[] }[], item) => {
                  const found = acc.find(a => a.provider === item.service_provider)
                  if (found) found.items.push(item)
                  else acc.push({ provider: item.service_provider, items: [item] })
                  return acc
                }, [])
                .map((group, gi) => (
                  <div key={group.provider + gi} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {/* Provider Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const logo = providerLogo(group.provider)
                          return logo.type === "img" ? (
                            <div className="relative h-8 w-8">
                              <Image src={logo.src} alt={group.provider} fill className="object-contain" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 flex items-center justify-center text-gray-700">
                              <CloudIcon className="h-6 w-6" />
                            </div>
                          )
                        })()}
            <div>
                          <h3 className="text-xl font-semibold">{group.provider}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.items.reduce((sum, g) => sum + g.services.length, 0)} deployment options
                          </p>
          </div>
          </div>
        </div>
                    
                    {/* Services Grid */}
                    <div className="p-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {group.items.flatMap((g) =>
                          g.services.map((s, idx) => (
                            <div
                              key={`${g.service_provider}-${g.by_capability}-${s.service_name}-${idx}`}
                              className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm">{s.service_name}</h4>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {s.deployment}
                                </span>
            </div>
                              <p className="text-xs text-muted-foreground mb-2">{g.by_capability}</p>
                              <div className="flex flex-wrap gap-1">
                                {(g.cloud_regions?.length ? g.cloud_regions : (s.cloud_region ? s.cloud_region.split(", ") : [])).slice(0, 3).map((region, i) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {region}
                                  </span>
                                ))}
                                {(g.cloud_regions?.length ? g.cloud_regions : (s.cloud_region ? s.cloud_region.split(", ") : [])).length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{(g.cloud_regions?.length ? g.cloud_regions : (s.cloud_region ? s.cloud_region.split(", ") : [])).length - 3} more
                                  </span>
                                )}
          </div>
        </div>
                          ))
                        )}
          </div>
          </div>
                  </div>
                ))
              }
            </div>
          )}
          
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No deployment options found matching your criteria.</div>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}
