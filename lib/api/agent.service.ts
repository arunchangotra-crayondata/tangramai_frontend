import { createApiUrl, createFormData } from './config'
import type { AgentOnboardRequest, AgentOnboardResponse, ApiError } from '../types/agent.types'

class AgentService {
  private async makeRequest<T>(
    endpoint: string,
    data: Record<string, any>,
    method: 'POST' = 'POST'
  ): Promise<T> {
    try {
      const url = createApiUrl(endpoint)
      const formData = createFormData(data)

      console.log('Making agent request to:', url)
      console.log('Request data:', Object.fromEntries(formData))

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include',
        mode: 'cors',
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`
        
        if (response.status === 500) {
          errorMessage = "Server error. Please try again or contact support."
        } else if (response.status === 422) {
          errorMessage = "Invalid data provided. Please check all fields and try again."
        } else if (response.status === 0) {
          errorMessage = "Network error. Please check your internet connection and try again."
        }
        
        throw {
          message: errorMessage,
          status: response.status,
          code: result.code,
        } as ApiError
      }

      return result
    } catch (error) {
      console.error('Agent request error:', error)
      
      if ((error as ApiError).message) {
        throw error
      }
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }
      throw error
    }
  }

  async onboardAgent(data: AgentOnboardRequest): Promise<AgentOnboardResponse> {
    return this.makeRequest<AgentOnboardResponse>('/api/agent/onboard', data)
  }
}

export const agentService = new AgentService()
