"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useAuthStore } from "../../lib/store/auth.store"
import { useToast } from "../../hooks/use-toast"

type Agent = {
  agent_id: string
  admin_approved: string
  isv_id: string
  asset_type?: string
  by_persona?: string
  by_value?: string
  agent_name: string
  demo_link?: string
  description?: string
  tags?: string
  demo_preview?: string
  updated_at?: string
}

type ApiResponse = {
  isv: {
    isv_id: string
    isv_name: string
    isv_address?: string
    isv_email_no?: string
    admin_approved?: string
  }
  agents: Agent[]
  statistics: {
    total_agents: number
    approved_agents: number
    total_capabilities: number
    isv_approved: boolean
  }
}

const statusStyle: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Authentication and role check
  useEffect(() => {
    const checkAuthAndRole = () => {
      if (!isAuthenticated || !user) {
        router.push('/auth/login')
        return
      }

      if (user.role === 'admin') {
        router.push('/admin')
        return
      }

      if (user.role === 'reseller') {
        toast({
          description: "Dashboard is not available for resellers.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      // Allow ISV and client users to access dashboard
      setIsCheckingAuth(false)
    }

    checkAuthAndRole()
  }, [isAuthenticated, user, router, toast])

  // Get ISV ID from user
  const isvId = user?.user_id || null

  useEffect(() => {
    if (isCheckingAuth || !isvId) return
    
    let abort = false
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load ISV profile: ${res.status}`)
        const json: ApiResponse = await res.json()
        if (!abort) setData(json)
      } catch (e: any) {
        if (!abort) setError(e?.message || "Something went wrong")
      } finally {
        if (!abort) setLoading(false)
      }
    }
    fetchData()
    return () => {
      abort = true
    }
  }, [isCheckingAuth, isvId])

  function toStatus(s: string): "Approved" | "Pending" | "Rejected" {
    const v = (s || "").toLowerCase()
    if (v === "yes" || v === "approved") return "Approved"
    if (v === "pending") return "Pending"
    return "Rejected"
  }

  const agents = data?.agents || []
  const counts = useMemo(() => {
    const c = { all: agents.length, approved: 0, pending: 0, rejected: 0 }
    for (const a of agents) {
      const s = toStatus(a.admin_approved)
      if (s === "Approved") c.approved++
      else if (s === "Pending") c.pending++
      else c.rejected++
    }
    return c
  }, [agents])

  const filteredAgents = useMemo(() => {
    if (filter === "all") return agents
    return agents.filter((a) => {
      const s = toStatus(a.admin_approved)
      return (
        (filter === "approved" && s === "Approved") ||
        (filter === "pending" && s === "Pending") ||
        (filter === "rejected" && s === "Rejected")
      )
    })
  }, [agents, filter])

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      {isCheckingAuth ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Agent Details</h1>
              <p className="text-sm text-gray-600">
                {data?.isv?.isv_name ? `${data.isv.isv_name} - ` : ''}ISVs with us to showcase your AI solutions to our enterprise clients.
              </p>
            </div>
            <div>
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={() => router.push('/onboard')}
              >
                Onboard Agent
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 justify-end">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({counts.all})
            </Button>
            <Button variant={filter === "approved" ? "default" : "outline"} size="sm" onClick={() => setFilter("approved")}>
              Approved ({counts.approved})
            </Button>
            <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
              Pending ({counts.pending})
            </Button>
            <Button variant={filter === "rejected" ? "default" : "outline"} size="sm" onClick={() => setFilter("rejected")}>
              Rejected ({counts.rejected})
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-3 text-sm text-gray-600">Loading...</div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S. No</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Organisation Name</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((a, idx) => {
                    const status = toStatus(a.admin_approved)
                    return (
                      <TableRow key={a.agent_id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-medium">{a.agent_name}</TableCell>
                        <TableCell>{a.asset_type || "-"}</TableCell>
                        <TableCell>{data?.isv?.isv_name || a.isv_id}</TableCell>
                        <TableCell>English</TableCell>
                        <TableCell>{a.updated_at || "—"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${statusStyle[status]}`}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


 
