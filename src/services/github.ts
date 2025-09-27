import { firebaseAuthService } from './firebase-auth'

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

class GitHubService {
  private baseURL = 'https://api.github.com'
  private perPage = 10

  async fetchPublicGists(page: number = 1): Promise<GitHubGistResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/gists/public?page=${page}&per_page=${this.perPage}`
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const gists: GitHubGist[] = await response.json()
      
      // Check for next page by looking at Link header
      const linkHeader = response.headers.get('link')
      const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
      const hasPrev = page > 1

      return {
        gists,
        hasNext,
        hasPrev,
        currentPage: page
      }
    } catch (error) {
      console.error('Error fetching gists:', error)
      throw error
    }
  }

  async searchGistById(gistId: string): Promise<GitHubGist | null> {
    try {
      // Try with authentication first for private gists
      const headers = firebaseAuthService.getGitHubApiHeaders()
      const useAuth = headers.Authorization !== ''
      
      const response = await fetch(`${this.baseURL}/gists/${gistId}`, {
        headers: useAuth ? headers : {}
      })
      
      console.log(`Fetching gist ${gistId} with auth: ${useAuth}, status: ${response.status}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        const errorText = await response.text()
        console.error(`Error fetching gist ${gistId}:`, errorText)
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const gist = await response.json()
      console.log(`Gist ${gistId} content loaded:`, Object.keys(gist.files))
      return gist
    } catch (error) {
      console.error('Error searching gist:', error)
      throw error
    }
  }

  async fetchUserGists(username: string, page: number = 1): Promise<GitHubGistResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/users/${username}/gists?page=${page}&per_page=${this.perPage}`
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const gists: GitHubGist[] = await response.json()
      
      const linkHeader = response.headers.get('link')
      const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
      const hasPrev = page > 1

      return {
        gists,
        hasNext,
        hasPrev,
        currentPage: page
      }
    } catch (error) {
      console.error('Error fetching user gists:', error)
      throw error
    }
  }

  /**
   * Fetch authenticated user's gists using stored Firebase auth token
   */
  async fetchAuthenticatedUserGists(page: number = 1): Promise<GitHubGistResponse> {
    try {
      const headers = firebaseAuthService.getGitHubApiHeaders()
      console.log('Fetching gists with headers:', headers)
      
      if (!headers.Authorization) {
        throw new Error('No authentication token available')
      }

      const url = `${this.baseURL}/gists?page=${page}&per_page=${this.perPage}`
      console.log('Fetching gists from URL:', url)
      
      const response = await fetch(url, { headers })
      console.log('Gists API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('Gists API error response:', errorText)
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
      }

      const gists: GitHubGist[] = await response.json()
      console.log('Raw gists data:', gists)
      
      const linkHeader = response.headers.get('link')
      const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false
      const hasPrev = page > 1

      return {
        gists,
        hasNext,
        hasPrev,
        currentPage: page
      }
    } catch (error) {
      console.error('Error fetching authenticated user gists:', error)
      throw error
    }
  }

  /**
   * Create a new gist using authenticated user's token
   */
  async createGist(gistData: {
    description: string
    public: boolean
    files: Record<string, { content: string }>
  }): Promise<GitHubGist> {
    try {
      const headers = firebaseAuthService.getGitHubApiHeaders()
      
      if (!headers.Authorization) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${this.baseURL}/gists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(gistData)
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating gist:', error)
      throw error
    }
  }

  /**
   * Update an existing gist using authenticated user's token
   */
  async updateGist(gistId: string, gistData: {
    description?: string
    files?: Record<string, { content: string }>
  }): Promise<GitHubGist> {
    try {
      const headers = firebaseAuthService.getGitHubApiHeaders()
      
      if (!headers.Authorization) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${this.baseURL}/gists/${gistId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(gistData)
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating gist:', error)
      throw error
    }
  }

  /**
   * Delete a gist using authenticated user's token
   */
  async deleteGist(gistId: string): Promise<void> {
    try {
      const headers = firebaseAuthService.getGitHubApiHeaders()
      
      if (!headers.Authorization) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${this.baseURL}/gists/${gistId}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting gist:', error)
      throw error
    }
  }

  /**
   * Get authenticated user's profile information
   */
  async searchGists(query: string): Promise<GitHubGist[]> {
    try {
      // GitHub's code search API requires authentication
      const headers = firebaseAuthService.getGitHubApiHeaders()
      const useAuth = headers.Authorization !== ''
      
      if (!useAuth) {
        throw new Error('Authentication required for gist search. Please log in with GitHub.')
      }
      
      // Use GitHub's search API to search for gists
      const searchQuery = encodeURIComponent(`${query} in:file gist:yes`)
      const response = await fetch(`${this.baseURL}/search/code?q=${searchQuery}`, {
        headers
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in with GitHub.')
        }
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
      }

      const searchResult = await response.json()
      console.log('Search result:', searchResult)

      if (!searchResult.items || searchResult.items.length === 0) {
        return []
      }

      // Get unique gist IDs from search results
      const gistIds = new Set<string>()
      searchResult.items.forEach((item: any) => {
        if (item.repository && item.repository.name && item.repository.name.match(/^gist:/)) {
          const gistId = item.repository.name.replace('gist:', '')
          gistIds.add(gistId)
        }
      })

      // Fetch full gist data for each found gist ID
      const gistPromises = Array.from(gistIds).slice(0, 10).map(async (gistId) => {
        try {
          return await this.searchGistById(gistId)
        } catch (error) {
          console.error(`Error fetching gist ${gistId}:`, error)
          return null
        }
      })

      const gists = await Promise.all(gistPromises)
      return gists.filter((gist): gist is GitHubGist => gist !== null)
    } catch (error) {
      console.error('Error searching gists:', error)
      throw error
    }
  }

  async getAuthenticatedUser(): Promise<any> {
    try {
      const headers = firebaseAuthService.getGitHubApiHeaders()
      console.log('API Headers:', headers)
      
      if (!headers.Authorization) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${this.baseURL}/user`, { headers })
      console.log('GitHub API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('GitHub API error response:', errorText)
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
      }

      const userData = await response.json()
      console.log('GitHub API user data:', userData)
      return userData
    } catch (error) {
      console.error('Error fetching authenticated user:', error)
      throw error
    }
  }
}

export const githubService = new GitHubService()