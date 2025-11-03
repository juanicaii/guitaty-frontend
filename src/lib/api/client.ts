import type { ApiError } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * API Client with Clerk authentication support
 */
class ApiClient {
  private baseUrl: string
  private getToken: (() => Promise<string | null>) | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Set the function to get Clerk auth token
   */
  setAuthTokenGetter(getter: () => Promise<string | null>) {
    this.getToken = getter
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Get authorization headers
   */
  private async getHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string>),
    }

    // Get Clerk token if available
    if (this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, headers: customHeaders, ...fetchOptions } = options

    const url = this.buildUrl(endpoint, params)
    const headers = await this.getHeaders(customHeaders)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      // Parse response
      const data = await response.json().catch(() => null)

      // Handle errors
      if (!response.ok) {
        const errorMessage = (data as ApiError)?.error || response.statusText
        throw new ApiClientError(response.status, errorMessage, data)
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }

      // Network or parsing errors
      throw new ApiClientError(
        0,
        error instanceof Error ? error.message : 'Network error',
        error
      )
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export helper to configure Clerk auth
export const configureApiAuth = (getToken: () => Promise<string | null>) => {
  apiClient.setAuthTokenGetter(getToken)
}
