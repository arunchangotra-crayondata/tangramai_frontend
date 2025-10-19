"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeploymentCard } from "@/components/deployment-card"
import Image from "next/image"
import { Search, ChevronDown, Cloud as CloudIcon } from "lucide-react"

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
                  <div className="relative h-8 w-8">
                    <Image src="/aws.png" alt="AWS" fill className="object-contain" />
                  </div>
                  <span className="font-semibold">AWS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image src="/azur.png" alt="Azure" fill className="object-contain" />
                  </div>
                  <span className="font-semibold">Azure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center text-gray-700">
                    <CloudIcon className="h-6 w-6" />
                  </div>
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
              <Input
                placeholder="Search deployment options"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="All">All Providers</option>
              {providers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              className="border rounded-md px-3 py-2 text-sm"
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
      </section>

      {/* Dynamic Providers & Deployments */}
      {loading && (
        <section className="py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-muted-foreground">Loading deployment options…</div>
          </div>
        </section>
      )}
      {error && (
        <section className="py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-rose-600">{error}</div>
          </div>
        </section>
      )}
      {!loading && !error && filtered.length > 0 && (
        filtered
          .reduce((acc: { provider: string; items: GroupedDeployment[] }[], item) => {
            const found = acc.find(a => a.provider === item.service_provider)
            if (found) found.items.push(item)
            else acc.push({ provider: item.service_provider, items: [item] })
            return acc
          }, [])
          .map((group, gi) => (
            <section key={group.provider + gi} className={gi % 2 === 1 ? "bg-gray-50 py-12" : "py-12"}>
              <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-8 flex items-center justify-between">
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
                <h2 className="mb-1 text-3xl font-bold">{group.provider}</h2>
                <p className="text-muted-foreground">{group.items.reduce((sum, g) => sum + g.services.length, 0)} deployment options available</p>
              </div>
            </div>
          </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.flatMap((g) =>
                    g.services.map((s, idx) => (
                      <DeploymentCard
                        key={`${g.service_provider}-${g.by_capability}-${s.service_name}-${idx}`}
                        title={s.service_name}
                        description={`${g.by_capability} on ${g.service_provider}`}
                        provider={g.service_provider}
                        deploymentType={s.deployment}
                        regions={g.cloud_regions?.length ? g.cloud_regions : (s.cloud_region ? s.cloud_region.split(", ") : [])}
                        capabilities={[g.by_capability]}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>
          ))
      )}
    </div>
  )
}
