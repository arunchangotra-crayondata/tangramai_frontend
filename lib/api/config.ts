const API_BASE_URL = process.env.NODE_ENV === 'development' ? '' : 'https://agents-store.onrender.com'

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
} as const

// Helper function to create full URL
export const createApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`

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
