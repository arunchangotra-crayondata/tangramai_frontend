"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, SlidersHorizontal, MoreVertical, Headphones, Users, User, MessageSquare } from "lucide-react"
import { AgentDetailsDrawer } from "@/components/agent-details-drawer"
import { RejectAgentModal } from "@/components/reject-agent-modal"
import { ISVDetailsDrawer } from "@/components/isv-details-drawer"
import { RejectISVModal } from "@/components/reject-isv-modal"
import { ResellerDetailsDrawer } from "@/components/reseller-details-drawer"
import { RejectResellerModal } from "@/components/reject-reseller-modal"
import { EnterpriseDetailsDrawer } from "@/components/enterprise-details-drawer"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { adminService } from "@/lib/api/admin.service"
import type { AgentAPIResponse, ISVAPIResponse, ResellerAPIResponse } from "@/lib/types/admin.types"

type AgentStatus = "Pending" | "Approved" | "Reject"
type ISVProcessingStatus = "Pending" | "Approved"
type ISVStatus = "Active" | "Inactive"
type ResellerProcessingStatus = "Pending" | "Approved" | "Reject"
type ResellerStatus = "Active" | "Inactive"

interface Agent {
  id: string
  serialNo: string
  name: string
  category: string
  organisation: string
  language: string
  createdBy: {
    name: string
    avatar: string
  }
  lastUpdated: string
  status: AgentStatus
  rejectionReason?: string
  productName?: string
  assetType?: string
  description?: string
  categories?: string[]
  targetPersona?: string[]
  businessValue?: string[]
}

interface ISV {
  id: string
  serialNo: string
  name: string
  avatar: string
  position: string
  orgName: string
  agentCount: number
  registeredName: string
  processingStatus: ISVProcessingStatus
  domain: string
  contact: string
  status: ISVStatus
  registeredAddress?: string
  mouFile?: {
    name: string
    url: string
  }
}

interface Reseller {
  id: string
  serialNo: string
  userName: string
  avatar: string
  position: string
  registeredName: string
  contact: string
  processingStatus: ResellerProcessingStatus
  domain: string
  status: ResellerStatus
  registeredAddress?: string
  rejectionReason?: string
  logo?: {
    name: string
    url: string
  }
}

interface EnterpriseUser {
  id: string
  serialNo: string
  userName: string
  avatar: string
  email: string
  company: string
  contactNumber: string
  techStack: string[]
}

const mockAgents: Agent[] = [
  {
    id: "1",
    serialNo: "12345",
    name: "Travel AI",
    category: "Productivity",
    organisation: "Organisation Name",
    language: "Chat GPT 4.0",
    createdBy: { name: "Merlin", avatar: "M" },
    lastUpdated: "20 April 2025",
    status: "Pending",
    productName: "Travel AI Assistant",
    assetType: "Conversational Agent",
    description: "AI-powered travel planning and booking assistant",
    categories: ["Conversational AI & Advisory", "Process Automation"],
    targetPersona: ["Developer", "Business User"],
    businessValue: ["Cost Reduction", "Efficiency Improvement"],
  },
  {
    id: "2",
    serialNo: "12345",
    name: "CXO Concierge",
    category: "Accelerator",
    organisation: "Organisation Name",
    language: "Lama",
    createdBy: { name: "Sonia", avatar: "S" },
    lastUpdated: "20 April 2025",
    status: "Approved",
    productName: "CXO Concierge",
    assetType: "Advisory Agent",
    description: "Executive-level AI assistant for strategic decision making",
    categories: ["Conversational AI & Advisory"],
    targetPersona: ["Executive"],
    businessValue: ["Strategic Insights"],
  },
  {
    id: "3",
    serialNo: "12345",
    name: "Data Studio",
    category: "Data",
    organisation: "Organisation Name",
    language: "Chat GPT 4.0",
    createdBy: { name: "Mathew", avatar: "M" },
    lastUpdated: "20 April 2025",
    status: "Reject",
    rejectionReason: "Missing required documentation and demo links",
    productName: "Data Studio",
    assetType: "Analytics Agent",
    description: "Data analysis and visualization platform",
    categories: ["Data Analysis and Insights", "Image Processing"],
    targetPersona: ["Developer", "Data Analyst"],
    businessValue: ["Cost Reduction", "Data-Driven Decisions"],
  },
]

const mockISVs: ISV[] = [
  {
    id: "1",
    serialNo: "12345",
    name: "Sonia",
    avatar: "S",
    position: "Manager",
    orgName: "Org Name",
    agentCount: 4,
    registeredName: "Lorem Ipsum",
    processingStatus: "Approved",
    domain: "Lorem Ipsum",
    contact: "+91 9876543210",
    status: "Active",
    registeredAddress: "123 Business Street, Tech City, TC 12345",
    mouFile: {
      name: "mou.pdf",
      url: "#",
    },
  },
  {
    id: "2",
    serialNo: "12345",
    name: "Merlin",
    avatar: "M",
    position: "Manager",
    orgName: "Org Name",
    agentCount: 2,
    registeredName: "Lorem Ipsum",
    processingStatus: "Approved",
    domain: "Lorem Ipsum",
    contact: "+91 9876543210",
    status: "Active",
    registeredAddress: "456 Enterprise Ave, Business Park, BP 67890",
    mouFile: {
      name: "mou.pdf",
      url: "#",
    },
  },
  {
    id: "3",
    serialNo: "12345",
    name: "Joseph",
    avatar: "J",
    position: "Sr. Manager",
    orgName: "Org Name",
    agentCount: 1,
    registeredName: "Lorem Ipsum",
    processingStatus: "Pending",
    domain: "-",
    contact: "+91 9876543210",
    status: "Inactive",
    registeredAddress: "789 Startup Lane, Innovation Hub, IH 11223",
    mouFile: {
      name: "mou.pdf",
      url: "#",
    },
  },
]

const mockResellers: Reseller[] = [
  {
    id: "1",
    serialNo: "12345",
    userName: "James",
    avatar: "J",
    position: "Lorem Ipsum",
    registeredName: "Lorem Ipsum",
    contact: "+91 9876543210",
    processingStatus: "Pending",
    domain: "-",
    status: "Active",
    registeredAddress: "123 Business Street, Tech City, TC 12345",
    logo: {
      name: "logo.png",
      url: "#",
    },
  },
  {
    id: "2",
    serialNo: "12345",
    userName: "Gerald",
    avatar: "G",
    position: "Lorem Ipsum",
    registeredName: "Lorem Ipsum",
    contact: "+91 9876543210",
    processingStatus: "Approved",
    domain: "Domain",
    status: "Active",
    registeredAddress: "456 Enterprise Ave, Business Park, BP 67890",
    logo: {
      name: "logo.png",
      url: "#",
    },
  },
  {
    id: "3",
    serialNo: "12345",
    userName: "Anna",
    avatar: "A",
    position: "Lorem Ipsum",
    registeredName: "Lorem Ipsum",
    contact: "+91 9876543210",
    processingStatus: "Approved",
    domain: "Domain",
    status: "Inactive",
    registeredAddress: "789 Startup Lane, Innovation Hub, IH 11223",
    logo: {
      name: "logo.png",
      url: "#",
    },
  },
  {
    id: "4",
    serialNo: "12345",
    userName: "Andrew",
    avatar: "A",
    position: "Lorem Ipsum",
    registeredName: "Lorem Ipsum",
    contact: "+91 9876543210",
    processingStatus: "Reject",
    domain: "Domain",
    status: "Inactive",
    registeredAddress: "321 Commerce Road, Market District, MD 44556",
    rejectionReason: "Incomplete documentation and missing business verification",
    logo: {
      name: "logo.png",
      url: "#",
    },
  },
]

const mockEnterpriseUsers: EnterpriseUser[] = [
  {
    id: "1",
    serialNo: "12345",
    userName: "Mathew",
    avatar: "M",
    email: "mathew@mail.com",
    company: "company name",
    contactNumber: "#91 9876543210",
    techStack: ["AWS", "Azure"],
  },
  {
    id: "2",
    serialNo: "12345",
    userName: "Andrew",
    avatar: "A",
    email: "andrew@mail.com",
    company: "company name",
    contactNumber: "#91 9876543210",
    techStack: ["Azure"],
  },
  {
    id: "3",
    serialNo: "12345",
    userName: "Jerry",
    avatar: "J",
    email: "jerry@mail.com",
    company: "company name",
    contactNumber: "#91 9876543210",
    techStack: ["AWS"],
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"Agents" | "ISVs" | "Reseller" | "Enterprise">("Agents")
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [agentToReject, setAgentToReject] = useState<Agent | null>(null)
  const [isvs, setISVs] = useState<ISV[]>([])
  const [selectedISV, setSelectedISV] = useState<ISV | null>(null)
  const [isISVDrawerOpen, setIsISVDrawerOpen] = useState(false)
  const [isRejectISVModalOpen, setIsRejectISVModalOpen] = useState(false)
  const [isvToReject, setISVToReject] = useState<ISV | null>(null)
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null)
  const [isResellerDrawerOpen, setIsResellerDrawerOpen] = useState(false)
  const [isRejectResellerModalOpen, setIsRejectResellerModalOpen] = useState(false)
  const [resellerToReject, setResellerToReject] = useState<Reseller | null>(null)
  const [enterpriseUsers, setEnterpriseUsers] = useState<EnterpriseUser[]>(mockEnterpriseUsers)
  const [selectedEnterpriseUser, setSelectedEnterpriseUser] = useState<EnterpriseUser | null>(null)
  const [isEnterpriseDrawerOpen, setIsEnterpriseDrawerOpen] = useState(false)
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)
  const [isLoadingISVs, setIsLoadingISVs] = useState(false)
  const [isLoadingResellers, setIsLoadingResellers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper function to map API data to frontend format
  const mapAgentFromAPI = (apiAgent: AgentAPIResponse, index: number): Agent => {
    return {
      id: apiAgent.agent_id,
      serialNo: String(index + 1).padStart(5, '0'),
      name: apiAgent.agent_name || 'Unknown',
      category: apiAgent.asset_type || 'AI Agent',
      organisation: 'Organisation', // Will need to fetch from ISV if needed
      language: 'English',
      createdBy: {
        name: apiAgent.created_by || 'Unknown',
        avatar: (apiAgent.created_by || 'U')[0].toUpperCase(),
      },
      lastUpdated: apiAgent.last_updated || new Date().toISOString(),
      status: apiAgent.status,
      rejectionReason: apiAgent.rejection_reason,
      productName: apiAgent.agent_name,
      assetType: apiAgent.asset_type,
      description: apiAgent.description,
    }
  }

  const mapISVFromAPI = (apiISV: ISVAPIResponse, index: number): ISV => {
    return {
      id: apiISV.isv_id,
      serialNo: String(index + 1).padStart(5, '0'),
      name: apiISV.isv_name || 'Unknown',
      avatar: (apiISV.isv_name || 'U')[0].toUpperCase(),
      position: 'ISV',
      orgName: apiISV.registered_name || apiISV.isv_name || 'Unknown',
      agentCount: apiISV.agent_count || 0,
      registeredName: apiISV.registered_name || apiISV.isv_name || '',
      processingStatus: apiISV.processing_status,
      domain: apiISV.isv_domain || '-',
      contact: apiISV.isv_mob_no || 'N/A',
      status: apiISV.status,
      registeredAddress: apiISV.isv_address,
    }
  }

  const mapResellerFromAPI = (apiReseller: ResellerAPIResponse, index: number): Reseller => {
    return {
      id: apiReseller.reseller_id,
      serialNo: String(index + 1).padStart(5, '0'),
      userName: apiReseller.reseller_name || 'Unknown',
      avatar: (apiReseller.reseller_name || 'U')[0].toUpperCase(),
      position: 'Reseller',
      registeredName: apiReseller.registered_name || apiReseller.reseller_name || '',
      contact: apiReseller.reseller_mob_no || 'N/A',
      processingStatus: apiReseller.processing_status,
      domain: apiReseller.reseller_domain || '-',
      status: apiReseller.status,
      registeredAddress: apiReseller.reseller_address,
      rejectionReason: apiReseller.rejection_reason,
    }
  }

  // Fetch functions
  const fetchAgents = async () => {
    setIsLoadingAgents(true)
    setError(null)
    try {
      const apiAgents = await adminService.fetchAgents()
      const mappedAgents = apiAgents.map((agent, index) => mapAgentFromAPI(agent, index))
      setAgents(mappedAgents)
    } catch (err: any) {
      console.error('Error fetching agents:', err)
      setError(err.message || 'Failed to fetch agents')
      toast({
        description: err.message || 'Failed to fetch agents',
        variant: "destructive",
      })
    } finally {
      setIsLoadingAgents(false)
    }
  }

  const fetchISVs = async () => {
    setIsLoadingISVs(true)
    setError(null)
    try {
      const apiISVs = await adminService.fetchISVs()
      const mappedISVs = apiISVs.map((isv, index) => mapISVFromAPI(isv, index))
      setISVs(mappedISVs)
    } catch (err: any) {
      console.error('Error fetching ISVs:', err)
      setError(err.message || 'Failed to fetch ISVs')
      toast({
        description: err.message || 'Failed to fetch ISVs',
        variant: "destructive",
      })
    } finally {
      setIsLoadingISVs(false)
    }
  }

  const fetchResellers = async () => {
    setIsLoadingResellers(true)
    setError(null)
    try {
      const apiResellers = await adminService.fetchResellers()
      const mappedResellers = apiResellers.map((reseller, index) => mapResellerFromAPI(reseller, index))
      setResellers(mappedResellers)
    } catch (err: any) {
      console.error('Error fetching resellers:', err)
      setError(err.message || 'Failed to fetch resellers')
      toast({
        description: err.message || 'Failed to fetch resellers',
        variant: "destructive",
      })
    } finally {
      setIsLoadingResellers(false)
    }
  }

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "Agents") {
      fetchAgents()
    } else if (activeTab === "ISVs") {
      fetchISVs()
    } else if (activeTab === "Reseller") {
      fetchResellers()
    }
  }, [activeTab])

  const handleApprove = async (agent: Agent) => {
    try {
      await adminService.updateAgent(agent.id, { status: "Approved" })
      setIsDrawerOpen(false)
      await fetchAgents() // Refresh the list
      toast({
        description: `${agent.name} agent has been approved successfully.`,
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve agent",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (agent: Agent, reason: string) => {
    try {
      await adminService.updateAgent(agent.id, { 
        status: "Reject", 
        rejection_reason: reason 
      })
      setIsRejectModalOpen(false)
      setIsDrawerOpen(false)
      await fetchAgents() // Refresh the list
      toast({
        description: "Agent has been rejected and comment captured successfully.",
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject agent",
        variant: "destructive",
      })
    }
  }

  const handleUndo = (agentId: string, previousStatus: AgentStatus) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: previousStatus } : a)))
  }

  const handleView = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsDrawerOpen(true)
  }

  const handleRejectClick = (agent: Agent) => {
    setAgentToReject(agent)
    setIsRejectModalOpen(true)
  }

  const handleISVApprove = async (isv: ISV) => {
    try {
      await adminService.updateISV(isv.id, { 
        processing_status: "Approved",
        status: "Active"
      })
      setIsISVDrawerOpen(false)
      await fetchISVs() // Refresh the list
      toast({
        description: `${isv.name} ISV has been approved successfully.`,
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve ISV",
        variant: "destructive",
      })
    }
  }

  const handleISVReject = async (isv: ISV, reason: string) => {
    try {
      await adminService.updateISV(isv.id, { 
        processing_status: "Pending",
        status: "Inactive",
        rejection_reason: reason
      })
      setIsRejectISVModalOpen(false)
      setIsISVDrawerOpen(false)
      await fetchISVs() // Refresh the list
      toast({
        description: "ISV has been rejected and comment captured successfully.",
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject ISV",
        variant: "destructive",
      })
    }
  }

  const handleISVUndo = (isvId: string, previousProcessingStatus: ISVProcessingStatus, previousStatus: ISVStatus) => {
    // Undo functionality - would need backend support
    console.log('Undo not yet implemented for ISV')
  }

  const handleISVView = (isv: ISV) => {
    setSelectedISV(isv)
    setIsISVDrawerOpen(true)
  }

  const handleISVRejectClick = (isv: ISV) => {
    setISVToReject(isv)
    setIsRejectISVModalOpen(true)
  }

  const handleISVUpdate = async (isv: ISV, newStatus: ISVStatus) => {
    try {
      await adminService.updateISV(isv.id, { status: newStatus })
      setIsISVDrawerOpen(false)
      await fetchISVs() // Refresh the list
      toast({
        description: "ISV details updated successfully.",
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to update ISV",
        variant: "destructive",
      })
    }
  }

  const handleResellerApprove = async (reseller: Reseller) => {
    try {
      await adminService.updateReseller(reseller.id, { 
        processing_status: "Approved",
        status: "Active"
      })
      setIsResellerDrawerOpen(false)
      await fetchResellers() // Refresh the list
      toast({
        description: `${reseller.userName} reseller has been approved successfully.`,
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve reseller",
        variant: "destructive",
      })
    }
  }

  const handleResellerReject = async (reseller: Reseller, reason: string) => {
    try {
      await adminService.updateReseller(reseller.id, { 
        processing_status: "Reject",
        status: "Inactive",
        rejection_reason: reason
      })
      setIsRejectResellerModalOpen(false)
      setIsResellerDrawerOpen(false)
      await fetchResellers() // Refresh the list
      toast({
        description: "Reseller has been rejected successfully.",
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject reseller",
        variant: "destructive",
      })
    }
  }

  const handleResellerUndo = (
    resellerId: string,
    previousProcessingStatus: ResellerProcessingStatus,
    previousStatus: ResellerStatus,
  ) => {
    setResellers((prev) =>
      prev.map((r) =>
        r.id === resellerId ? { ...r, processingStatus: previousProcessingStatus, status: previousStatus } : r,
      ),
    )
  }

  const handleResellerView = (reseller: Reseller) => {
    setSelectedReseller(reseller)
    setIsResellerDrawerOpen(true)
  }

  const handleResellerRejectClick = (reseller: Reseller) => {
    setResellerToReject(reseller)
    setIsRejectResellerModalOpen(true)
  }

  const handleResellerUpdate = async (reseller: Reseller, newStatus: ResellerStatus) => {
    try {
      await adminService.updateReseller(reseller.id, { status: newStatus })
      setIsResellerDrawerOpen(false)
      await fetchResellers() // Refresh the list
      toast({
        description: "Reseller details updated successfully.",
        className: "bg-[#1a1a1a] text-white border-none",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to update reseller",
        variant: "destructive",
      })
    }
  }

  const handleEnterpriseView = (user: EnterpriseUser) => {
    setSelectedEnterpriseUser(user)
    setIsEnterpriseDrawerOpen(true)
  }

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Pending</Badge>
      case "Approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>
      case "Reject":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Reject</Badge>
    }
  }

  const getISVProcessingStatusBadge = (status: ISVProcessingStatus) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Pending</Badge>
      case "Approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>
    }
  }

  const getISVStatusBadge = (status: ISVStatus) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Inactive</Badge>
    }
  }

  const getResellerProcessingStatusBadge = (status: ResellerProcessingStatus) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Pending</Badge>
      case "Approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>
      case "Reject":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Reject</Badge>
    }
  }

  const getResellerStatusBadge = (status: ResellerStatus) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Inactive</Badge>
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = {
      M: "bg-teal-500",
      S: "bg-yellow-500",
    }
    return colors[name as keyof typeof colors] || "bg-purple-500"
  }

  const getISVAvatarColor = (name: string) => {
    const colors = {
      S: "bg-yellow-500",
      M: "bg-teal-500",
      J: "bg-orange-500",
    }
    return colors[name as keyof typeof colors] || "bg-purple-500"
  }

  const getResellerAvatarColor = (name: string) => {
    const colors = {
      J: "bg-blue-500",
      G: "bg-purple-500",
      A: "bg-yellow-500",
    }
    return colors[name as keyof typeof colors] || "bg-gray-500"
  }

  const getEnterpriseAvatarColor = (name: string) => {
    const colors = {
      M: "bg-teal-500",
      A: "bg-purple-500",
      J: "bg-yellow-500",
    }
    return colors[name as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{agents.length}</div>
                <div className="text-sm text-muted-foreground">Total Agents</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Headphones className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{resellers.length}</div>
                <div className="text-sm text-muted-foreground">Total Resellers</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{isvs.length}</div>
                <div className="text-sm text-muted-foreground">Total ISVs</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="rounded-lg border bg-white">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">User Management</h2>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-8 px-6">
              {(["Agents", "ISVs", "Reseller", "Enterprise"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-4 text-sm font-medium transition-colors ${
                    activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4 p-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {activeTab === "Agents" && (
            <div className="overflow-x-auto">
              {isLoadingAgents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading agents...</p>
                  </div>
                </div>
              ) : agents.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No agents found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">S. No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Agent Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Organisation Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Created By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{agent.serialNo}</td>
                      <td className="px-6 py-4 text-sm font-medium">{agent.name}</td>
                      <td className="px-6 py-4 text-sm">{agent.category}</td>
                      <td className="px-6 py-4 text-sm">{agent.organisation}</td>
                      <td className="px-6 py-4 text-sm">{agent.language}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`text-xs text-white ${getAvatarColor(agent.createdBy.avatar)}`}>
                              {agent.createdBy.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{agent.createdBy.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{agent.lastUpdated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(agent.status)}
                          {agent.status === "Reject" && agent.rejectionReason && (
                            <div className="group relative">
                              <MessageSquare className="h-4 w-4 text-muted-foreground cursor-pointer" />
                              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block z-50">
                                <div className="rounded bg-[#1a1a1a] px-3 py-1.5 text-xs text-white whitespace-nowrap">
                                  Reason for rejection
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(agent)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApprove(agent)}>Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejectClick(agent)}>Reject</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "ISVs" && (
            <div className="overflow-x-auto">
              {isLoadingISVs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading ISVs...</p>
                  </div>
                </div>
              ) : isvs.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No ISVs found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">S. No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Org. Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">#Agents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Registered Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Processing Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isvs.map((isv) => (
                    <tr key={isv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{isv.serialNo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`text-xs text-white ${getISVAvatarColor(isv.avatar)}`}>
                              {isv.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{isv.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{isv.position}</td>
                      <td className="px-6 py-4 text-sm">{isv.orgName}</td>
                      <td className="px-6 py-4 text-sm">{isv.agentCount}</td>
                      <td className="px-6 py-4 text-sm">{isv.registeredName}</td>
                      <td className="px-6 py-4">{getISVProcessingStatusBadge(isv.processingStatus)}</td>
                      <td className="px-6 py-4 text-sm">{isv.domain}</td>
                      <td className="px-6 py-4 text-sm">{isv.contact}</td>
                      <td className="px-6 py-4">{getISVStatusBadge(isv.status)}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleISVView(isv)}>View</DropdownMenuItem>
                            {isv.processingStatus === "Pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleISVApprove(isv)}>Approve</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleISVRejectClick(isv)}>Reject</DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "Reseller" && (
            <div className="overflow-x-auto">
              {isLoadingResellers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading resellers...</p>
                  </div>
                </div>
              ) : resellers.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No resellers found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">S. No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">User Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Registered Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Processing Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {resellers.map((reseller) => (
                    <tr key={reseller.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{reseller.serialNo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`text-xs text-white ${getResellerAvatarColor(reseller.avatar)}`}>
                              {reseller.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{reseller.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{reseller.position}</td>
                      <td className="px-6 py-4 text-sm">{reseller.registeredName}</td>
                      <td className="px-6 py-4 text-sm">{reseller.contact}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getResellerProcessingStatusBadge(reseller.processingStatus)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{reseller.domain}</td>
                      <td className="px-6 py-4">{getResellerStatusBadge(reseller.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {reseller.processingStatus === "Reject" && reseller.rejectionReason && (
                            <div className="group relative">
                              <MessageSquare className="h-4 w-4 text-muted-foreground cursor-pointer" />
                              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block z-50">
                                <div className="rounded bg-[#1a1a1a] px-3 py-1.5 text-xs text-white whitespace-nowrap">
                                  Reason for rejection
                                </div>
                              </div>
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleResellerView(reseller)}>View</DropdownMenuItem>
                              {reseller.processingStatus === "Pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleResellerApprove(reseller)}>
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResellerRejectClick(reseller)}>
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "Enterprise" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">S. No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Contact Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Tech Stack</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {enterpriseUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{user.serialNo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`text-xs text-white ${getEnterpriseAvatarColor(user.avatar)}`}>
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{user.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.company}</td>
                      <td className="px-6 py-4 text-sm">{user.contactNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.techStack.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEnterpriseView(user)}>View</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Agent Details Drawer */}
      {selectedAgent && (
        <AgentDetailsDrawer
          agent={selectedAgent}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onApprove={handleApprove}
          onReject={() => {
            setAgentToReject(selectedAgent)
            setIsRejectModalOpen(true)
          }}
        />
      )}

      {/* Reject Modal */}
      {agentToReject && (
        <RejectAgentModal
          agent={agentToReject}
          open={isRejectModalOpen}
          onOpenChange={setIsRejectModalOpen}
          onReject={handleReject}
        />
      )}

      {selectedISV && (
        <ISVDetailsDrawer
          isv={selectedISV}
          open={isISVDrawerOpen}
          onOpenChange={setIsISVDrawerOpen}
          onApprove={handleISVApprove}
          onReject={() => {
            setISVToReject(selectedISV)
            setIsRejectISVModalOpen(true)
          }}
          onUpdate={handleISVUpdate}
        />
      )}

      {isvToReject && (
        <RejectISVModal
          isv={isvToReject}
          open={isRejectISVModalOpen}
          onOpenChange={setIsRejectISVModalOpen}
          onReject={handleISVReject}
        />
      )}

      {selectedReseller && (
        <ResellerDetailsDrawer
          reseller={selectedReseller}
          open={isResellerDrawerOpen}
          onOpenChange={setIsResellerDrawerOpen}
          onApprove={handleResellerApprove}
          onReject={() => {
            setResellerToReject(selectedReseller)
            setIsRejectResellerModalOpen(true)
          }}
          onUpdate={handleResellerUpdate}
        />
      )}

      {resellerToReject && (
        <RejectResellerModal
          reseller={resellerToReject}
          open={isRejectResellerModalOpen}
          onOpenChange={setIsRejectResellerModalOpen}
          onReject={handleResellerReject}
        />
      )}

      {selectedEnterpriseUser && (
        <EnterpriseDetailsDrawer
          user={selectedEnterpriseUser}
          open={isEnterpriseDrawerOpen}
          onOpenChange={setIsEnterpriseDrawerOpen}
        />
      )}

      <Toaster />
    </div>
  )
}
