"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu"
import { Search, SlidersHorizontal, MoreVertical, Eye, Edit, CheckCircle, XCircle, Trash2, ExternalLink, MessageSquare, Users, User, Mail, Building2, Phone, Calendar, UserCircle, ChevronDown, ChevronUp, ArrowUpDown, MessageCircle } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<TabType>("agents")
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
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "reject">("all")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")

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
    let filtered = agents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(agent => {
        if (statusFilter === "approved") {
          return agent.admin_approved === "yes"
        } else if (statusFilter === "pending") {
          return !agent.admin_approved || agent.admin_approved === "" || agent.admin_approved === null
        } else {
          return agent.admin_approved === "no"
        }
      })
    }

    // Asset type filter
    if (assetTypeFilter !== "all") {
      filtered = filtered.filter(agent => agent.asset_type === assetTypeFilter)
    }

    return filtered
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

  // Format date to readable format matching screenshot
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

  // Format date exactly as shown in screenshot: "Oct 28, 2025, 10:26 PM"
  const formatEnquiryDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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

  const getStatusBadge = (approved: "yes" | "no" | "pending") => {
    if (approved === "yes") {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full px-3 py-1 text-xs font-medium">
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 rounded-full px-3 py-1 text-xs font-medium">
        Pending
      </Badge>
    )
  }

  const getRejectBadge = () => {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full px-3 py-1 text-xs font-medium">
        Reject
      </Badge>
    )
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage agents, ISVs, and resellers</p>
        </div>

        {/* Tabs and Search/Filters Row */}
        <div className="mb-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            {/* Tabs */}
            <div className="flex-1">
              <nav className="flex space-x-8">
                {[
                  { id: "agents", label: "Agents" },
                  { id: "isvs", label: "ISVs" },
                  { id: "resellers", label: "Reseller" },
                  { id: "enquiries", label: "Enquiry" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Status: {statusFilter === "all" ? "All" : statusFilter === "approved" ? "Approved" : statusFilter === "pending" ? "Pending" : "Reject"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("reject")}>Reject</DropdownMenuItem>
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
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">S. No</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Agent Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Asset Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">ISV ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredAgents().map((agent, index) => (
                        <tr key={agent.agent_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{String(index + 1).padStart(5, '0')}</td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                            <div className="text-sm font-medium text-gray-900">{agent.agent_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{agent.asset_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{agent.isv_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                            {agent.admin_approved === "yes" 
                              ? getStatusBadge("yes")
                              : agent.admin_approved === "no"
                                ? getRejectBadge()
                                : getStatusBadge("pending")
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-300">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  router.push(`/agents/${agent.agent_id}`)
                                }}
                                className="h-8"
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent)
                                  setEditAgentModalOpen(true)
                                }}
                                className="h-8"
                              >
                                Edit
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      router.push(`/agents/${agent.agent_id}`)
                                    }}
                                    className="cursor-pointer"
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleApproveAgent(agent)}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedAgent(agent)
                                      setRejectAgentModalOpen(true)
                                    }}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={async () => {
                                      if (confirm(`Are you sure you want to delete ${agent.agent_name}?`)) {
                                        try {
                                          // Add delete API call here if available
                                          await fetch(`https://agents-store.onrender.com/api/admin/agents/${agent.agent_id}`, {
                                            method: 'DELETE',
                                            credentials: 'include'
                                          })
                                          await fetchAgents()
                                          toast({
                                            description: `${agent.agent_name} has been deleted.`,
                                          })
                                        } catch (err: any) {
                                          toast({
                                            description: err.message || "Failed to delete agent",
                                            variant: "destructive",
                                          })
                                        }
                                      }
                                    }}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ISVs Table */}
            {activeTab === "isvs" && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">ISVs ({getFilteredISVs().length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISV Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredISVs().map((isv) => (
                        <tr key={isv.isv_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{isv.isv_name}</div>
                            <div className="text-sm text-gray-500">ID: {isv.isv_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{isv.isv_email_no}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-medium">{isv.approved_agent_count}</span>
                            <span className="text-gray-500">/{isv.agent_count}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{isv.isv_domain}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(isv.admin_approved)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Resellers ({getFilteredResellers().length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reseller Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Whitelisted Domain</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredResellers().map((reseller) => (
                        <tr key={reseller.reseller_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reseller.reseller_name}</div>
                            <div className="text-sm text-gray-500">ID: {reseller.reseller_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reseller.reseller_email_no}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reseller.whitelisted_domain}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(reseller.admin_approved)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedReseller(reseller)
                                    setResellerModalOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedReseller(reseller)
                                    handleEditReseller()
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleApproveReseller(reseller)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedReseller(reseller)
                                    setRejectResellerModalOpen(true)
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
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            S. No
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Name
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Company
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Email
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Phone
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            User Type
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Date
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                          <div className="flex items-center gap-1">
                            Status
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {getFilteredEnquiries().map((enquiry, index) => (
                        <tr key={enquiry.enquiry_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {String(index + 1).padStart(5, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.full_name || 'Unknown'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {enquiry.company_name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {enquiry.email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {enquiry.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {enquiry.user_type && enquiry.user_type !== 'anonymous' 
                              ? enquiry.user_type.charAt(0).toUpperCase() + enquiry.user_type.slice(1)
                              : 'Ananomous'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                            {enquiry.created_at ? formatEnquiryDate(enquiry.created_at) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                            {enquiry.status === 'new' ? (
                              <Badge className="bg-amber-100 text-orange-700 border-amber-200 rounded-md px-2.5 py-1 text-xs font-medium">
                                New
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 border-gray-200 rounded-md px-2.5 py-1 text-xs font-medium">
                                Read
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-300">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                title="View message"
                              >
                                <MessageCircle className="h-4 w-4 text-gray-600" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Handle view action
                                    }}
                                    className="cursor-pointer"
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Handle mark as read action
                                    }}
                                    className="cursor-pointer hover:bg-gray-100"
                                  >
                                    Mark as Read
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={async () => {
                                      if (confirm(`Are you sure you want to delete this enquiry?`)) {
                                        try {
                                          await fetch(`https://agents-store.onrender.com/api/enquiries/${enquiry.enquiry_id}`, {
                                            method: 'DELETE',
                                            credentials: 'include'
                                          })
                                          await fetchEnquiries()
                                          toast({
                                            description: 'Enquiry has been deleted.',
                                          })
                                        } catch (err: any) {
                                          toast({
                                            description: err.message || "Failed to delete enquiry",
                                            variant: "destructive",
                                          })
                                        }
                                      }
                                    }}
                                    className="cursor-pointer hover:bg-gray-100 text-red-600"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
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
    </div>
  )
}