"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Search, SlidersHorizontal, MoreVertical, Eye, Edit, CheckCircle, XCircle, Trash2, ExternalLink, MessageSquare, Users, User, Mail, Building2, Phone, Calendar, UserCircle, ChevronDown, ChevronUp } from "lucide-react"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"
import { RejectAgentModal } from "../../components/reject-agent-modal"
import { ISVDetailsModal } from "../../components/isv-details-modal"
import { RejectISVModal } from "../../components/reject-isv-modal"
import { ResellerDetailsModal } from "../../components/reseller-details-modal"
import { RejectResellerModal } from "../../components/reject-reseller-modal"
import { EditISVModal } from "../../components/edit-isv-modal"
import { EditResellerModal } from "../../components/edit-reseller-modal"
import { useToast } from "../../hooks/use-toast"
import { Toaster } from "../../components/ui/toaster"
import { adminService } from "../../lib/api/admin.service"
import { useAuthStore } from "../../lib/store/auth.store"
import type { AgentAPIResponse, ISVAPIResponse, ResellerAPIResponse } from "../../lib/types/admin.types"

type TabType = "agents" | "isvs" | "resellers" | "enquiries"

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>("isvs")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // API Data
  const [agents, setAgents] = useState<AgentAPIResponse[]>([])
  const [isvs, setISVs] = useState<ISVAPIResponse[]>([])
  const [resellers, setResellers] = useState<ResellerAPIResponse[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])

  // Enquiry filter states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<"all" | "new" | "read">("all")
  const [enquiryUserTypeFilter, setEnquiryUserTypeFilter] = useState<string>("all")

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set())
  const [selectedEnquiries, setSelectedEnquiries] = useState<Set<string>>(new Set())

  const toggleEnquirySelection = (enquiryId: string) => {
    setSelectedEnquiries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(enquiryId)) {
        newSet.delete(enquiryId)
      } else {
        newSet.add(enquiryId)
      }
      return newSet
    })
  }

  // Authentication and Role Check
  useEffect(() => {
    const checkAuthAndRole = () => {
      console.log('Auth check - isAuthenticated:', isAuthenticated)
      console.log('Auth check - user:', user)
      console.log('Auth check - user role:', user?.role)
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login')
        // User is not authenticated, redirect to login
        router.push('/auth/login')
        return
      }

      if (user.role !== 'admin') {
        console.log('User is not admin, redirecting to home')
        // User is authenticated but not an admin, redirect to home
        toast({
          description: "Access denied. Admin privileges required.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      console.log('User is admin, allowing access')
      // User is authenticated and is an admin, allow access
      setIsCheckingAuth(false)
    }

    // Add a small delay to ensure Zustand store is hydrated from localStorage
    const timer = setTimeout(checkAuthAndRole, 100)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, toast])

  // Modal States
  const [selectedAgent, setSelectedAgent] = useState<AgentAPIResponse | null>(null)
  const [selectedISV, setSelectedISV] = useState<ISVAPIResponse | null>(null)
  const [selectedReseller, setSelectedReseller] = useState<ResellerAPIResponse | null>(null)

  // Drawer States
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false)
  const [isvModalOpen, setISVModalOpen] = useState(false)
  const [resellerModalOpen, setResellerModalOpen] = useState(false)

  // Modal States
  const [rejectAgentModalOpen, setRejectAgentModalOpen] = useState(false)
  const [rejectISVModalOpen, setRejectISVModalOpen] = useState(false)
  const [rejectResellerModalOpen, setRejectResellerModalOpen] = useState(false)
  const [editISVModalOpen, setEditISVModalOpen] = useState(false)
  const [editResellerModalOpen, setEditResellerModalOpen] = useState(false)
  const [editAgentModalOpen, setEditAgentModalOpen] = useState(false)
  
  // Expanded rows state for enquiries
  const [expandedEnquiries, setExpandedEnquiries] = useState<Set<string>>(new Set())
  
  // Message modal state
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; company: string; message: string } | null>(null)
  
  const toggleEnquiryExpansion = (enquiryId: string) => {
    setExpandedEnquiries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(enquiryId)) {
        newSet.delete(enquiryId)
      } else {
        newSet.add(enquiryId)
      }
      return newSet
    })
  }

  // Fetch functions
  const fetchAgents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const apiAgents = await adminService.fetchAgents()
      setAgents(apiAgents)
    } catch (err: any) {
      console.error('Error fetching agents:', err)
      setError(err.message || 'Failed to fetch agents')
      toast({
        description: err.message || 'Failed to fetch agents',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchISVs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const apiISVs = await adminService.fetchISVs()
      setISVs(apiISVs)
    } catch (err: any) {
      console.error('Error fetching ISVs:', err)
      setError(err.message || 'Failed to fetch ISVs')
      toast({
        description: err.message || 'Failed to fetch ISVs',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResellers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const apiResellers = await adminService.fetchResellers()
      setResellers(apiResellers)
    } catch (err: any) {
      console.error('Error fetching resellers:', err)
      setError(err.message || 'Failed to fetch resellers')
      toast({
        description: err.message || 'Failed to fetch resellers',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEnquiries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://agents-store.onrender.com/api/enquiries', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.enquiries) {
          setEnquiries(data.enquiries)
        }
      } else {
        throw new Error('Failed to fetch enquiries')
      }
    } catch (err: any) {
      console.error('Error fetching enquiries:', err)
      setError(err.message || 'Failed to fetch enquiries')
      toast({
        description: err.message || 'Failed to fetch enquiries',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "agents") {
      fetchAgents()
    } else if (activeTab === "isvs") {
      fetchISVs()
    } else if (activeTab === "resellers") {
      fetchResellers()
    } else if (activeTab === "enquiries") {
      fetchEnquiries()
    }
  }, [activeTab])

  // Filter functions
  const getFilteredAgents = () => {
    // Return all agents without any filtering
    return agents
  }

  const getFilteredISVs = () => {
    let filtered = isvs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(isv =>
        isv.isv_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(isv =>
        statusFilter === "approved" ? isv.admin_approved === "yes" : isv.admin_approved === "no"
      )
    }

    return filtered
  }

  const getFilteredResellers = () => {
    let filtered = resellers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reseller =>
        reseller.reseller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reseller =>
        statusFilter === "approved" ? reseller.admin_approved === "yes" : reseller.admin_approved === "no"
      )
    }

    return filtered
  }

  const getFilteredEnquiries = () => {
    let filtered = enquiries

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (enquiryStatusFilter !== "all") {
      filtered = filtered.filter(enquiry =>
        enquiryStatusFilter === "new" ? enquiry.status === "new" : enquiry.status !== "new"
      )
    }

    // User type filter
    if (enquiryUserTypeFilter !== "all") {
      filtered = filtered.filter(enquiry => enquiry.user_type === enquiryUserTypeFilter)
    }

    return filtered
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return formatDate(dateString)
  }

  // Action handlers
  const handleApproveAgent = async (agent: AgentAPIResponse) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "yes" })
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve agent",
        variant: "destructive",
      })
    }
  }

  const handleRejectAgent = async (agent: AgentAPIResponse, reason: string) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "no" })
      setRejectAgentModalOpen(false)
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject agent",
        variant: "destructive",
      })
    }
  }

  const handleApproveISV = async (isv: ISVAPIResponse) => {
    try {
      await adminService.updateISV(isv.isv_id, { 
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "yes" 
      })
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve ISV",
        variant: "destructive",
      })
    }
  }

  const handleRejectISV = async (isv: ISVAPIResponse, reason: string) => {
    try {
      await adminService.updateISV(isv.isv_id, { 
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "no" 
      })
      setRejectISVModalOpen(false)
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject ISV",
        variant: "destructive",
      })
    }
  }

  const handleApproveReseller = async (reseller: ResellerAPIResponse) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, { 
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "yes" 
      })
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve reseller",
        variant: "destructive",
      })
    }
  }

  const handleRejectReseller = async (reseller: ResellerAPIResponse, reason: string) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, { 
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "no" 
      })
      setRejectResellerModalOpen(false)
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject reseller",
        variant: "destructive",
      })
    }
  }

  const handleEditISV = () => {
    setISVModalOpen(false)
    setEditISVModalOpen(true)
  }

  const handleEditReseller = () => {
    setResellerModalOpen(false)
    setEditResellerModalOpen(true)
  }

  const handleEditSuccess = () => {
    if (activeTab === "isvs") {
      fetchISVs()
    } else if (activeTab === "resellers") {
      fetchResellers()
    }
  }

  // Get unique asset types for filter
  const getAssetTypes = () => {
    const types = [...new Set(agents.map(agent => agent.asset_type).filter(Boolean))]
    return types
  }

  const getStatusBadge = (approved: "yes" | "no", isRejected: boolean = false) => {
    if (approved === "yes") {
      return (
        <span 
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: "#D1FAE5",
            color: "#065F46",
          }}
        >
          Approved
        </span>
      )
    }
    if (isRejected) {
    return (
        <span 
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
          }}
        >
          Reject
        </span>
      )
    }
    return (
      <span 
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
        style={{
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        }}
      >
        Pending
      </span>
    )
  }

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(agentId)) {
        newSet.delete(agentId)
      } else {
        newSet.add(agentId)
      }
      return newSet
    })
  }

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Get status counts for agents
  const getStatusCounts = () => {
    const all = agents.length
    const approved = agents.filter(a => a.admin_approved === "yes").length
    const pending = agents.filter(a => a.admin_approved === "no").length
    const rejected = agents.filter(a => a.admin_approved === "no").length // For now, same as pending
    return { all, approved, pending, rejected }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-white relative">
      {/* Gradient Background - Always visible for all tabs */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "229px",
          top: "0px",
          left: "0px",
          background: "radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFFFFF 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 relative z-10">
         {/* Breadcrumbs */}
         <div className="mb-4">
           <nav className="flex items-center gap-2 text-sm">
             <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
             <span className="text-gray-400">&gt;</span>
             <span className="text-gray-600">Dashboard</span>
           </nav>
        </div>

         {/* Header with Title and ONBOARD AGENT Button */}
         <div className="mb-6 flex items-start justify-between">
           <div>
             <h1 
               style={{
                 fontFamily: "Poppins, sans-serif",
                 fontWeight: 600,
                 fontStyle: "normal",
                 fontSize: "28px",
                 lineHeight: "130%",
                 letterSpacing: "0%",
                 color: "#001737",
                 margin: 0,
                 marginBottom: "8px",
               }}
             >
               Admin Dashboard
             </h1>
             <p 
               style={{
                 fontFamily: "Poppins, sans-serif",
                 fontWeight: 400,
                 fontStyle: "normal",
                 fontSize: "16px",
                 lineHeight: "150%",
                 letterSpacing: "0%",
                 verticalAlign: "middle",
                 color: "#6B7280",
                 margin: 0,
               }}
             >
               Manage agents, ISVs, and resellers
             </p>
           </div>
           {activeTab === "agents" && (
             <Button
               onClick={() => router.push("/onboard")}
               style={{
                 width: "146px",
                 height: "38px",
                 borderRadius: "4px",
                 background: "#181818",
                 fontFamily: "Poppins, sans-serif",
                 fontWeight: 400,
                 fontStyle: "normal",
                 fontSize: "14px",
                 lineHeight: "24px",
                 letterSpacing: "0px",
                 verticalAlign: "middle",
                 color: "#FFFFFF",
                 border: "none",
                 padding: 0,
                 display: "inline-flex",
                 alignItems: "center",
                 justifyContent: "center",
                 cursor: "pointer",
               }}
               className="hover:bg-[#181818]/90"
             >
               ONBOARD AGENT
             </Button>
           )}
         </div>

         {/* Main Navigation Tabs and Search/Filters - Show for all tabs */}
         <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-200">
           <div>
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "agents", label: "Agents", count: agents.length },
                 { id: "isvs", label: "ISV", count: isvs.length },
                { id: "resellers", label: "Resellers", count: resellers.length },
                 { id: "enquiries", label: "Enquiry", count: enquiries.length },
              ].map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                     style={{
                       fontFamily: "Poppins, sans-serif",
                       fontWeight: 500,
                       fontSize: "14px",
                       lineHeight: "24px",
                       color: activeTab === tab.id ? "#091917" : "#091917",
                     }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                )
              })}
            </nav>
        </div>

           {/* Search and Filters - Show for all tabs */}
           <div className="flex items-center gap-2">
             {/* Search Bar */}
             <div className="relative" style={{ width: "360px", height: "36px" }}>
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#00092C" }} />
              <Input
                 placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                 style={{
                   width: "360px",
                   height: "36px",
                   borderWidth: "1px",
                   fontFamily: "Inter, sans-serif",
                   fontWeight: 400,
                   fontStyle: "normal",
                   fontSize: "13px",
                   lineHeight: "150%",
                   letterSpacing: "0px",
                   verticalAlign: "middle",
                   color: "#ACADBA",
                 }}
               />
          </div>
          
          <div className="flex gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter === "approved" ? "Approved" : "Pending"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Asset Type Filter (only for agents) */}
            {activeTab === "agents" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Asset Type: {assetTypeFilter === "all" ? "All" : assetTypeFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setAssetTypeFilter("all")}>All</DropdownMenuItem>
                  {getAssetTypes().map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setAssetTypeFilter(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Enquiry Status Filter (only for enquiries) */}
            {activeTab === "enquiries" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Status: {enquiryStatusFilter === "all" ? "All" : enquiryStatusFilter === "new" ? "New" : "Read"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("new")}>New</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("read")}>Read</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Enquiry User Type Filter (only for enquiries) */}
            {activeTab === "enquiries" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    User Type: {enquiryUserTypeFilter === "all" ? "All" : enquiryUserTypeFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("client")}>Client</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("isv")}>ISV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("reseller")}>Reseller</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("anonymous")}>Anonymous</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setAssetTypeFilter("all")
                setEnquiryStatusFilter("all")
                setEnquiryUserTypeFilter("all")
              }}
            >
              Clear Filters
            </Button>
             </div>
          </div>
        </div>



        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => {
              if (activeTab === "agents") fetchAgents()
              else if (activeTab === "isvs") fetchISVs()
              else if (activeTab === "resellers") fetchResellers()
              else if (activeTab === "enquiries") fetchEnquiries()
            }}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Agents Table */}
            {activeTab === "agents" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                         <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>S. No</th>
                         <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>Agent Name</th>
                         <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>Asset Type</th>
                         <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>ISV ID</th>
                         <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>Status</th>
                         <th className="px-6 text-left border-b border-gray-200" style={{ 
                           height: "41px",
                           fontFamily: "Poppins, sans-serif",
                           fontWeight: 500,
                           fontStyle: "normal",
                           fontSize: "14px",
                           lineHeight: "150%",
                           letterSpacing: "0px",
                           verticalAlign: "middle",
                           color: "#111827",
                           backgroundColor: "#FFFFFF"
                         }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredAgents().map((agent, index) => {
                        const isRejected = statusFilter === "rejected" || (agent.admin_approved === "no" && false) // Can be enhanced with rejection_reason check
                         return (
                        <tr key={agent.agent_id} className="hover:bg-gray-50">
                             <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                               height: "41px",
                               fontFamily: "Poppins, sans-serif",
                               fontWeight: 400,
                               fontStyle: "normal",
                               fontSize: "14px",
                               lineHeight: "150%",
                               letterSpacing: "0px",
                               verticalAlign: "middle",
                               color: "#111827",
                               backgroundColor: "#FFFFFF"
                             }}>
                               {index + 1}
                          </td>
                             <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                               <div style={{
                                 fontFamily: "Poppins, sans-serif",
                                 fontWeight: 400,
                                 fontStyle: "normal",
                                 fontSize: "14px",
                                 lineHeight: "150%",
                                 letterSpacing: "0px",
                                 verticalAlign: "middle",
                                 color: "#111827"
                               }}>{agent.agent_name}</div>
                          </td>
                             <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                               height: "41px",
                               fontFamily: "Poppins, sans-serif",
                               fontWeight: 400,
                               fontStyle: "normal",
                               fontSize: "14px",
                               lineHeight: "150%",
                               letterSpacing: "0px",
                               verticalAlign: "middle",
                               color: "#111827",
                               backgroundColor: "#FFFFFF"
                             }}>{agent.asset_type || "-"}</td>
                             <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                               height: "41px",
                               fontFamily: "Poppins, sans-serif",
                               fontWeight: 400,
                               fontStyle: "normal",
                               fontSize: "14px",
                               lineHeight: "150%",
                               letterSpacing: "0px",
                               verticalAlign: "middle",
                               color: "#111827",
                               backgroundColor: "#FFFFFF"
                             }}>{agent.isv_id}</td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                              {getStatusBadge(agent.admin_approved, isRejected)}
                            </td>
                             <td className="px-6 whitespace-nowrap text-sm font-medium border-b border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            <div className="flex items-center gap-2">
                              <Button 
                                   variant="ghost" 
                                size="sm"
                                onClick={() => {
                                     setSelectedAgent(agent)
                                     setAgentDetailsOpen(true)
                                   }}
                                   style={{
                                     width: "45px",
                                     height: "32px",
                                     minWidth: "45px",
                                     maxWidth: "45px",
                                     minHeight: "32px",
                                     maxHeight: "32px",
                                     fontFamily: "Poppins, sans-serif",
                                     fontWeight: 500,
                                     fontSize: "14px",
                                     color: "#111827",
                                     backgroundColor: "#FFFFFF",
                                     border: "1px solid #E5E7EB",
                                     padding: 0,
                                     boxSizing: "border-box",
                                   }}
                                   className="hover:bg-gray-50"
                              >
                                View
                              </Button>
                              <Button 
                                   variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent)
                                  setEditAgentModalOpen(true)
                                }}
                                   style={{
                                     width: "45px",
                                     height: "32px",
                                     minWidth: "45px",
                                     maxWidth: "45px",
                                     minHeight: "32px",
                                     maxHeight: "32px",
                                     fontFamily: "Poppins, sans-serif",
                                     fontWeight: 500,
                                     fontSize: "14px",
                                     color: "#111827",
                                     backgroundColor: "#FFFFFF",
                                     border: "1px solid #E5E7EB",
                                     padding: 0,
                                     boxSizing: "border-box",
                                   }}
                                   className="hover:bg-gray-50"
                              >
                                Edit
                              </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                onClick={() => handleApproveAgent(agent)}
                                      className="text-green-600"
                              >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedAgent(agent)
                                  setRejectAgentModalOpen(true)
                                }}
                                      className="text-red-600"
                              >
                                      <XCircle className="mr-2 h-4 w-4" />
                                Reject
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ISVs Table */}
            {activeTab === "isvs" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>ISV Name</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Email</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Agents</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Domain</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Status</th>
                        <th className="px-6 text-left border-b border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredISVs().map((isv) => (
                        <tr key={isv.isv_id} className="hover:bg-gray-50">
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "150%", color: "#111827" }}>{isv.isv_name}</div>
                            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "150%", color: "#6B7280" }}>ID: {isv.isv_id}</div>
                          </td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>{isv.isv_email_no}</td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>
                            <span style={{ fontWeight: 500 }}>{isv.approved_agent_count}</span>
                            <span style={{ color: "#6B7280" }}>/{isv.agent_count}</span>
                          </td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>{isv.isv_domain}</td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            {getStatusBadge(isv.admin_approved)}
                          </td>
                          <td className="px-6 whitespace-nowrap text-sm font-medium border-b border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedISV(isv)
                                    setISVModalOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedISV(isv)
                                    handleEditISV()
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleApproveISV(isv)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedISV(isv)
                                    setRejectISVModalOpen(true)
                                  }}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resellers Table */}
            {activeTab === "resellers" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>S. No</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Reseller Name</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Email</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Whitelisted Domain</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Status</th>
                        <th className="px-6 text-left border-b border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredResellers().map((reseller, index) => (
                        <tr key={reseller.reseller_id} className="hover:bg-gray-50">
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>
                            {index + 1}
                          </td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            <div style={{ 
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827"
                            }}>{reseller.reseller_name}</div>
                          </td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>{reseller.reseller_email_no}</td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                            height: "41px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0px",
                            verticalAlign: "middle",
                            color: "#111827",
                            backgroundColor: "#FFFFFF"
                          }}>{reseller.whitelisted_domain}</td>
                          <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            {getStatusBadge(reseller.admin_approved)}
                          </td>
                          <td className="px-6 whitespace-nowrap border-b border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                  onClick={() => {
                                    setSelectedReseller(reseller)
                                    setResellerModalOpen(true)
                                  }}
                                style={{
                                  width: "45px",
                                  height: "32px",
                                  minWidth: "45px",
                                  maxWidth: "45px",
                                  minHeight: "32px",
                                  maxHeight: "32px",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  color: "#111827",
                                  backgroundColor: "#FFFFFF",
                                  border: "1px solid #E5E7EB",
                                  padding: 0,
                                  boxSizing: "border-box",
                                }}
                                className="hover:bg-gray-50"
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                  onClick={() => {
                                    setSelectedReseller(reseller)
                                    handleEditReseller()
                                  }}
                                style={{
                                  width: "45px",
                                  height: "32px",
                                  minWidth: "45px",
                                  maxWidth: "45px",
                                  minHeight: "32px",
                                  maxHeight: "32px",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  color: "#111827",
                                  backgroundColor: "#FFFFFF",
                                  border: "1px solid #E5E7EB",
                                  padding: 0,
                                  boxSizing: "border-box",
                                }}
                                className="hover:bg-gray-50"
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (
          <>
            {activeTab === "agents" && getFilteredAgents().length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
            {activeTab === "isvs" && getFilteredISVs().length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ISVs found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
            {activeTab === "resellers" && getFilteredResellers().length === 0 && (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resellers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}

            {/* Enquiries Table */}
            {activeTab === "enquiries" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>S. No</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Name</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Company</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Email</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Phone</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>User Type</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Date</th>
                        <th className="px-6 text-left border-b border-r border-gray-200" style={{ 
                          height: "41px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#111827",
                          backgroundColor: "#FFFFFF"
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredEnquiries().map((enquiry, index) => {
                        return (
                            <tr 
                              key={enquiry.enquiry_id} 
                            className={`hover:bg-gray-50 ${enquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}
                          >
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                              {index + 1}
                            </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                                    {enquiry.full_name || 'Unknown'}
                              </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                              {enquiry.company_name || '-'}
                              </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200 truncate max-w-[200px]" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                                  {enquiry.email || '-'}
                              </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                                  {enquiry.phone || '-'}
                              </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                                {enquiry.user_type && enquiry.user_type !== 'anonymous' ? (
                                  <span style={{ 
                                    fontFamily: "Poppins, sans-serif", 
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0px",
                                    verticalAlign: "middle",
                                    color: "#111827" 
                                  }}>
                                    {enquiry.user_type.toUpperCase()}
                                  </span>
                                ) : (
                                  <span style={{ 
                                    fontFamily: "Poppins, sans-serif", 
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0px",
                                    verticalAlign: "middle",
                                    color: "#6B7280" 
                                  }}>Anonymous</span>
                                )}
                              </td>
                            <td className="px-6 whitespace-nowrap border-b border-r border-gray-200" style={{ 
                              height: "41px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0px",
                              verticalAlign: "middle",
                              color: "#111827",
                              backgroundColor: "#FFFFFF"
                            }}>
                              {formatDate(enquiry.created_at)}
                            </td>
                            <td className="px-6 whitespace-nowrap border-b border-gray-200" style={{ height: "41px", backgroundColor: "#FFFFFF" }}>
                              <div className="flex items-center gap-2">
                                {enquiry.status === 'new' ? (
                                  <span 
                                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                      backgroundColor: "#FEF3C7",
                                      color: "#92400E",
                                      fontFamily: "Poppins, sans-serif",
                                    }}
                                  >
                                    New
                                  </span>
                                ) : (
                                  <Badge variant="outline" className="text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
                                    Read
                                  </Badge>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedMessage({
                                      name: enquiry.full_name || 'Unknown',
                                      company: enquiry.company_name || '',
                                      message: enquiry.message || 'No message provided'
                                    })
                                    setMessageModalOpen(true)
                                  }}
                                  style={{
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => toggleEnquiryExpansion(enquiry.enquiry_id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      // Add edit functionality if needed
                                    }}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                            </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {getFilteredEnquiries().length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">No enquiries found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals and Drawers */}
      {selectedAgent && (
        <>
          <AgentPreviewModal
            agent={selectedAgent}
            open={agentDetailsOpen}
            onOpenChange={setAgentDetailsOpen}
            onApprove={handleApproveAgent}
            onReject={() => setRejectAgentModalOpen(true)}
          />
          <EditAgentModal
            agent={selectedAgent}
            open={editAgentModalOpen}
            onOpenChange={setEditAgentModalOpen}
            onSave={() => {
              // Refresh agent list after successful save
              fetchAgents()
              setEditAgentModalOpen(false)
            }}
          />
          <RejectAgentModal
            agent={selectedAgent}
            open={rejectAgentModalOpen}
            onOpenChange={setRejectAgentModalOpen}
            onReject={handleRejectAgent}
          />
        </>
      )}

      {selectedISV && (
        <>
          <ISVDetailsModal
            isv={selectedISV}
            open={isvModalOpen}
            onOpenChange={setISVModalOpen}
            onApprove={handleApproveISV}
            onReject={() => setRejectISVModalOpen(true)}
            onEdit={handleEditISV}
          />
          <RejectISVModal
            isv={selectedISV}
            open={rejectISVModalOpen}
            onOpenChange={setRejectISVModalOpen}
            onReject={handleRejectISV}
          />
          <EditISVModal
            isv={selectedISV}
            open={editISVModalOpen}
            onOpenChange={setEditISVModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      {selectedReseller && (
        <>
          <ResellerDetailsModal
            reseller={selectedReseller}
            open={resellerModalOpen}
            onOpenChange={setResellerModalOpen}
            onApprove={handleApproveReseller}
            onReject={() => setRejectResellerModalOpen(true)}
            onEdit={handleEditReseller}
          />
          <RejectResellerModal
            reseller={selectedReseller}
            open={rejectResellerModalOpen}
            onOpenChange={setRejectResellerModalOpen}
            onReject={handleRejectReseller}
          />
          <EditResellerModal
            reseller={selectedReseller}
            open={editResellerModalOpen}
            onOpenChange={setEditResellerModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      <Toaster />

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent 
          className="max-w-2xl"
          style={{
            width: "430px",
            height: "228px",
            maxWidth: "430px",
            maxHeight: "228px",
            padding: "24px",
            fontFamily: "Poppins, sans-serif"
          }}
        >
          <DialogHeader style={{
            width: "385px",
            height: "38px",
            marginBottom: "16px",
            textAlign: "left",
            fontFamily: "Poppins, sans-serif"
          }}>
            <DialogTitle style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#111827",
              marginBottom: "8px",
              textAlign: "left"
            }}>
              {selectedMessage?.name}
            </DialogTitle>
            {selectedMessage?.company && (
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "16px",
                textAlign: "left",
                marginTop: 0
              }}>
                {selectedMessage.company}
              </p>
            )}
          </DialogHeader>
          <div style={{
            width: "372px",
            height: "131px",
            margin: "0 auto",
            textAlign: "left",
            fontFamily: "Poppins, sans-serif"
          }}>
            <h4 style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              marginBottom: "8px",
              textAlign: "left"
            }}>
              Message
            </h4>
            <div className="bg-white border rounded-lg" style={{
              borderColor: "#E5E7EB",
              width: "372px",
              height: "auto",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "16px 16px 30px 16px",
              boxSizing: "border-box",
              textAlign: "left",
              fontFamily: "Poppins, sans-serif"
            }}>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#374151",
                whiteSpace: "pre-wrap",
                lineHeight: "1.75",
                margin: 0,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                textAlign: "left"
              }}>
                {selectedMessage?.message}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}