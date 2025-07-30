import { authStorage } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

export const api = {
  async request(endpoint: string, options: ApiOptions = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true
    } = options

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    // Add authentication token if required
    if (requireAuth) {
      const token = authStorage.getToken()
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    }

    // Add body if provided
    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  // Convenience methods
  get: (endpoint: string, options?: Omit<ApiOptions, 'method'>) => 
    api.request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api.request(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api.request(endpoint, { ...options, method: 'PUT', body }),

  delete: (endpoint: string, options?: Omit<ApiOptions, 'method'>) => 
    api.request(endpoint, { ...options, method: 'DELETE' }),

  patch: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api.request(endpoint, { ...options, method: 'PATCH', body })
} 