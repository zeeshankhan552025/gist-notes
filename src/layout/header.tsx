import { useState } from "react"
import { Avatar, Button, Dropdown, Input, message } from "antd"
import { LogoutOutlined, SearchOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"
import { githubApiService } from "../services/github-api"
import type { GitHubGist } from "../services/github-api"
import { useAuth } from "../contexts/AuthContext"
import "./header.scss"

interface HeaderProps {
  onSearchResult?: (result: GitHubGist | { cleared?: boolean; multiple?: boolean; results?: GitHubGist[] }) => void
}

export function Header({ onSearchResult }: HeaderProps) {
  const { isAuthenticated, userInfo, login, logout } = useAuth()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [searching, setSearching] = useState(false)

  const handleGitHubLogin = async () => {
    try {
      await login()
      message.success('Successfully logged in with GitHub!')
    } catch {
      message.error('Failed to login. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      message.success('Logged out successfully')
    } catch {
      message.error('Failed to logout. Please try again.')
    }
  }

  const extractGistId = (input: string): string => {
    const trimmed = input.trim()
    
    // If it's already just an ID (alphanumeric string), return as is
    if (/^[a-f0-9]+$/i.test(trimmed)) {
      return trimmed
    }
    
    // Extract from various URL formats:
    // https://gist.github.com/username/abc123def456
    // https://api.github.com/gists/abc123def456
    // abc123def456
    const urlPatterns = [
      /gist\.github\.com\/[^/]+\/([a-f0-9]+)/i,  // gist.github.com/user/id
      /api\.github\.com\/gists\/([a-f0-9]+)/i,     // api.github.com/gists/id
      /gists\/([a-f0-9]+)/i,                       // gists/id
      /([a-f0-9]{20,})/i                          // any long hex string
    ]
    
    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern)
      if (match?.[1]) {
        return match[1]
      }
    }
    
    // Return original if no pattern matches
    return trimmed
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setSearchValue(value)
    
    // If input is cleared, reset search results
    if (!value.trim()) {
      onSearchResult?.({ cleared: true })
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault() // Prevent form submission
    }
    
    if (!searchValue.trim()) {
      message.warning('Please enter a Gist ID, URL, or search terms')
      return
    }

    try {
      setSearching(true)
      const input = searchValue.trim()
      
      let results: GitHubGist[] = []
      // Check if input looks like a Gist ID or URL
      const gistId = extractGistId(input)
      
      if (gistId !== input && gistId.length >= 20) {
        // It's a URL or valid Gist ID, search by ID
        try {
          const gist = await githubApiService.searchGistById(gistId)
          if (gist) {
            results = [gist]
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('404')) {
            message.error('Gist not found or is private. Please check the Gist ID.')
          } else {
            message.error('Error searching. Please try again.')
          }
        }
      } else if (isAuthenticated) {
        // It's search terms, search by content and name (requires authentication)
        try {
          // Search by both content and name/description
          const [contentResults, nameResults] = await Promise.all([
            githubApiService.searchGists(input).catch(() => []),
            githubApiService.searchGistsByName(input).catch(() => [])
          ])
          
          // Combine results, avoiding duplicates
          const allResults = [...nameResults]
          contentResults.forEach(contentGist => {
            if (!allResults.some(nameGist => nameGist.id === contentGist.id)) {
              allResults.push(contentGist)
            }
          })
          
          results = allResults.slice(0, 10) // Limit to 10 total results
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('403')) {
            message.error('Rate limit exceeded. Please try again later.')
          } else {
            message.error('Error searching. Please try again.')
          }
        }
      } else {
        // Not authenticated, suggest login for content search
        message.warning('Please log in with GitHub to search gist names and content, or paste a gist URL/ID for direct access.')
        return
      }
      
      if (results.length > 0) {
        message.success(`Found ${results.length} gist${results.length > 1 ? 's' : ''}!`)
        if (onSearchResult) {
          // Page will handle showing the results inline
          if (results.length === 1) {
            onSearchResult(results[0])
          } else {
            // For multiple results, pass the first one or handle differently
            onSearchResult({ multiple: true, results })
          }
        } else {
          // No page handler, navigate to first gist detail page
          void navigate(`/gist/${results[0].id}`)
        }
        // Clear search input after successful search
        setSearchValue('')
      } else {
        // Still call the handler to let the page know a search was performed
        if (onSearchResult) {
          onSearchResult({ multiple: true, results: [] })
        }
        message.error('No gists found. Try different search terms.')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Search failed. Please try again.')
      }
    } finally {
      setSearching(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission
      void handleSearch()
    }
  }

  const handleMenuClick = (info: { key: string }) => {
    switch (info.key) {
      case 'profile':
        void navigate('/profile')
        break
      case 'settings':
        // You can navigate to settings page when it's created
        message.info('Settings page coming soon!')
        break
      case 'logout':
        void handleLogout()
        break
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ]

  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner">
        {/* Left side - Brand */}
        <div 
          className="topbar__brand" 
          aria-label="Brand"
          onClick={() => void navigate('/')}
        >
          <span aria-hidden="true">
            <img src="/logo.svg" alt="EMUMBA Logo" />
          </span>
          <span className="topbar__name">EMUMBA</span>
        </div>

        {/* Right side - Search and User actions */}
        <div className="topbar__right">
          <form className="topbar__search" role="search" aria-label="Search gists by ID" onSubmit={(e) => void handleSearch(e)}>
            <Input
              allowClear
              placeholder={isAuthenticated 
                ? "Search gists by name, content or paste Gist URL/ID... (Try: 'react' or test with a gist ID)" 
                : "Login to search by name/content, or paste Gist URL/ID... (Try pasting a gist URL)"}
              prefix={<SearchOutlined />}
              suffix={
                <Button 
                  type="text" 
                  size="small"
                  loading={searching}
                  onClick={() => void handleSearch()}
                  icon={<SearchOutlined />}
                  aria-label="Search"
                >
                </Button>
              }
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              className="topbar__search-input"
              type="search"
              aria-label="Search gists by ID"
            />
          </form>

          <div className="topbar__actions">
            {isAuthenticated ? (
              <>
                <Button 
                  type="default" 
                  onClick={() => void navigate('/create-gist')}
                  style={{ marginRight: '12px' }}
                >
                  Create Gist
                </Button>
                <Dropdown 
                  menu={{ items: userMenuItems, onClick: handleMenuClick }} 
                  placement="bottomRight" 
                  arrow
                >
                <div className="topbar__user-menu">
                  <Avatar 
                    size={32}
                    className="topbar__avatar"
                    src={userInfo?.photoURL}
                  >
                    {!userInfo?.photoURL && getUserInitials(userInfo?.displayName ?? null)}
                  </Avatar>
                </div>
              </Dropdown>
              </>
            ) : (
              <Button 
                type="primary" 
                className="topbar__login" 
                onClick={() => void handleGitHubLogin()}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
