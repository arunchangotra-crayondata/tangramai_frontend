const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use proxy in production to avoid CORS issues
  : ''

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

export const endpoints = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    health: '/api/health',
  },
  agent: {
    onboard: '/api/agent/onboard',
  },
  admin: {
    agents: '/api/admin/agents',
    updateAgent: (agentId: string) => `/api/admin/agents/${agentId}`,
    isvs: '/api/admin/isvs',
    updateIsv: (isvId: string) => `/api/admin/isvs/${isvId}`,
    resellers: '/api/admin/resellers',
    updateReseller: (resellerId: string) => `/api/admin/resellers/${resellerId}`,
  },
} as const

// Helper function to create full URL
export const createApiUrl = (endpoint: string) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the Next.js API proxy to avoid CORS issues
    return `/api/proxy${endpoint}`
  }
  // In development, use the Next.js rewrites
  return endpoint
}

// Helper function to create form data from object
export const createFormData = (data: Record<string, any>) => {
  const formData = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value))
    }
  })
  return formData
}
