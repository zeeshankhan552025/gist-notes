import { firebaseAuthService } from './firebase-auth'
import { createApi } from '../hooks/useApi'
import type { GitHubUser } from '../types/github.types'

export interface GitHubGist {
  id: string
  html_url: string
  description: string | null
  public: boolean
  created_at: string
  updated_at: string
  files: Record<string, {
      filename: string
      type: string
      language: string | null
      raw_url: string
      size: number
      content?: string
    }>
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

  async fetchPublicGists(page = 1, perPage = 10): Promise<GitHubGistResponse> {
    const response = await this.api.requestRaw(`/gists/public?page=${page}&per_page=${perPage}`)
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
    const gists = await response.json() as GitHubGist[]
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
    return response.json() as Promise<GitHubGist>
  }

  async fetchUserGists(username: string, page = 1, perPage = 10): Promise<GitHubGistResponse> {
    const response = await this.api.requestRaw(`/users/${username}/gists?page=${page}&per_page=${perPage}`)
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
    const gists = await response.json() as GitHubGist[]
    const linkHeader = response.headers.get('link')
    const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
    const hasPrev = page > 1
    return { gists, hasNext, hasPrev, currentPage: page }
  }

  async fetchAuthenticatedUserGists(page = 1, perPage = 5): Promise<GitHubGistResponse> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    const response = await this.api.requestRaw(`/gists?page=${page}&per_page=${perPage}`, { headers, auth: true })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }
    const gists = await response.json() as GitHubGist[]
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
      const errorData = await response.json().catch(() => ({})) as { message?: string }
      throw new Error(`GitHub API error: ${response.status} - ${errorData.message ?? 'Unknown error'}`)
    }
    const searchResult = await response.json() as { items?: unknown[] }
    if (!searchResult.items || searchResult.items.length === 0) return []
    const gistIds = new Set<string>()
    searchResult.items.forEach((item: unknown) => {
      const itemObj = item as { repository?: { name?: string } }
      if (itemObj.repository?.name?.match(/^gist:/)) {
        const gistId = itemObj.repository.name.replace('gist:', '')
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

  async searchGistsByName(query: string): Promise<GitHubGist[]> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    const useAuth = headers.Authorization !== ''
    
    try {
      // First, get the user's own gists to search through
      let allGists: GitHubGist[] = []
      
      if (useAuth) {
        // Search authenticated user's gists
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 5) { // Limit to 5 pages to avoid too many API calls
          const response = await this.fetchAuthenticatedUserGists(page, 30)
          allGists = [...allGists, ...response.gists]
          hasMore = response.hasNext
          page++
        }
      }
      
      // Also search public gists (limited sample)
      try {
        const publicResponse = await this.fetchPublicGists(1, 30)
        allGists = [...allGists, ...publicResponse.gists]
      } catch {
        // Ignore public gist errors, just continue with user gists
      }
      
      // Filter gists by name/description
      const queryLower = query.toLowerCase()
      const matchingGists = allGists.filter(gist => {
        const description = (gist.description ?? '').toLowerCase()
        const fileName = Object.keys(gist.files)[0]?.toLowerCase() ?? ''
        
        return description.includes(queryLower) || fileName.includes(queryLower)
      })
      
      // Sort by relevance (exact matches first, then partial matches)
      return matchingGists.sort((a, b) => {
        const aDesc = (a.description ?? '').toLowerCase()
        const bDesc = (b.description ?? '').toLowerCase()
        
        // Exact description match gets highest priority
        if (aDesc === queryLower && bDesc !== queryLower) return -1
        if (bDesc === queryLower && aDesc !== queryLower) return 1
        
        // Description starts with query gets second priority
        if (aDesc.startsWith(queryLower) && !bDesc.startsWith(queryLower)) return -1
        if (bDesc.startsWith(queryLower) && !aDesc.startsWith(queryLower)) return 1
        
        // Most recent first for same relevance
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }).slice(0, 10) // Limit to 10 results
      
    } catch (error: unknown) {
      console.error('Error searching gists by name:', error)
      return []
    }
  }

  async getAuthenticatedUser(): Promise<GitHubUser> {
    const headers = firebaseAuthService.getGitHubApiHeaders()
    if (!headers.Authorization) throw new Error('No authentication token available')
    return this.api.get<GitHubUser>(`/user`, { headers, auth: true })
  }
}

export const githubApiService = new GitHubApiService()
