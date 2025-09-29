/**
 * GitHub Gist file structure
 */
export interface GitHubGistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  content?: string;
}

/**
 * GitHub Gist owner information
 */
export interface GitHubGistOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

/**
 * Main GitHub Gist interface
 */
export interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
  files: Record<string, GitHubGistFile>;
  owner: GitHubGistOwner;
  comments: number;
  git_pull_url: string;
  git_push_url: string;
}

/**
 * GitHub API response for gists with pagination
 */
export interface GitHubGistResponse {
  gists: GitHubGist[];
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
  totalPages?: number;
}

/**
 * GitHub user profile information
 */
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/**
 * Gist creation data
 */
export interface GistCreateData {
  description: string;
  public: boolean;
  files: Record<string, { content: string }>;
}

/**
 * Gist update data
 */
export interface GistUpdateData {
  description?: string;
  files?: Record<string, { content: string }>;
}

/**
 * GitHub API error response
 */
export interface GitHubApiError {
  message: string;
  errors?: {
    resource: string;
    field: string;
    code: string;
  }[];
  documentation_url?: string;
}
