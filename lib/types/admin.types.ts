// Status types
export type AgentStatus = "Pending" | "Approved" | "Reject"
export type ISVProcessingStatus = "Pending" | "Approved"
export type ISVStatus = "Active" | "Inactive"
export type ResellerProcessingStatus = "Pending" | "Approved" | "Reject"
export type ResellerStatus = "Active" | "Inactive"

// API Entity interfaces (from backend - snake_case)
export interface AgentAPIResponse {
  agent_id: string
  agent_name: string
  asset_type?: string
  description?: string
  status: AgentStatus
  rejection_reason?: string
  created_by?: string
  isv_id?: string
  last_updated?: string
  [key: string]: any // Allow additional fields
}

export interface ISVAPIResponse {
  isv_id: string
  isv_name: string
  isv_email?: string
  isv_address?: string
  isv_domain?: string
  isv_mob_no?: string
  processing_status: ISVProcessingStatus
  status: ISVStatus
  registered_name?: string
  agent_count?: number
  [key: string]: any
}

export interface ResellerAPIResponse {
  reseller_id: string
  reseller_name: string
  reseller_email?: string
  reseller_address?: string
  reseller_domain?: string
  reseller_mob_no?: string
  processing_status: ResellerProcessingStatus
  status: ResellerStatus
  registered_name?: string
  rejection_reason?: string
  [key: string]: any
}

// Frontend Entity interfaces (camelCase for UI)
export interface Agent {
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

export interface ISV {
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

export interface Reseller {
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

export interface EnterpriseUser {
  id: string
  serialNo: string
  userName: string
  avatar: string
  email: string
  company: string
  contactNumber: string
  techStack: string[]
}

// API Request types
export interface UpdateAgentRequest {
  status: AgentStatus
  rejection_reason?: string
}

export interface UpdateISVRequest {
  processing_status?: ISVProcessingStatus
  status?: ISVStatus
  rejection_reason?: string
}

export interface UpdateResellerRequest {
  processing_status?: ResellerProcessingStatus
  status?: ResellerStatus
  rejection_reason?: string
}

// API Response types
export interface AdminApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

