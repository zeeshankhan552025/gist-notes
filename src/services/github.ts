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
  private perPage = 30

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
      const response = await fetch(`${this.baseURL}/gists/${gistId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`GitHub API error: ${response.status}`)
      }

      return await response.json()
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
}

export const githubService = new GitHubService()