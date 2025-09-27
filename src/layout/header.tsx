import { useState } from "react"
import { Input, Button, Avatar, Dropdown, message } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"
import { githubService } from "../services/github"
import { useAuth } from "../contexts/AuthContext"
import "./header.scss"

interface HeaderProps {
  onSearchResult?: (gist: any) => void
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
    } catch (error) {
      console.error('Login failed:', error)
      message.error('Failed to login. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      message.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
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
      /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/i,  // gist.github.com/user/id
      /api\.github\.com\/gists\/([a-f0-9]+)/i,     // api.github.com/gists/id
      /gists\/([a-f0-9]+)/i,                       // gists/id
      /([a-f0-9]{20,})/i                          // any long hex string
    ]
    
    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    // Return original if no pattern matches
    return trimmed
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    // If input is cleared, reset search results
    if (!value.trim() && onSearchResult) {
      console.log('🔍 Search input cleared, resetting results')
      onSearchResult({ cleared: true })
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    console.log('🔍 Search triggered, input:', searchValue)
    console.log('🔍 isAuthenticated:', isAuthenticated)
    console.log('🔍 onSearchResult handler provided:', !!onSearchResult)
    
    if (e) {
      e.preventDefault() // Prevent form submission
      console.log('🔍 Form submission prevented')
    }
    
    if (!searchValue.trim()) {
      message.warning('Please enter a Gist ID, URL, or search terms')
      return
    }

    try {
      setSearching(true)
      const input = searchValue.trim()
      console.log('🔍 Processing search input:', input)
      
      let results: any[] = []
      
      // Check if input looks like a Gist ID or URL
      const gistId = extractGistId(input)
      console.log('🔍 Extracted gist ID:', gistId)
      console.log('🔍 Original input !== extracted ID:', gistId !== input)
      console.log('🔍 Gist ID length:', gistId.length)
      
      if (gistId !== input && gistId.length >= 20) {
        // It's a URL or valid Gist ID, search by ID
        console.log('🔍 Searching by Gist ID:', gistId)
        const gist = await githubService.searchGistById(gistId)
        if (gist) {
          console.log('🔍 Found gist by ID:', gist.id)
          results = [gist]
        } else {
          console.log('🔍 No gist found for ID:', gistId)
        }
      } else if (isAuthenticated) {
        // It's search terms, search by content (requires authentication)
        console.log('🔍 Searching by content:', input)
        results = await githubService.searchGists(input)
        console.log('🔍 Content search results:', results.length)
      } else {
        // Not authenticated, suggest login for content search
        console.log('🔍 Not authenticated, showing login message')
        message.warning('Please log in with GitHub to search gist content, or paste a gist URL/ID for direct access.')
        return
      }
      
      console.log('🔍 Final results:', results.length, results)
      
      if (results.length > 0) {
        console.log('🔍 Search results found:', results)
        message.success(`Found ${results.length} gist${results.length > 1 ? 's' : ''}!`)
        if (onSearchResult) {
          console.log('🔍 Calling onSearchResult handler')
          // Page will handle showing the results inline
          if (results.length === 1) {
            onSearchResult(results[0])
          } else {
            // For multiple results, pass the first one or handle differently
            onSearchResult({ multiple: true, results })
          }
        } else {
          console.log('🔍 No onSearchResult handler, navigating to gist')
          // No page handler, navigate to first gist detail page
          navigate(`/gist/${results[0].id}`)
        }
        // Clear search input after successful search
        setSearchValue('')
      } else {
        console.log('🔍 No results found')
        // Still call the handler to let the page know a search was performed
        if (onSearchResult) {
          console.log('🔍 Calling onSearchResult with empty results')
          onSearchResult({ multiple: true, results: [] })
        }
        message.error('No gists found. Try different search terms.')
        console.log('No results found for:', input)
      }
    } catch (error: any) {
      console.error('🔍 Search error:', error)
      if (error.message && error.message.includes('Authentication required')) {
        message.error('Please log in with GitHub to search gist content.')
      } else if (error.message && error.message.includes('404')) {
        message.error('Gist not found or is private. Please check the Gist ID.')
      } else if (error.message && error.message.includes('403')) {
        message.error('Rate limit exceeded. Please try again later.')
      } else {
        message.error('Error searching. Please try again.')
      }
    } finally {
      setSearching(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission
      handleSearch()
    }
  }

  const handleMenuClick = (info: any) => {
    switch (info.key) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        // You can navigate to settings page when it's created
        message.info('Settings page coming soon!')
        break
      case 'logout':
        handleLogout()
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
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <span aria-hidden="true">
            <img src="/logo.svg" alt="EMUMBA Logo" />
          </span>
          <span className="topbar__name">EMUMBA</span>
        </div>

        {/* Right side - Search and User actions */}
        <div className="topbar__right">
          <form className="topbar__search" role="search" aria-label="Search gists by ID" onSubmit={handleSearch}>
            <Input
              allowClear
              placeholder={isAuthenticated 
                ? "Search gists by content or paste Gist URL/ID... (Try: 'fetch' or test with a real gist ID)" 
                : "Login to search content, or paste Gist URL/ID... (Try pasting a gist URL)"}
              prefix={<SearchOutlined />}
              suffix={
                <Button 
                  type="text" 
                  size="small"
                  loading={searching}
                  onClick={() => handleSearch()}
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
                  onClick={() => navigate('/create-gist')}
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
                    style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                    src={userInfo?.photoURL}
                  >
                    {!userInfo?.photoURL && getUserInitials(userInfo?.displayName || null)}
                  </Avatar>
                </div>
              </Dropdown>
              </>
            ) : (
              <Button 
                type="primary" 
                className="topbar__login" 
                onClick={handleGitHubLogin}
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
