import { useMemo } from 'react'
import { firebaseAuthService } from '../services/firebase-auth'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  auth?: boolean
}

export interface ApiClient {
  request<T = unknown>(url: string, options?: ApiOptions): Promise<T>
  requestRaw(url: string, options?: ApiOptions): Promise<Response>
  get<T = unknown>(url: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T>
  post<T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T>
  patch<T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T>
  put<T = unknown>(url: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T>
  delete<T = unknown>(url: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T>
}

export function createApi(baseURL?: string): ApiClient {
  const request: ApiClient['request'] = async (url, options = {}) => {
    const { method = 'GET', headers = {}, body, auth = false } = options

    const finalHeaders: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      ...headers,
    }

    if (body !== undefined) {
      finalHeaders['Content-Type'] = 'application/json'
    }

    if (auth) {
      const authHeaders = firebaseAuthService.getGitHubApiHeaders()
      if (authHeaders.Authorization) {
        finalHeaders['Authorization'] = authHeaders.Authorization
      }
    }

    const fullUrl = baseURL ? `${baseURL}${url}` : url

    const res = await fetch(fullUrl, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      let message = `HTTP ${res.status}`
      try {
        const text = await res.text()
        message = `HTTP ${res.status} - ${text || res.statusText}`
      } catch {
        // ignore
      }
      throw new Error(message)
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return undefined
    }
    return res.json() as Promise<any>
  }

  return {
    request: request,
    requestRaw: async (url, options = {}) => {
      const { method = 'GET', headers = {}, body, auth = false } = options

      const finalHeaders: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        ...headers,
      }

      if (body !== undefined) {
        finalHeaders['Content-Type'] = 'application/json'
      }

      if (auth) {
        const authHeaders = firebaseAuthService.getGitHubApiHeaders()
        if (authHeaders.Authorization) {
          finalHeaders['Authorization'] = authHeaders.Authorization
        }
      }

      const fullUrl = baseURL ? `${baseURL}${url}` : url
      const res = await fetch(fullUrl, {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
      return res
    },
    get: (url, opts) => request(url, { ...opts, method: 'GET' }),
    post: (url, body, opts) => request(url, { ...opts, method: 'POST', body }),
    patch: (url, body, opts) => request(url, { ...opts, method: 'PATCH', body }),
    put: (url, body, opts) => request(url, { ...opts, method: 'PUT', body }),
    delete: (url, opts) => request(url, { ...opts, method: 'DELETE' }),
  }
}

export function useApi(baseURL?: string): ApiClient {
  const client = useMemo<ApiClient>(() => {
    return createApi(baseURL)
  }, [baseURL])

  return client
}
