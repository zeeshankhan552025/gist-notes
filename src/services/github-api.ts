import { firebaseAuthService } from './firebase-auth'
import { createApi } from '../hooks/useApi'

export interface GitHubGist {
  id: string
  html_url: string
  description: string | null
  public: boolean
  created_at: string
  updated_at: string
  files: {
    [filename: string]: {
      filename: string
      type: string
      language: string | null
      raw_url: string
      size: number
      content?: string
    }
  }
  owner: {
    login: string
    id: number
    avatar_url: string
    html_url: string
  }
  comments: number
  git_pull_url: string
  git_push_url: string
}

export interface GitHubGistResponse {
  gists: GitHubGist[]
  hasNext: boolean
  hasPrev: boolean
  currentPage: number
  totalPages?: number
}

class GitHubApiService {
  private baseURL = 'https://api.github.com'
  private api = createApi(this.baseURL)

  async fetchPublicGists(page: number = 1, perPage: number = 10): Promise<GitHubGistResponse> {
    const response = await this.api.requestRaw(`/gists/public?page=${page}&per_page=${perPage}`)
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
    const gists: GitHubGist[] = await response.json()
    const linkHeader = response.headers.get('link')
    const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
    const hasPrev = page > 1
    return { gists, hasNext, hasPrev, currentPage: page }
  }

  async searchGistById(gistId: string): Promise<GitHubGist | null> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    const useAuth = headers.Authorization !== ''
    const response = await this.api.requestRaw(`/gists/${gistId}`, { headers: useAuth ? headers : {} })
    if (!response.ok) {
      if (response.status === 404) return null
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }
    return response.json()
  }

  async fetchUserGists(username: string, page: number = 1, perPage: number = 10): Promise<GitHubGistResponse> {
    const response = await this.api.requestRaw(`/users/${username}/gists?page=${page}&per_page=${perPage}`)
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
    const gists: GitHubGist[] = await response.json()
    const linkHeader = response.headers.get('link')
    const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
    const hasPrev = page > 1
    return { gists, hasNext, hasPrev, currentPage: page }
  }

  async fetchAuthenticatedUserGists(page: number = 1, perPage: number = 5): Promise<GitHubGistResponse> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    const response = await this.api.requestRaw(`/gists?page=${page}&per_page=${perPage}`, { headers, auth: true })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }
    const gists: GitHubGist[] = await response.json()
    const linkHeader = response.headers.get('link')
    const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
    const hasPrev = page > 1
    return { gists, hasNext, hasPrev, currentPage: page }
  }

  async createGist(gistData: { description: string; public: boolean; files: Record<string, { content: string }> }): Promise<GitHubGist> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    return this.api.post<GitHubGist>(`/gists`, gistData, { headers, auth: true })
  }

  async updateGist(gistId: string, gistData: { description?: string; files?: Record<string, { content: string }> }): Promise<GitHubGist> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    return this.api.patch<GitHubGist>(`/gists/${gistId}`, gistData, { headers, auth: true })
  }

  async deleteGist(gistId: string): Promise<void> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    await this.api.delete<void>(`/gists/${gistId}`, { headers, auth: true })
  }

  async searchGists(query: string): Promise<GitHubGist[]> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    const useAuth = headers.Authorization !== ''
    if (!useAuth) throw new Error('Authentication required for gist search. Please log in with GitHub.')
    const searchQuery = encodeURIComponent(`${query} in:file gist:yes`)
    const response = await this.api.requestRaw(`/search/code?q=${searchQuery}`, { headers, auth: true })
    if (!response.ok) {
      if (response.status === 401) throw new Error('Authentication required. Please log in with GitHub.')
      if (response.status === 403) throw new Error('Rate limit exceeded. Please try again later.')
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
    }
    const searchResult = await response.json()
    if (!searchResult.items || searchResult.items.length === 0) return []
    const gistIds = new Set<string>()
    searchResult.items.forEach((item: any) => {
      if (item.repository && item.repository.name && item.repository.name.match(/^gist:/)) {
        const gistId = item.repository.name.replace('gist:', '')
        gistIds.add(gistId)
      }
    })
    const gists = await Promise.all(
      Array.from(gistIds)
        .slice(0, 10)
        .map(async (gistId) => {
          try {
            return await this.searchGistById(gistId)
          } catch {
            return null
          }
        })
    )
    return gists.filter((g): g is GitHubGist => g !== null)
  }

  async getAuthenticatedUser(): Promise<any> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    return this.api.get<any>(`/user`, { headers, auth: true })
  }
}

export const githubApiService = new GitHubApiService()
